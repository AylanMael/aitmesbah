import assert from "node:assert/strict";
import test from "node:test";
import { applicationDefault, deleteApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { evaluateCrmAccess } from "../../lib/crm/session-policy.mjs";
import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

const password = "local-test-only-password";

async function signIn(email) {
  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  assert.equal(response.ok, true);
  return response.json();
}

test("cycle local Auth, profil autoritatif, session et révocation", async () => {
  assertLocalEmulatorSafety();
  process.env.METADATA_SERVER_DETECTION = "none";
  const app = initializeApp({ projectId: PROJECT_ID, credential: applicationDefault() }, `session-${Date.now()}`);
  const auth = getAuth(app);
  const database = getFirestore(app);
  const email = `session-${Date.now()}@example.test`;
  const identity = await auth.createUser({ email, password, disabled: false });
  const baseProfile = { uid: identity.uid, displayName: "Membre session fictif", globalRoles: ["contributor"], organizationMemberships: [] };

  try {
    for (const status of ["invited", "suspended", "revoked"]) {
      const profile = { ...baseProfile, status };
      await database.doc(`users/${identity.uid}`).set(profile);
      assert.equal(evaluateCrmAccess({ authUser: identity, profile }).state, "unauthorized");
    }

    const activeProfile = { ...baseProfile, status: "active" };
    await database.doc(`users/${identity.uid}`).set(activeProfile);
    assert.equal(evaluateCrmAccess({ authUser: identity, profile: activeProfile }).state, "authorized");
    assert.equal(evaluateCrmAccess({ authUser: identity, profile: { ...activeProfile, globalRoles: [] } }).state, "unauthorized");
    assert.equal(evaluateCrmAccess({ authUser: { ...identity, customClaims: { admin: true } }, profile: { ...activeProfile, globalRoles: [] } }).state, "unauthorized");

    const token = await signIn(email);
    const cookie = await auth.createSessionCookie(token.idToken, { expiresIn: 12 * 60 * 60 * 1000 });
    assert.equal((await auth.verifySessionCookie(cookie, true)).uid, identity.uid);
    await assert.rejects(auth.verifySessionCookie(`${cookie}falsifie`, true));

    await new Promise((resolve) => setTimeout(resolve, 1_100));
    await auth.revokeRefreshTokens(identity.uid);
    await assert.rejects(auth.verifySessionCookie(cookie, true));
    await auth.updateUser(identity.uid, { disabled: true });
    const disabled = await auth.getUser(identity.uid);
    assert.equal(evaluateCrmAccess({ authUser: disabled, profile: activeProfile }).state, "unauthenticated");
  } finally {
    await auth.deleteUser(identity.uid).catch(() => {});
    await database.doc(`users/${identity.uid}`).delete().catch(() => {});
    await deleteApp(app);
  }
});
