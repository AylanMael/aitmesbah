import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";

import { buildRateLimitPlan } from "../../lib/crm/rate-limit-contract.mjs";
import { RateLimitUnavailableError, consumeLocalFirestoreRateLimit } from "../../lib/firebase/rate-limit-admin.mjs";
import { getLocalAdminServices } from "../../scripts/firebase/local-account-admin.mjs";
import { assertLocalEmulatorSafety } from "./test-helpers.mjs";

const current = Object.freeze({ id: "generation-current", secret: "local-test-only-hmac-current-1234567890" });
const previous = Object.freeze({ id: "generation-previous", secret: "local-test-only-hmac-previous-1234567890" });

async function clearCounters() {
  const { database } = getLocalAdminServices(), snapshot = await database.collection("rateLimitCounters").get();
  for (let offset = 0; offset < snapshot.docs.length; offset += 400) {
    const batch = database.batch();
    snapshot.docs.slice(offset, offset + 400).forEach(document => batch.delete(document.ref));
    await batch.commit();
  }
}

beforeEach(async () => { assertLocalEmulatorSafety(); await clearCounters(); });
afterEach(clearCounters);

test("upload consomme atomiquement six compteurs sans identifiant brut", async () => {
  const { database } = getLocalAdminServices(), identities = { uid: "uid-brut-test", network: "203.0.113.10", resource: "ressource-complete-test" };
  const result = await consumeLocalFirestoreRateLimit({ database, profileName: "upload", identities, generations: { current }, nowMs: 1_000 });
  assert.deepEqual(result, { allowed: true, retryAfterSeconds: null, policyVersion: "staging-8p4c-v1" });
  const documents = (await database.collection("rateLimitCounters").get()).docs;
  assert.equal(documents.length, 6);
  for (const document of documents) {
    assert.match(document.id, /^[a-f0-9]{64}$/);
    assert.equal(document.data().used, 1);
    const serialized = JSON.stringify(document.data());
    for (const raw of Object.values(identities)) assert.equal(serialized.includes(raw), false);
    assert.equal(serialized.includes(current.secret), false);
  }
});

test("un dépassement ne consomme partiellement aucun des six compteurs", async () => {
  const { database } = getLocalAdminServices(), input = { database, profileName: "upload", identities: { uid: "uid-atomic", network: "203.0.113.11", resource: "resource-atomic" }, generations: { current }, nowMs: 1_000 };
  assert.equal((await consumeLocalFirestoreRateLimit(input)).allowed, true);
  assert.equal((await consumeLocalFirestoreRateLimit(input)).allowed, true);
  const before = new Map((await database.collection("rateLimitCounters").get()).docs.map(document => [document.id, document.data().used]));
  const denied = await consumeLocalFirestoreRateLimit(input);
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfterSeconds, 29);
  const after = new Map((await database.collection("rateLimitCounters").get()).docs.map(document => [document.id, document.data().used]));
  assert.deepEqual(after, before);
});

test("la rotation additionne previous et current mais écrit seulement current", async () => {
  const { database } = getLocalAdminServices(), identities = { uid: "uid-rotation", network: "203.0.113.12", resource: "resource-rotation" };
  await consumeLocalFirestoreRateLimit({ database, profileName: "upload", identities, generations: { current: previous }, nowMs: 1_000 });
  const plan = buildRateLimitPlan({ profileName: "upload", identities, generations: { current, previous }, nowMs: 1_000 });
  assert.equal(plan.reads, 12);
  assert.equal((await consumeLocalFirestoreRateLimit({ database, profileName: "upload", identities, generations: { current, previous }, nowMs: 1_000 })).allowed, true);
  const denied = await consumeLocalFirestoreRateLimit({ database, profileName: "upload", identities, generations: { current, previous }, nowMs: 1_000 });
  assert.equal(denied.allowed, false);
  const documents = (await database.collection("rateLimitCounters").get()).docs;
  assert.equal(documents.length, 12);
  assert.equal(documents.filter(document => document.data().generationId === previous.id).every(document => document.data().used === 1), true);
  assert.equal(documents.filter(document => document.data().generationId === current.id).every(document => document.data().used === 1), true);
});

test("les frontières fixes staging autorisent la rafale documentée sans dépasser chaque bucket", async () => {
  const { database } = getLocalAdminServices(), base = { database, profileName: "sessionCreate", identities: { uid: "uid-boundary", network: "203.0.113.13" }, generations: { current } };
  for (let index = 0; index < 3; index++) assert.equal((await consumeLocalFirestoreRateLimit({ ...base, nowMs: 9_999 })).allowed, true);
  assert.equal((await consumeLocalFirestoreRateLimit({ ...base, nowMs: 9_999 })).allowed, false);
  for (let index = 0; index < 3; index++) assert.equal((await consumeLocalFirestoreRateLimit({ ...base, nowMs: 10_000 })).allowed, true);
  assert.equal((await consumeLocalFirestoreRateLimit({ ...base, nowMs: 10_000 })).allowed, false);
});

test("500 décisions concurrentes sur une clé ne dépassent jamais 60 consommations", async () => {
  const { database } = getLocalAdminServices(), input = { database, profileName: "ordinaryRead", identities: { uid: "uid-concurrent-500" }, generations: { current }, nowMs: 20_000 };
  const results = await Promise.allSettled(Array.from({ length: 500 }, () => consumeLocalFirestoreRateLimit(input)));
  const allowed = results.filter(result => result.status === "fulfilled" && result.value.allowed).length;
  const denied = results.filter(result => result.status === "fulfilled" && !result.value.allowed).length;
  const unavailable = results.filter(result => result.status === "rejected" && result.reason instanceof RateLimitUnavailableError).length;
  assert.equal(allowed + denied + unavailable, 500);
  assert.ok(allowed <= 60);
  const documents = (await database.collection("rateLimitCounters").get()).docs;
  assert.equal(documents.length, 1);
  assert.equal(documents[0].data().used, allowed);
});

test("un document incohérent provoque un échec fermé sans écriture métier", async () => {
  const { database } = getLocalAdminServices(), identities = { uid: "uid-corrupt" }, plan = buildRateLimitPlan({ profileName: "ordinaryRead", identities, generations: { current }, nowMs: 20_000 });
  await database.collection("rateLimitCounters").doc(plan.logicalCounters[0].documents[0].documentId).set({ used: "invalide" });
  await assert.rejects(consumeLocalFirestoreRateLimit({ database, profileName: "ordinaryRead", identities, generations: { current }, nowMs: 20_000 }), RateLimitUnavailableError);
  assert.equal((await database.collection("rateLimitCounters").get()).docs[0].data().used, "invalide");
});
