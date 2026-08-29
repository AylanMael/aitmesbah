import assert from "node:assert/strict";

export const PROJECT_ID = "demo-aitmesbah";
const FORBIDDEN_PROJECT_IDS = new Set(["aitmesbah-d945d", "ccs-compta"]);

export function assertLocalEmulatorSafety() {
  assert.equal(process.env.AITMESBAH_APP_ENV ?? "local", "local");
  assert.match(PROJECT_ID, /^demo-/);
  assert.equal(FORBIDDEN_PROJECT_IDS.has(PROJECT_ID), false);

  const configuredProject =
    process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
  assert.equal(configuredProject, PROJECT_ID);
  assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, "127.0.0.1:9099");
  assert.equal(process.env.FIRESTORE_EMULATOR_HOST, "127.0.0.1:8080");
  assert.equal(
    process.env.FIREBASE_STORAGE_EMULATOR_HOST,
    "127.0.0.1:9199",
  );
}

export async function createAuthenticationEmulatorUser(label) {
  assertLocalEmulatorSafety();

  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: `${label}@example.test`,
        password: "local-test-only-password",
        returnSecureToken: true,
      }),
    },
  );

  assert.equal(response.ok, true);
  const identity = await response.json();
  assert.equal(typeof identity.localId, "string");
  assert.ok(identity.localId.length > 0);
  return identity.localId;
}
