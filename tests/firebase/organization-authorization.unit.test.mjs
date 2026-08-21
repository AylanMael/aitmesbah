import assert from "node:assert/strict";
import test from "node:test";

import {
  GLOBAL_ROLES, ORGANIZATION_ROLES, assertMembership, assertOrganization,
  changeMembershipRoles, changeOrganizationMandate, changeOrganizationVerification,
  createOrganization, effectivePermissions, inviteMembership,
  transitionMembership, transitionOrganization,
} from "../../lib/crm/organization-authorization.mjs";

const NOW = "2026-08-21T08:00:00Z";
const ACTOR = "local-admin";
const create = (overrides = {}) => createOrganization({ organizationId: "group-alpha", name: "Groupe Alpha", type: "association", declaredScope: "Périmètre fictif", actorUid: ACTOR, now: NOW, ...overrides }).organization;
const activeOrganization = () => ({ ...create(), status: "active" });
const membership = (overrides = {}) => inviteMembership({ organizationId: "group-alpha", uid: "member-alpha", roles: ["association_manager"], actorUid: ACTOR, now: NOW, ...overrides }).membership;

test("organisation minimale non vérifiée et sans mandat", () => {
  const value = create(); assertOrganization(value);
  assert.equal(value.status, "registered"); assert.equal(value.verificationStatus, "unverified"); assert.equal(value.mandateStatus, "none");
});
test("organisation refuse champs, type, statut et identifiant inconnus", () => {
  assert.throws(() => assertOrganization({ ...create(), extra: true }), /champs/);
  assert.throws(() => create({ type: "company" }), /type/);
  assert.throws(() => assertOrganization({ ...create(), status: "official" }), /status/);
  assert.throws(() => create({ organizationId: "!" }), /organizationId/);
});
test("mandat valide exige comité vérifié et opération explicite", () => {
  assert.throws(() => assertOrganization({ ...create(), mandateStatus: "valid" }), /mandat/);
  const committee = create({ organizationId: "committee-test", name: "Comité Test", type: "village_committee" });
  const verified = changeOrganizationVerification(committee, "verified", { actorUid: ACTOR, reason: "preuve fictive", now: NOW }).organization;
  assert.equal(changeOrganizationMandate(verified, "valid", { actorUid: ACTOR, reason: "mandat fictif", now: NOW }).organization.mandateStatus, "valid");
});
test("transitions d'organisation autorisées, interdites et auditées", () => {
  const active = transitionOrganization(create(), "active", { actorUid: ACTOR, reason: "activation", now: NOW });
  assert.equal(active.auditEvent.action, "organization.status_changed");
  assert.equal(transitionOrganization(active.organization, "suspended", { actorUid: ACTOR, reason: "suspension", now: NOW }).organization.status, "suspended");
  assert.throws(() => transitionOrganization(create(), "suspended", { actorUid: ACTOR, reason: "non", now: NOW }), /interdite/);
  assert.throws(() => transitionOrganization({ ...create(), status: "archived" }, "active", { actorUid: ACTOR, reason: "non", now: NOW }), /interdite/);
});
test("appartenance stricte, rôles locaux uniquement et aucune auto-attribution", () => {
  assertMembership(membership());
  assert.throws(() => membership({ roles: ["administrator"] }), /rôle/);
  assert.throws(() => membership({ roles: ["unknown"] }), /rôle/);
  assert.throws(() => membership({ uid: ACTOR }), /auto-attribution/);
});
test("transitions d'appartenance autorisées, interdites, définitives et auditées", () => {
  const active = transitionMembership(membership(), "active", { actorUid: ACTOR, reason: "activation", now: NOW });
  assert.equal(active.auditEvent.action, "membership.status_changed");
  const suspended = transitionMembership(active.membership, "suspended", { actorUid: ACTOR, reason: "pause", now: NOW }).membership;
  assert.equal(transitionMembership(suspended, "active", { actorUid: ACTOR, reason: "retour", now: NOW }).membership.status, "active");
  const revoked = transitionMembership(active.membership, "revoked", { actorUid: ACTOR, reason: "fin", now: NOW }).membership;
  assert.throws(() => transitionMembership(revoked, "active", { actorUid: ACTOR, reason: "non", now: NOW }), /interdite/);
  assert.throws(() => transitionMembership(membership(), "suspended", { actorUid: ACTOR, reason: "non", now: NOW }), /interdite/);
});
test("changement de rôles produit un audit et interdit l'auto-attribution", () => {
  const changed = changeMembershipRoles(membership(), ["association_manager"], { actorUid: ACTOR, reason: "affectation", now: NOW });
  assert.equal(changed.auditEvent.action, "membership.roles_changed");
  assert.throws(() => changeMembershipRoles(membership(), [], { actorUid: "member-alpha", reason: "self", now: NOW }), /auto-attribution/);
});
test("catalogues globaux et organisationnels restent séparés", () => {
  assert.equal(GLOBAL_ROLES.administrator, "Administrateur");
  assert.equal(ORGANIZATION_ROLES.association_manager, "Responsable d’association");
  assert.equal("administrator" in ORGANIZATION_ROLES, false);
});
test("permissions actives, moindre privilège et finances différées", () => {
  const activeMembership = { ...membership(), status: "active" };
  const result = effectivePermissions({ accountStatus: "active", globalRoles: ["approved_member"], organization: activeOrganization(), membership: activeMembership, organizationId: "group-alpha" });
  assert.deepEqual(result.global, ["community.content.read"]);
  assert.ok(result.organization.includes("organization.member.manage"));
  const financial = effectivePermissions({ accountStatus: "active", organization: activeOrganization(), membership: { ...activeMembership, roles: ["future_financial_manager"] }, organizationId: "group-alpha" });
  assert.deepEqual(financial.organization, []);
});
test("comptes, organisations et appartenances inactifs restent sans droit local", () => {
  const activeMembership = { ...membership(), status: "active" };
  for (const accountStatus of ["invited", "suspended", "revoked"]) assert.deepEqual(effectivePermissions({ accountStatus, organization: activeOrganization(), membership: activeMembership, organizationId: "group-alpha" }).organization, []);
  assert.deepEqual(effectivePermissions({ accountStatus: "active", organization: create(), membership: activeMembership, organizationId: "group-alpha" }).organization, []);
  assert.deepEqual(effectivePermissions({ accountStatus: "active", organization: activeOrganization(), membership: membership(), organizationId: "group-alpha" }).organization, []);
});
test("cloisonnement et appartenances multiples calculées séparément", () => {
  const activeMembership = { ...membership(), status: "active" };
  assert.deepEqual(effectivePermissions({ accountStatus: "active", organization: activeOrganization(), membership: activeMembership, organizationId: "group-beta" }).organization, []);
  const alpha = effectivePermissions({ accountStatus: "active", organization: activeOrganization(), membership: activeMembership, organizationId: "group-alpha" });
  const betaOrg = { ...activeOrganization(), organizationId: "group-beta", name: "Groupe Beta", slug: "groupe-beta" };
  const betaMembership = { ...activeMembership, organizationId: "group-beta", roles: [] };
  assert.ok(alpha.organization.length > 0); assert.deepEqual(effectivePermissions({ accountStatus: "active", organization: betaOrg, membership: betaMembership, organizationId: "group-beta" }).organization, []);
});
test("données incohérentes et faux rôles ferment les permissions", () => {
  assert.deepEqual(effectivePermissions({ accountStatus: "active", globalRoles: ["fake_admin"], organization: activeOrganization(), membership: { ...membership(), status: "active" }, organizationId: "group-alpha" }), { global: [], organization: [] });
});
