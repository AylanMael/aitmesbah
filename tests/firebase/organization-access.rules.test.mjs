import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;
const user = (uid, status) => ({ uid, displayName: `Compte ${uid}`, email: `${uid}@example.test`, status, globalRoles: [], organizationMemberships: [], createdAt: new Date(), updatedAt: new Date(), createdBy: "local-admin", updatedBy: "local-admin", version: 1 });
const organization = (id, status = "active") => ({ organizationId: id, name: `Groupe ${id}`, slug: `groupe-${id}`, type: "association", status, verificationStatus: "unverified", mandateStatus: "none", declaredScope: "Périmètre fictif", createdAt: new Date(), updatedAt: new Date(), createdBy: "local-admin", updatedBy: "local-admin", version: 1 });
const membership = (organizationId, uid, status = "active") => ({ organizationId, uid, roles: ["association_manager"], status, createdAt: new Date(), updatedAt: new Date(), createdBy: "local-admin", updatedBy: "local-admin", version: 1 });

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({ projectId: PROJECT_ID, firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") } });
  await environment.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    for (const [uid, status] of [["member-a", "active"], ["no-membership", "active"], ["invited-org", "invited"], ["suspended-org", "suspended"], ["revoked-org", "revoked"]]) await setDoc(doc(database, "users", uid), user(uid, status));
    await setDoc(doc(database, "organizations", "alpha"), organization("alpha"));
    await setDoc(doc(database, "organizations", "beta"), organization("beta"));
    await setDoc(doc(database, "organizations", "paused"), organization("paused", "suspended"));
    await setDoc(doc(database, "organizations", "alpha", "memberships", "member-a"), membership("alpha", "member-a"));
    await setDoc(doc(database, "organizations", "alpha", "memberships", "other-member"), membership("alpha", "other-member"));
    await setDoc(doc(database, "organizations", "beta", "memberships", "member-a"), membership("beta", "member-a", "suspended"));
    await setDoc(doc(database, "organizations", "paused", "memberships", "member-a"), membership("paused", "member-a"));
    for (const uid of ["invited-org", "suspended-org", "revoked-org"]) await setDoc(doc(database, "organizations", "alpha", "memberships", uid), membership("alpha", uid));
  });
});
after(async () => environment?.cleanup());

test("visiteur et comptes non actifs ne lisent aucune appartenance", async () => {
  const reference = (database, uid) => doc(database, "organizations", "alpha", "memberships", uid);
  await assertFails(getDoc(reference(environment.unauthenticatedContext().firestore(), "member-a")));
  for (const uid of ["invited-org", "suspended-org", "revoked-org"]) await assertFails(getDoc(reference(environment.authenticatedContext(uid).firestore(), uid)));
});
test("compte actif sans appartenance ne reçoit aucun accès", async () => {
  await assertFails(getDoc(doc(environment.authenticatedContext("no-membership").firestore(), "organizations", "alpha", "memberships", "no-membership")));
});
test("membre actif lit seulement sa propre appartenance active de l'organisation A", async () => {
  const database = environment.authenticatedContext("member-a").firestore();
  await assertSucceeds(getDoc(doc(database, "organizations", "alpha", "memberships", "member-a")));
  await assertFails(getDoc(doc(database, "organizations", "alpha", "memberships", "other-member")));
  await assertFails(getDoc(doc(database, "organizations", "beta", "memberships", "member-a")));
});
test("organisation suspendue et appartenance suspendue ne confèrent aucun accès", async () => {
  const database = environment.authenticatedContext("member-a").firestore();
  await assertFails(getDoc(doc(database, "organizations", "paused", "memberships", "member-a")));
  await assertFails(getDoc(doc(database, "organizations", "beta", "memberships", "member-a")));
});
test("aucune organisation ni appartenance ne peut être listée", async () => {
  const database = environment.authenticatedContext("member-a").firestore();
  await assertFails(getDocs(collection(database, "organizations")));
  await assertFails(getDocs(collection(database, "organizations", "alpha", "memberships")));
});
test("aucune création ou modification cliente n'est autorisée", async () => {
  const database = environment.authenticatedContext("member-a").firestore();
  await assertFails(setDoc(doc(database, "organizations", "alpha", "memberships", "self-created"), membership("alpha", "self-created")));
  await assertFails(updateDoc(doc(database, "organizations", "alpha", "memberships", "member-a"), { roles: ["mandated_committee_representative"] }));
  await assertFails(updateDoc(doc(database, "organizations", "alpha", "memberships", "member-a"), { status: "suspended" }));
  await assertFails(updateDoc(doc(database, "organizations", "alpha"), { status: "suspended" }));
});
test("faux rôles globaux et custom claims administrateur restent sans effet", async () => {
  for (const claims of [{ admin: true }, { globalRoles: ["technical_owner"] }]) {
    const database = environment.authenticatedContext("fake-claim", claims).firestore();
    await assertFails(getDoc(doc(database, "organizations", "alpha")));
    await assertFails(getDoc(doc(database, "organizations", "alpha", "memberships", "member-a")));
  }
});
