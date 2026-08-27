import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { getLocalAdminServices } from "../../scripts/firebase/local-account-admin.mjs";
import { MEMBERSHIP_DETECTION_LIMIT, OCCUPYING_MEMBERSHIP_STATUSES, validateAuthoritativeMemberships } from "../../lib/crm/membership-quota.mjs";
import { changeLocalMembershipStatus, inviteLocalMembership } from "../../scripts/firebase/local-organization-admin.mjs";

const UID = "quota-query-user";
const PREFIX = "quota-query-";
const membership = (organizationId, status) => ({ organizationId, uid: UID, roles: [], status, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), createdBy: "quota-admin", updatedBy: "quota-admin", version: 1 });

async function clearFixtures() {
  const { database } = getLocalAdminServices();
  for (const organization of (await database.collection("organizations").get()).docs.filter(doc => doc.id.startsWith(PREFIX))) {
    const entries = await organization.ref.collection("memberships").get(), batch = database.batch();
    entries.docs.forEach(doc => batch.delete(doc.ref)); batch.delete(organization.ref); await batch.commit();
  }
  await database.doc(`membershipQuotas/${UID}`).delete();
  await database.doc(`users/${UID}`).delete();
}

beforeEach(clearFixtures);
afterEach(clearFixtures);

test("la requête autoritative est bornée, déterministe et exclut 100 révocations", async () => {
  const { database } = getLocalAdminServices();
  for (let offset = 0; offset < 101; offset += 400) {
    const batch = database.batch();
    for (let index = offset; index < Math.min(101, offset + 400); index++) {
      const organizationId = `${PREFIX}${String(index).padStart(3, "0")}`, status = index === 100 ? "active" : "revoked";
      batch.set(database.doc(`organizations/${organizationId}`), { organizationId });
      batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, status));
    }
    await batch.commit();
  }
  const snapshot = await database.collectionGroup("memberships")
    .where("uid", "==", UID)
    .where("status", "in", [...OCCUPYING_MEMBERSHIP_STATUSES])
    .orderBy(FieldPath.documentId())
    .limit(MEMBERSHIP_DETECTION_LIMIT).get();
  assert.equal(snapshot.size, 1);
  assert.equal(snapshot.docs[0].data().status, "active");
  assert.equal(snapshot.docs[0].data().organizationId, `${PREFIX}100`);
});

test("deux invitations concurrentes à 49 ne créent qu'un cinquantième emplacement", async () => {
  const { database } = getLocalAdminServices(), batch = database.batch();
  batch.set(database.doc(`users/${UID}`), { uid: UID, status: "active" });
  for (let index = 0; index < 49; index++) {
    const organizationId = `${PREFIX}occupied-${String(index).padStart(2, "0")}`;
    batch.set(database.doc(`organizations/${organizationId}`), { organizationId });
    batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, "active"));
  }
  for (const organizationId of [`${PREFIX}concurrent-a`, `${PREFIX}concurrent-b`]) batch.set(database.doc(`organizations/${organizationId}`), { organizationId });
  batch.set(database.doc(`membershipQuotas/${UID}`), { uid: UID, occupiedSlots: 49, schemaVersion: 1, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), version: 1 });
  await batch.commit();
  const results = await Promise.allSettled([inviteLocalMembership({ organizationId: `${PREFIX}concurrent-a`, uid: UID, roles: [], actorUid: "quota-admin" }), inviteLocalMembership({ organizationId: `${PREFIX}concurrent-b`, uid: UID, roles: [], actorUid: "quota-admin" })]);
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(results.filter(result => result.status === "rejected").length, 1);
  assert.equal((await database.doc(`membershipQuotas/${UID}`).get()).data().occupiedSlots, 50);
  const created = await Promise.all([database.doc(`organizations/${PREFIX}concurrent-a/memberships/${UID}`).get(), database.doc(`organizations/${PREFIX}concurrent-b/memberships/${UID}`).get()]);
  assert.equal(created.filter(snapshot => snapshot.exists).length, 1);
});

test("révocation, idempotence contrôlée et réactivation respectent le quota", async () => {
  const { database } = getLocalAdminServices(), organizationId = `${PREFIX}transition`, batch = database.batch();
  batch.set(database.doc(`users/${UID}`), { uid: UID, status: "active" });
  batch.set(database.doc(`organizations/${organizationId}`), { organizationId });
  batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, "active"));
  batch.set(database.doc(`membershipQuotas/${UID}`), { uid: UID, occupiedSlots: 1, schemaVersion: 1, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), version: 1 });
  await batch.commit();
  await changeLocalMembershipStatus({ organizationId, uid: UID, nextStatus: "revoked", actorUid: "quota-admin", reason: "révocation locale" });
  assert.equal((await database.doc(`membershipQuotas/${UID}`).get()).data().occupiedSlots, 0);
  await assert.rejects(changeLocalMembershipStatus({ organizationId, uid: UID, nextStatus: "revoked", actorUid: "quota-admin", reason: "répétition locale" }));
  assert.equal((await database.doc(`membershipQuotas/${UID}`).get()).data().occupiedSlots, 0);
  await changeLocalMembershipStatus({ organizationId, uid: UID, nextStatus: "active", actorUid: "quota-admin", reason: "réactivation locale" });
  assert.equal((await database.doc(`membershipQuotas/${UID}`).get()).data().occupiedSlots, 1);
});

test("100 révocations ne masquent ni 50 occupantes ni le dépassement à 51", async () => {
  const { database } = getLocalAdminServices();
  for (let offset = 0; offset < 150; offset += 400) {
    const batch = database.batch();
    for (let index = offset; index < Math.min(150, offset + 400); index++) {
      const organizationId = `${PREFIX}mixed-${String(index).padStart(3, "0")}`, status = index < 100 ? "revoked" : "active";
      batch.set(database.doc(`organizations/${organizationId}`), { organizationId }); batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, status));
    }
    await batch.commit();
  }
  const query = () => database.collectionGroup("memberships").where("uid", "==", UID).where("status", "in", [...OCCUPYING_MEMBERSHIP_STATUSES]).orderBy(FieldPath.documentId()).limit(MEMBERSHIP_DETECTION_LIMIT).get();
  let snapshot = await query(); assert.equal(snapshot.size, 50);
  const quota = { uid: UID, occupiedSlots: 50, schemaVersion: 1, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), version: 1 };
  assert.equal(validateAuthoritativeMemberships(UID, snapshot.docs.map(doc => ({ id: doc.id, path: doc.ref.path, data: doc.data() })), quota).length, 50);
  const organizationId = `${PREFIX}mixed-150`; await database.doc(`organizations/${organizationId}`).set({ organizationId }); await database.doc(`organizations/${organizationId}/memberships/${UID}`).set(membership(organizationId, "suspended"));
  snapshot = await query(); assert.equal(snapshot.size, 51); assert.throws(() => validateAuthoritativeMemberships(UID, snapshot.docs.map(doc => ({ id: doc.id, path: doc.ref.path, data: doc.data() })), quota), /too-many-memberships/);
});

test("deux réactivations concurrentes pour le dernier emplacement n'en autorisent qu'une", async () => {
  const { database } = getLocalAdminServices(), batch = database.batch(); batch.set(database.doc(`users/${UID}`), { uid: UID, status: "active" });
  for (let index = 0; index < 49; index++) { const organizationId = `${PREFIX}reactive-active-${String(index).padStart(2, "0")}`; batch.set(database.doc(`organizations/${organizationId}`), { organizationId }); batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, "active")); }
  for (const suffix of ["a", "b"]) { const organizationId = `${PREFIX}reactive-${suffix}`; batch.set(database.doc(`organizations/${organizationId}`), { organizationId }); batch.set(database.doc(`organizations/${organizationId}/memberships/${UID}`), membership(organizationId, "revoked")); }
  batch.set(database.doc(`membershipQuotas/${UID}`), { uid: UID, occupiedSlots: 49, schemaVersion: 1, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), version: 1 }); await batch.commit();
  const results = await Promise.allSettled(["a", "b"].map(suffix => changeLocalMembershipStatus({ organizationId: `${PREFIX}reactive-${suffix}`, uid: UID, nextStatus: "active", actorUid: "quota-admin", reason: "réactivation concurrente" })));
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1); assert.equal((await database.doc(`membershipQuotas/${UID}`).get()).data().occupiedSlots, 50);
  const states = await Promise.all(["a", "b"].map(async suffix => (await database.doc(`organizations/${PREFIX}reactive-${suffix}/memberships/${UID}`).get()).data().status));
  assert.equal(states.filter(status => status === "active").length, 1); assert.equal(states.filter(status => status === "revoked").length, 1);
});
