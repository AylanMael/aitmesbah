import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import { assertFails, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({ projectId: PROJECT_ID, firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") } });
});

after(async () => environment?.cleanup());

test("rateLimitCounters est totalement fermé à tous les SDK clients et claims", async () => {
  const contexts = [
    environment.unauthenticatedContext(),
    environment.authenticatedContext("user-local"),
    environment.authenticatedContext("administrator-local", { administrator: true }),
    environment.authenticatedContext("technical-local", { technical_owner: true }),
    environment.authenticatedContext("fake-local", { admin: true, rateLimitAdmin: true }),
  ];
  for (const context of contexts) {
    const reference = doc(context.firestore(), "rateLimitCounters", "opaque-counter-local");
    await assertFails(getDoc(reference));
    await assertFails(setDoc(reference, { used: 1 }));
    await assertFails(updateDoc(reference, { used: 2 }));
    await assertFails(deleteDoc(reference));
  }
});
