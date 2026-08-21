import assert from "node:assert/strict";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import {
  createInvitedProfile,
  transitionAccount,
} from "../../lib/crm/account-lifecycle.mjs";
import { normalizeLegacyAudit } from "../../lib/crm/audit-log.mjs";

export const LOCAL_PROJECT_ID = "demo-aitmesbah";

export function assertLocalAdminSafety() {
  assert.match(LOCAL_PROJECT_ID, /^demo-/);
  assert.notEqual(LOCAL_PROJECT_ID, "aitmesbah-d945d");
  assert.notEqual(LOCAL_PROJECT_ID, "ccs-compta");
  assert.equal(process.env.GCLOUD_PROJECT, LOCAL_PROJECT_ID);
  assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, "127.0.0.1:9099");
  assert.equal(process.env.FIRESTORE_EMULATOR_HOST, "127.0.0.1:8080");
  assert.equal(process.env.FIREBASE_STORAGE_EMULATOR_HOST, "127.0.0.1:9199");
}

export function getLocalAdminServices() {
  assertLocalAdminSafety();
  process.env.METADATA_SERVER_DETECTION = "none";
  const app = getApps()[0] ?? initializeApp({
    projectId: LOCAL_PROJECT_ID,
    credential: applicationDefault(),
    storageBucket: `${LOCAL_PROJECT_ID}.appspot.com`,
  });
  return {
    auth: getAuth(app),
    database: getFirestore(app),
    bucket: getStorage(app).bucket(`${LOCAL_PROJECT_ID}.appspot.com`),
  };
}

async function writeProfileAndAudit(database, profile, auditEvent) {
  const batch = database.batch();
  const auditReference = database.collection("auditLogs").doc();
  batch.set(database.doc(`users/${profile.uid}`), profile);
  batch.create(auditReference, normalizeLegacyAudit(auditEvent, { eventId: auditReference.id }));
  await batch.commit();
}

export async function prepareLocalInvitation({ displayName, email, actorUid }) {
  const { auth, database } = getLocalAdminServices();
  const identity = await auth.createUser({
    email: email.trim().toLowerCase(),
    displayName: displayName.trim().replace(/\s+/g, " "),
    disabled: true,
    emailVerified: false,
  });
  const now = Timestamp.now();
  const profile = createInvitedProfile({
    uid: identity.uid,
    displayName,
    email,
    actorUid,
    now,
  });
  await writeProfileAndAudit(database, profile, {
    action: "account.invited",
    actorUid,
    targetUid: identity.uid,
    previousStatus: null,
    nextStatus: "invited",
    reason: "invitation locale préparée",
    occurredAt: now,
    profileVersion: 1,
  });
  return profile;
}

export async function changeLocalAccountStatus({ uid, nextStatus, actorUid, reason }) {
  const { auth, database } = getLocalAdminServices();
  const reference = database.doc(`users/${uid}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new Error("profil introuvable");
  const result = transitionAccount(snapshot.data(), nextStatus, {
    actorUid,
    reason,
    now: Timestamp.now(),
  });
  await auth.updateUser(uid, { disabled: nextStatus !== "active" });
  await writeProfileAndAudit(database, result.profile, result.auditEvent);
  if (nextStatus !== "active") {
    await auth.revokeRefreshTokens(uid);
  }
  return result.profile;
}

export async function clearLocalAccountFixtures() {
  const { auth, database } = getLocalAdminServices();
  const users = await auth.listUsers(1000);
  if (users.users.length) await auth.deleteUsers(users.users.map(({ uid }) => uid));
  for (const collectionName of ["users", "auditLogs"]) {
    const snapshot = await database.collection(collectionName).get();
    if (!snapshot.empty) {
      const batch = database.batch();
      snapshot.docs.forEach((document) => batch.delete(document.ref));
      await batch.commit();
    }
  }
}
