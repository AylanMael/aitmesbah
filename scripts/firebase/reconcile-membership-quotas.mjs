import assert from "node:assert/strict";
import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { getLocalAdminServices } from "./local-account-admin.mjs";
import { MEMBERSHIP_QUOTA_MAX, MEMBERSHIP_QUOTA_SCHEMA_VERSION, occupiesMembershipSlot } from "../../lib/crm/membership-quota.mjs";
import { assertMembership } from "../../lib/crm/organization-authorization.mjs";

const apply = process.argv.includes("--apply");
assert.equal(process.env.GCLOUD_PROJECT, "demo-aitmesbah");
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, "127.0.0.1:8080");
assert.ok(!process.argv.some(value => ["aitmesbah-d945d", "ccs-compta"].includes(value)));

const { database } = getLocalAdminServices(), counts = new Map(), issues = [];
const memberships = await database.collectionGroup("memberships").orderBy(FieldPath.documentId()).get();
for (const document of memberships.docs) {
  try {
    const value = assertMembership(document.data());
    if (document.id !== value.uid) throw new Error("uid incohérent");
    if (occupiesMembershipSlot(value.status)) counts.set(value.uid, (counts.get(value.uid) ?? 0) + 1);
  } catch { issues.push("membership-malformed"); }
}
for (const occupied of counts.values()) if (occupied > MEMBERSHIP_QUOTA_MAX) issues.push("quota-exceeded");
const existing = await database.collection("membershipQuotas").get();
for (const document of existing.docs) if (!counts.has(document.id) && document.data().occupiedSlots !== 0) issues.push("quota-mismatch");

const summary = { mode: apply ? "apply" : "plan", memberships: memberships.size, usersWithOccupiedMemberships: counts.size, malformed: issues.filter(issue => issue === "membership-malformed").length, exceeded: issues.filter(issue => issue === "quota-exceeded").length, mismatches: issues.filter(issue => issue === "quota-mismatch").length };
console.log(JSON.stringify(summary));
if (issues.length) process.exitCode = 2;
else if (apply) {
  for (const [uid, occupiedSlots] of counts) {
    const reference = database.doc(`membershipQuotas/${uid}`), snapshot = await reference.get(), now = Timestamp.now();
    await reference.set({ uid, occupiedSlots, schemaVersion: MEMBERSHIP_QUOTA_SCHEMA_VERSION, createdAt: snapshot.exists ? snapshot.data().createdAt : now, updatedAt: now, version: snapshot.exists ? snapshot.data().version + 1 : 1 });
  }
  console.log(JSON.stringify({ applied: counts.size }));
}
