import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;
const profile = (uid, status) => ({
  uid,
  displayName: `Compte ${status}`,
  email: `${uid}@example.test`,
  status,
  globalRoles: [],
  organizationMemberships: [],
  createdAt: new Date("2026-08-20T10:00:00Z"),
  updatedAt: new Date("2026-08-20T10:00:00Z"),
  createdBy: "local-admin",
  updatedBy: "local-admin",
  version: 1,
});

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    for (const status of ["invited", "active", "suspended", "revoked"]) {
      await setDoc(doc(database, "users", `${status}-user`), profile(`${status}-user`, status));
    }
    await setDoc(doc(database, "auditLogs", "event-1"), { action: "fixture" });
  });
});

after(async () => environment?.cleanup());

test("un visiteur ne lit aucun profil", async () => {
  await assertFails(getDoc(doc(environment.unauthenticatedContext().firestore(), "users", "active-user")));
});

test("invited, suspended et revoked ne lisent pas leur profil", async () => {
  for (const status of ["invited", "suspended", "revoked"]) {
    const database = environment.authenticatedContext(`${status}-user`).firestore();
    await assertFails(getDoc(doc(database, "users", `${status}-user`)));
  }
});

test("active lit uniquement son propre profil", async () => {
  const database = environment.authenticatedContext("active-user").firestore();
  await assertSucceeds(getDoc(doc(database, "users", "active-user")));
  await assertFails(getDoc(doc(database, "users", "invited-user")));
});

test("active ne liste pas les utilisateurs", async () => {
  const database = environment.authenticatedContext("active-user").firestore();
  await assertFails(getDocs(collection(database, "users")));
});

test("active ne modifie ni statut, ni rôles, ni appartenances", async () => {
  const database = environment.authenticatedContext("active-user").firestore();
  const reference = doc(database, "users", "active-user");
  await assertFails(updateDoc(reference, { status: "suspended" }));
  await assertFails(updateDoc(reference, { globalRoles: ["admin"] }));
  await assertFails(updateDoc(reference, { organizationMemberships: ["organization-a"] }));
});

test("un faux custom claim administrateur ne contourne pas les règles", async () => {
  const database = environment.authenticatedContext("fake-admin", { admin: true }).firestore();
  await assertFails(getDoc(doc(database, "users", "active-user")));
});

test("un client ne crée, ne lit et ne modifie aucun audit", async () => {
  const database = environment.authenticatedContext("active-user").firestore();
  const reference = doc(database, "auditLogs", "event-1");
  await assertFails(getDoc(reference));
  await assertFails(setDoc(doc(database, "auditLogs", "event-2"), { action: "fake" }));
  await assertFails(updateDoc(reference, { action: "changed" }));
});
