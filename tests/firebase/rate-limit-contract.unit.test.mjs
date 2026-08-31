import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  HMAC_OVERLAP_SECONDS,
  LOCAL_RATE_LIMIT_NAMESPACE,
  MAX_RATE_LIMIT_COUNTERS,
  MAX_ROTATION_KEYS,
  RATE_LIMIT_CATEGORIES,
  RATE_LIMIT_POLICY_VERSION,
  STAGING_RATE_LIMIT_PROFILES,
  buildRateLimitPlan,
  retryAfterSeconds,
  validateLocalHmacGenerations,
} from "../../lib/crm/rate-limit-contract.mjs";

const current = Object.freeze({ id: "generation-current", secret: "local-test-only-hmac-current-1234567890" });
const previous = Object.freeze({ id: "generation-previous", secret: "local-test-only-hmac-previous-1234567890" });

test("le catalogue 8P4C est fermé, complet et versionné", () => {
  assert.equal(RATE_LIMIT_POLICY_VERSION, "staging-8p4c-v1");
  assert.equal(HMAC_OVERLAP_SECONDS, 600);
  assert.equal(MAX_RATE_LIMIT_COUNTERS, 6);
  assert.equal(MAX_ROTATION_KEYS, 12);
  assert.deepEqual(RATE_LIMIT_CATEGORIES, ["csrfBootstrap", "session", "ordinaryRead", "privilegedMutation", "contentMutation", "editorialDecision", "assetMutation", "upload", "download", "deletion", "auditRead"]);
  assert.deepEqual([...new Set(Object.values(STAGING_RATE_LIMIT_PROFILES).map(value => value.category))].sort(), [...RATE_LIMIT_CATEGORIES].sort());
  assert.throws(() => buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "permissiveDefault", identities: {}, generations: { current }, nowMs: 0 }), /profil de quota inconnu/);
});

test("les fenêtres utilisent une même origine et Retry-After retient le délai le plus long", () => {
  const plan = buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "upload", identities: { uid: "user-local", network: "192.0.2.10", resource: "contribution-local" }, generations: { current }, nowMs: 299_500 });
  assert.equal(plan.logicalCounters.length, 6);
  assert.equal(plan.keyEvaluations, 6);
  assert.deepEqual([...new Set(plan.logicalCounters.filter(value => value.windowSeconds === 300).map(value => value.windowStartMs))], [0]);
  assert.deepEqual([...new Set(plan.logicalCounters.filter(value => value.windowSeconds === 30).map(value => value.windowStartMs))], [270_000]);
  assert.equal(retryAfterSeconds(plan, plan.logicalCounters), 1);
  const start = buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "upload", identities: { uid: "user-local", network: "192.0.2.10", resource: "contribution-local" }, generations: { current }, nowMs: 1 });
  assert.equal(retryAfterSeconds(start, start.logicalCounters), 300);
});

test("la rotation double les clés sans dépasser douze et n'expose aucune identité brute", () => {
  const raw = { uid: "uid-brut-local", network: "198.51.100.42", resource: "ressource-complete-locale" };
  const plan = buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "upload", identities: raw, generations: { current, previous }, nowMs: 60_000 });
  assert.equal(plan.logicalCounters.length, 6);
  assert.equal(plan.keyEvaluations, 12);
  const serialized = JSON.stringify(plan);
  for (const value of Object.values(raw)) assert.equal(serialized.includes(value), false);
  for (const generation of [current, previous]) assert.equal(serialized.includes(generation.secret), false);
  for (const counter of plan.logicalCounters) {
    assert.equal(counter.generationKeys.length, 2);
    assert.equal(counter.generationKeys.filter(key => key.current).length, 1);
    for (const key of counter.generationKeys) assert.match(key.opaqueKey, /^[a-f0-9]{64}$/);
  }
});

test("le contrat refuse identités, coûts, secrets et générations hors périmètre", () => {
  assert.throws(() => validateLocalHmacGenerations({ current: { id: "g", secret: "secret-réel-ou-inconnu" } }), /locale invalide/);
  assert.throws(() => buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "ordinaryRead", identities: { uid: "u", resource: "r" }, generations: { current }, nowMs: 0 }), /identités de quota invalide/);
  assert.throws(() => buildRateLimitPlan({ namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "ordinaryRead", identities: { uid: "u" }, generations: { current }, nowMs: 0, cost: 2 }), /coût de quota invalide/);
  assert.throws(() => buildRateLimitPlan({ namespace: "demo-aitmesbah", profileName: "ordinaryRead", identities: { uid: "u" }, generations: { current }, nowMs: 0 }), /namespace de quota invalide/);
  assert.throws(() => validateLocalHmacGenerations({ current, previous: current }), /identiques/);
});

test("namespace et profil séparent les compteurs canoniques", () => {
  const shared = { generations: { current }, nowMs: 60_000 };
  const local = buildRateLimitPlan({ ...shared, namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "ordinaryRead", identities: { uid: "uid-shared" } });
  const staging = buildRateLimitPlan({ ...shared, namespace: "staging:approved-placeholder:rate-limit:v1", profileName: "ordinaryRead", identities: { uid: "uid-shared" } });
  assert.notEqual(local.logicalCounters[0].generationKeys[0].opaqueKey, staging.logicalCounters[0].generationKeys[0].opaqueKey);

  const create = buildRateLimitPlan({ ...shared, namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "sessionCreate", identities: { uid: "uid-shared", network: "203.0.113.20" } });
  const logout = buildRateLimitPlan({ ...shared, namespace: LOCAL_RATE_LIMIT_NAMESPACE, profileName: "sessionLogout", identities: { uid: "uid-shared", session: "session-shared" } });
  const createUidIds = create.logicalCounters.filter(counter => counter.identity === "uid").flatMap(counter => counter.generationKeys.map(key => key.opaqueKey));
  const logoutUidIds = new Set(logout.logicalCounters.filter(counter => counter.identity === "uid").flatMap(counter => counter.generationKeys.map(key => key.opaqueKey)));
  assert.equal(createUidIds.some(id => logoutUidIds.has(id)), false);
});

test("aucune route métier n'importe le contrat et le sous-système ne journalise rien", async () => {
  const routeFiles = [
    "app/api/auth/csrf/route.ts", "app/api/auth/session/route.ts", "app/api/crm/accounts/route.ts", "app/api/crm/accounts/[uid]/route.ts",
    "app/api/crm/organizations/route.ts", "app/api/crm/organizations/[organizationId]/route.ts", "app/api/crm/organizations/[organizationId]/memberships/route.ts",
    "app/api/crm/organizations/[organizationId]/memberships/[uid]/route.ts", "app/api/crm/contributions/route.ts", "app/api/crm/contributions/[contributionId]/route.ts",
    "app/api/crm/contributions/[contributionId]/assets/route.ts", "app/api/crm/contributions/[contributionId]/assets/[assetId]/route.ts",
    "app/api/crm/contributions/[contributionId]/assets/[assetId]/download/route.ts", "app/api/crm/assets/deletion-requests/route.ts", "app/api/crm/audit-logs/route.ts",
  ];
  for (const file of routeFiles) assert.doesNotMatch(await readFile(file, "utf8"), /rate-limit-contract/);
  assert.doesNotMatch(await readFile("lib/crm/rate-limit-contract.mjs", "utf8"), /console\.|logger\.|auditLogs|firebase|firestore/i);
});
