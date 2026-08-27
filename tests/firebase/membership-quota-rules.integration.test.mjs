import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import { assertFails, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;
before(async () => { assertLocalEmulatorSafety(); environment = await initializeTestEnvironment({ projectId: PROJECT_ID, firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") } }); });
after(async () => environment?.cleanup());

test("membershipQuotas est fermé à tout SDK client et tout claim", async () => {
  const contexts = [environment.unauthenticatedContext(), environment.authenticatedContext("member-user"), environment.authenticatedContext("administrator", { administrator: true }), environment.authenticatedContext("technical-owner", { technical_owner: true }), environment.authenticatedContext("organization-member", { organizationMemberships: ["alpha"] }), environment.authenticatedContext("fake-claim", { admin: true })];
  for (const context of contexts) { const reference = doc(context.firestore(), "membershipQuotas", "member-user"); await assertFails(getDoc(reference)); await assertFails(setDoc(reference, { uid: "member-user", occupiedSlots: 0 })); await assertFails(updateDoc(reference, { occupiedSlots: 1 })); await assertFails(deleteDoc(reference)); }
});
