import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

import {
  PROJECT_ID,
  assertLocalEmulatorSafety,
  createAuthenticationEmulatorUser,
} from "./test-helpers.mjs";

let environment;

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
});

after(async () => {
  await environment?.cleanup();
});

test("Firestore refuse lecture et écriture non authentifiées", async () => {
  const database = environment.unauthenticatedContext().firestore();
  const reference = doc(database, "checks", "anonymous");
  await assertFails(getDoc(reference));
  await assertFails(setDoc(reference, { allowed: true }));
});

test("Firestore refuse lecture et écriture authentifiées", async () => {
  const uid = await createAuthenticationEmulatorUser("firestore-user");
  const database = environment.authenticatedContext(uid).firestore();
  const reference = doc(database, "checks", "authenticated");
  await assertFails(getDoc(reference));
  await assertFails(setDoc(reference, { allowed: true }));
});

test("Firestore refuse faux administrateur et autre organisation", async () => {
  const database = environment
    .authenticatedContext("fake-admin", {
      admin: true,
      organizationId: "organization-b",
    })
    .firestore();
  await assertFails(getDoc(doc(database, "organizations", "organization-a")));
  await assertFails(
    setDoc(doc(database, "organizations", "organization-a"), {
      organizationId: "organization-a",
    }),
  );
});
