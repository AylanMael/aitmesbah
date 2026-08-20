import test from "node:test";
import assert from "node:assert/strict";

import {
  PROJECT_ID,
  assertLocalEmulatorSafety,
  createAuthenticationEmulatorUser,
} from "./test-helpers.mjs";

test("la garde impose le projet local et les trois émulateurs", () => {
  assertLocalEmulatorSafety();
  assert.equal(PROJECT_ID, "demo-aitmesbah");
});

test("Authentication Emulator crée uniquement une identité locale", async () => {
  const uid = await createAuthenticationEmulatorUser("auth-safety");
  assert.ok(uid);
});
