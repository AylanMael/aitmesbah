import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ACCOUNT_STATUSES,
  createInvitedProfile,
  normalizeDisplayName,
  normalizeEmail,
  transitionAccount,
} from "../../lib/crm/account-lifecycle.mjs";

const NOW = "2026-08-20T10:00:00.000Z";
const ACTOR = "local-admin";

function invitedProfile() {
  return createInvitedProfile({
    uid: "local-member",
    displayName: "  Membre   Test  ",
    email: "MEMBER@EXAMPLE.TEST ",
    actorUid: ACTOR,
    now: NOW,
  });
}

test("aucune inscription publique n'est exposée dans le site", async () => {
  const packageJson = await readFile("package.json", "utf8");
  assert.doesNotMatch(packageJson, /createUserWithEmailAndPassword|signUp|signup/i);
});

test("les quatre seuls états de compte sont exposés", () => {
  assert.deepEqual(ACCOUNT_STATUSES, ["invited", "active", "suspended", "revoked"]);
  assert.throws(() => transitionAccount(invitedProfile(), "pending", {
    actorUid: ACTOR,
    reason: "test",
    now: NOW,
  }), /inconnu/);
});

test("l'invitation normalise les données et démarre sans rôle", () => {
  const profile = invitedProfile();
  assert.equal(profile.status, "invited");
  assert.equal(profile.email, "member@example.test");
  assert.equal(profile.displayName, "Membre Test");
  assert.deepEqual(profile.globalRoles, []);
  assert.deepEqual(profile.organizationMemberships, []);
  assert.equal(profile.version, 1);
});

test("email et nom d'affichage sont strictement normalisés", () => {
  assert.equal(normalizeEmail(" USER@EXAMPLE.TEST "), "user@example.test");
  assert.equal(normalizeDisplayName(" Nom   Test "), "Nom Test");
  assert.throws(() => normalizeEmail("invalide"));
  assert.throws(() => normalizeDisplayName("x"));
});

test("toutes les transitions autorisées réussissent et produisent un audit", () => {
  const expected = [
    ["invited", "active"],
    ["invited", "revoked"],
    ["active", "suspended"],
    ["active", "revoked"],
    ["suspended", "active"],
    ["suspended", "revoked"],
  ];
  for (const [from, to] of expected) {
    const source = { ...invitedProfile(), status: from };
    const result = transitionAccount(source, to, {
      actorUid: ACTOR,
      reason: `passage ${from}-${to}`,
      now: NOW,
    });
    assert.equal(result.profile.status, to);
    assert.equal(result.profile.version, 2);
    assert.equal(result.auditEvent.previousStatus, from);
    assert.equal(result.auditEvent.nextStatus, to);
    assert.equal(result.auditEvent.actorUid, ACTOR);
  }
});

test("les transitions interdites et la réactivation d'un compte révoqué échouent", () => {
  for (const [from, to] of [["invited", "suspended"], ["active", "invited"], ["suspended", "invited"], ["revoked", "active"]]) {
    assert.throws(() => transitionAccount({ ...invitedProfile(), status: from }, to, {
      actorUid: ACTOR,
      reason: "transition interdite",
      now: NOW,
    }), /interdite/);
  }
});

test("le titulaire ne peut pas modifier son statut", () => {
  assert.throws(() => transitionAccount(invitedProfile(), "active", {
    actorUid: "local-member",
    reason: "auto-activation",
    now: NOW,
  }), /titulaire/);
});

test("les champs inconnus sont refusés", () => {
  assert.throws(() => transitionAccount({ ...invitedProfile(), phone: "000" }, "active", {
    actorUid: ACTOR,
    reason: "test",
    now: NOW,
  }), /champs/);
});

test("versions invalides refusent sans mutation partielle du statut",()=>{for(const version of [undefined,0,-1,1.5,Number.MAX_SAFE_INTEGER]){const source={...invitedProfile(),version},before={...source};assert.throws(()=>transitionAccount(source,"active",{actorUid:ACTOR,reason:"test version",now:NOW}));assert.deepEqual(source,before);assert.equal(source.status,"invited");}});
