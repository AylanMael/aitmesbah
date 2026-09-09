import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    await setDoc(doc(database, "publicEvents", "published-event"), { kind: "event", status: "published", eventStatus: "scheduled", schemaVersion: 1 });
    await setDoc(doc(database, "publicEvents", "draft-event"), { kind: "event", status: "draft", eventStatus: "scheduled", schemaVersion: 1 });
  });
});

after(async () => environment?.cleanup());

test("un événement explicitement publié est lisible sans compte", async () => {
  const database = environment.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(database, "publicEvents", "published-event")));
  await assertFails(getDoc(doc(database, "publicEvents", "draft-event")));
});

test("aucun client ne peut créer ni modifier la projection publique", async () => {
  for (const context of [environment.unauthenticatedContext(), environment.authenticatedContext("fake-editor", { admin: true })]) {
    const database = context.firestore();
    await assertFails(setDoc(doc(database, "publicEvents", "forged-event"), { kind: "event", status: "published", eventStatus: "scheduled", schemaVersion: 1 }));
    await assertFails(updateDoc(doc(database, "publicEvents", "published-event"), { title: "Titre falsifié" }));
  }
});
