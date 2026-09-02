import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BOOTSTRAP_LOCK_LEASE_MS, BOOTSTRAP_LOCK_PATH, LOCAL_TECHNICAL_OWNER,
  assertBootstrapSafety, closeBootstrapServices, createLocalTechnicalOwner,
  deleteLocalTechnicalOwner, generateLocalPassword, getBootstrapServices,
  parseBootstrapCommand, rotateLocalTechnicalOwnerPassword, statusLocalTechnicalOwner,
  bootstrapExitCode,
} from "../../scripts/firebase/bootstrap-local-technical-owner.mjs";
import { evaluateCrmAccess } from "../../lib/crm/session-policy.mjs";

const scriptPath = fileURLToPath(new URL("../../scripts/firebase/bootstrap-local-technical-owner.mjs", import.meta.url));
const safeEnv = Object.freeze({ AITMESBAH_APP_ENV: "local", NEXT_PUBLIC_AITMESBAH_APP_ENV: "local", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-aitmesbah", GCLOUD_PROJECT: "demo-aitmesbah", FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099", FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080", FIREBASE_STORAGE_EMULATOR_HOST: "127.0.0.1:9199", USE_EMULATORS: "true", NEXT_PUBLIC_FIREBASE_USE_EMULATORS: "true" });
let services;
let suiteOwnsFixture = false;

const signIn = async (password) => { const response = await fetch("http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: LOCAL_TECHNICAL_OWNER.email, password, returnSecureToken: true }) }); return { response, body: await response.json() }; };
const assertAuthAbsent = () => assert.rejects(services.auth.getUser(LOCAL_TECHNICAL_OWNER.uid), (e) => e.code === "auth/user-not-found");
async function cleanupOwned() { if (!suiteOwnsFixture) return; for (let i = 0; i < 3; i += 1) { const result = await deleteLocalTechnicalOwner(services); if (result.state === "deleted" || result.state === "absent") break; } suiteOwnsFixture = false; }

before(async () => { services = getBootstrapServices(); assert.equal((await statusLocalTechnicalOwner(services)).state, "absent", "fixture préexistante : tests arrêtés sans suppression"); });
after(async () => { await cleanupOwned(); if (services) { await services.database.doc(BOOTSTRAP_LOCK_PATH).delete(); await closeBootstrapServices(services); } });

test("la CLI exige exactement une commande avant toute initialisation Firebase", () => {
  assert.equal(parseBootstrapCommand(["status"]), "status");
  for (const args of [[], ["unknown"], ["status", "extra"]]) assert.throws(() => parseBootstrapCommand(args));
  for (const args of [[], ["unknown"], ["status", "extra"]]) {
    const run = spawnSync(process.execPath, [scriptPath, ...args], { encoding: "utf8", env: {} });
    assert.equal(run.status, 1); assert.equal(run.stdout, ""); assert.equal(run.stderr, '{"state":"refused"}\n');
  }
});

test("chaque variable explicite est obligatoire et toute destination dangereuse est refusée", () => {
  assert.equal(assertBootstrapSafety(safeEnv), true);
  for (const name of Object.keys(safeEnv)) { const env = { ...safeEnv }; delete env[name]; assert.throws(() => assertBootstrapSafety(env), /refused/); }
  const mutations = [
    { GCLOUD_PROJECT: "aitmesbah-d945d" }, { GOOGLE_CLOUD_PROJECT: "staging-project" }, { AITMESBAH_APP_ENV: "staging" }, { USE_EMULATORS: "false" },
    { NEXT_PUBLIC_FIREBASE_USE_EMULATORS: "false" }, { FIREBASE_AUTH_EMULATOR_HOST: "0.0.0.0:9099" }, { FIRESTORE_EMULATOR_HOST: "localhost:8080" },
    { FIREBASE_STORAGE_EMULATOR_HOST: "remote.example:9199" }, { GOOGLE_APPLICATION_CREDENTIALS: "real.json" }, { FIREBASE_CONFIG: JSON.stringify({ projectId: "staging-project" }) },
  ];
  for (const mutation of mutations) assert.throws(() => assertBootstrapSafety({ ...safeEnv, ...mutation }), /refused/);
});

test("les mots de passe sont robustes, uniques et ne figurent que dans les succès concernés", () => {
  const values = new Set(Array.from({ length: 50 }, generateLocalPassword)); assert.equal(values.size, 50);
  for (const value of values) { assert.ok(value.length >= 20); assert.match(value, /[A-Z]/); assert.match(value, /[a-z]/); assert.match(value, /\d/); assert.match(value, /[^A-Za-z0-9]/); }
});

test("status est en lecture seule et classe absent, verrou et incohérence", async () => {
  assert.equal((await statusLocalTechnicalOwner(services)).state, "absent");
  await services.database.doc(BOOTSTRAP_LOCK_PATH).create({ owner: "court", expiresAt: new Date(Date.now() + BOOTSTRAP_LOCK_LEASE_MS), schemaVersion: 1 });
  assert.equal((await statusLocalTechnicalOwner(services)).state, "inconsistent", "un verrou au schéma invalide n'est pas actif");
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();
  await services.auth.createUser({ uid: LOCAL_TECHNICAL_OWNER.uid, email: LOCAL_TECHNICAL_OWNER.email, displayName: LOCAL_TECHNICAL_OWNER.displayName, password: generateLocalPassword(), disabled: true, emailVerified: true }); suiteOwnsFixture = true;
  assert.equal((await statusLocalTechnicalOwner(services)).state, "inconsistent");
  assert.equal((await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).get()).exists, false);
  assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false;
});

test("création, droits, rotation ordonnée et suppression ciblée convergent", async () => {
  const unrelated = await services.auth.createUser({ uid: "unrelated-local-user", email: "unrelated@example.test", password: "Unrelated-local-password-123!", emailVerified: true });
  try {
    const created = await createLocalTechnicalOwner(services); suiteOwnsFixture = true; assert.equal(created.state, "created"); assert.equal(typeof created.password, "string");
    const identity = await services.auth.getUser(LOCAL_TECHNICAL_OWNER.uid), profile = (await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).get()).data();
    assert.equal(identity.disabled, false); assert.equal(identity.emailVerified, true); assert.deepEqual(identity.customClaims ?? {}, {}); assert.deepEqual(profile.globalRoles, ["technical_owner"]); assert.deepEqual(profile.organizationMemberships, []);
    const access = evaluateCrmAccess({ authUser: identity, profile }); assert.equal(access.state, "authorized"); assert.deepEqual(access.permissions, ["security.emergency_remove"]); assert.equal(access.permissions.some((v) => v.startsWith("editorial.")), false);
    assert.equal((await signIn(created.password)).response.ok, true); assert.equal((await createLocalTechnicalOwner(services)).state, "exists");
    const rotated = await rotateLocalTechnicalOwnerPassword(services); assert.equal(rotated.state, "rotated"); assert.equal((await signIn(created.password)).response.ok, false); assert.equal((await signIn(rotated.password)).response.ok, true);
    assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false; assert.equal((await deleteLocalTechnicalOwner(services)).state, "absent"); await assertAuthAbsent();
    assert.equal((await services.auth.getUser(unrelated.uid)).uid, unrelated.uid);
  } finally { await cleanupOwned(); await services.auth.deleteUser(unrelated.uid); }
});

test("un verrou occupé sérialise exactement les mutations sans toucher la fixture", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await services.database.doc(BOOTSTRAP_LOCK_PATH).create({ owner: "o".repeat(32), expiresAt: Timestamp.fromMillis(Date.now() + BOOTSTRAP_LOCK_LEASE_MS), schemaVersion: 1 });
  try {
    const results = await Promise.all([createLocalTechnicalOwner(services), rotateLocalTechnicalOwnerPassword(services), deleteLocalTechnicalOwner(services)]);
    assert.deepEqual(results.map((v) => v.state), ["conflict", "conflict", "conflict"]); await assertAuthAbsent(); assert.equal((await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).get()).exists, false);
  } finally { await services.database.doc(BOOTSTRAP_LOCK_PATH).delete(); }
});

test("deux créations simultanées produisent exactement un succès et un conflit", async () => {
  let signalLocked;
  let releaseFirst;
  const locked = new Promise((resolve) => { signalLocked = resolve; });
  const released = new Promise((resolve) => { releaseFirst = resolve; });
  const delayedAuth = {
    getUser: services.auth.getUser.bind(services.auth),
    getUserByEmail: services.auth.getUserByEmail.bind(services.auth),
    createUser: async (...args) => { signalLocked(); await released; return services.auth.createUser(...args); },
    updateUser: services.auth.updateUser.bind(services.auth),
  };
  const first = createLocalTechnicalOwner({ auth: delayedAuth, database: services.database });
  await locked;
  const second = await createLocalTechnicalOwner(services);
  releaseFirst();
  const firstResult = await first;
  suiteOwnsFixture = true;
  assert.deepEqual([firstResult.state, second.state], ["created", "conflict"]);
  assert.equal((await statusLocalTechnicalOwner(services)).state, "ready");
  await cleanupOwned();
});

test("la création reprend les deux états Auth désactivé autorisés", async () => {
  for (const withProfile of [false, true]) {
    await services.auth.createUser({ uid: LOCAL_TECHNICAL_OWNER.uid, email: LOCAL_TECHNICAL_OWNER.email, displayName: LOCAL_TECHNICAL_OWNER.displayName, password: generateLocalPassword(), disabled: true, emailVerified: true }); suiteOwnsFixture = true;
    if (withProfile) { const now = (await import("firebase-admin/firestore")).Timestamp.now(); await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).create({ uid: LOCAL_TECHNICAL_OWNER.uid, displayName: LOCAL_TECHNICAL_OWNER.displayName, email: LOCAL_TECHNICAL_OWNER.email, status: "active", globalRoles: ["technical_owner"], organizationMemberships: [], createdAt: now, updatedAt: now, createdBy: "local-bootstrap", updatedBy: "local-bootstrap", version: 1 }); }
    const result = await createLocalTechnicalOwner(services); assert.equal(result.state, "created"); assert.equal((await signIn(result.password)).response.ok, true); assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false;
  }
});

test("échec Firestore à la création laisse Auth désactivé, sans secret rendu", async () => {
  let transactionCalls = 0;
  const failingDb = { doc: services.database.doc.bind(services.database), runTransaction: async (fn) => { transactionCalls += 1; if (transactionCalls === 2) throw new Error("injected"); return services.database.runTransaction(fn); } };
  const result = await createLocalTechnicalOwner({ auth: services.auth, database: failingDb }); suiteOwnsFixture = true;
  assert.equal(result.state, "unavailable"); assert.equal("password" in result, false); assert.equal((await services.auth.getUser(LOCAL_TECHNICAL_OWNER.uid)).disabled, true); assert.equal((await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).get()).exists, false);
  assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false;
});

test("rotation: un échec de révocation précède tout changement de mot de passe", async () => {
  const created = await createLocalTechnicalOwner(services); suiteOwnsFixture = true;
  let updates = 0; const auth = { getUser: services.auth.getUser.bind(services.auth), getUserByEmail: services.auth.getUserByEmail.bind(services.auth), revokeRefreshTokens: async () => { throw new Error("injected"); }, updateUser: async (...args) => { updates += 1; return services.auth.updateUser(...args); } };
  const result = await rotateLocalTechnicalOwnerPassword({ auth, database: services.database }); assert.equal(result.state, "unavailable"); assert.equal(updates, 0); assert.equal("password" in result, false); assert.equal((await signIn(created.password)).response.ok, true);
  await cleanupOwned();
});

test("delete reprend les états intermédiaires fail-closed sans restauration", async () => {
  const created = await createLocalTechnicalOwner(services); suiteOwnsFixture = true; assert.equal(created.state, "created");
  await services.auth.updateUser(LOCAL_TECHNICAL_OWNER.uid, { disabled: true }); assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false;
  const recreated = await createLocalTechnicalOwner(services); suiteOwnsFixture = true; assert.equal(recreated.state, "created"); await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).delete();
  assert.equal((await deleteLocalTechnicalOwner(services)).state, "deleted"); suiteOwnsFixture = false;
});

test("collision UID ou email est refusée sans adoption ni suppression", async () => {
  const collision = await services.auth.createUser({ uid: "foreign-local-user", email: LOCAL_TECHNICAL_OWNER.email, password: "Foreign-local-password-123!", emailVerified: true });
  try { assert.equal((await createLocalTechnicalOwner(services)).state, "refused"); assert.equal((await deleteLocalTechnicalOwner(services)).state, "refused"); assert.equal((await services.auth.getUser(collision.uid)).uid, collision.uid); }
  finally { await services.auth.deleteUser(collision.uid); }
});

test("le résultat principal survit exactement à chaque échec de libération", async () => {
  const releaseLock = async () => { throw new Error("release injectée"); };
  const releaseFailingServices = { ...services, releaseLock };

  const created = await createLocalTechnicalOwner(releaseFailingServices);
  suiteOwnsFixture = true;
  assert.equal(created.state, "created");
  assert.equal(typeof created.password, "string");
  assert.deepEqual(created.warnings, ["LOCK_RELEASE_FAILED"]);
  assert.equal(bootstrapExitCode(created), 1);
  assert.equal((await signIn(created.password)).response.ok, true);
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();

  const rotated = await rotateLocalTechnicalOwnerPassword(releaseFailingServices);
  assert.equal(rotated.state, "rotated");
  assert.equal(typeof rotated.password, "string");
  assert.deepEqual(rotated.warnings, ["LOCK_RELEASE_FAILED"]);
  assert.equal(bootstrapExitCode(rotated), 1);
  assert.equal((await signIn(rotated.password)).response.ok, true);
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();

  const deleted = await deleteLocalTechnicalOwner(releaseFailingServices);
  suiteOwnsFixture = false;
  assert.equal(deleted.state, "deleted");
  assert.equal("password" in deleted, false);
  assert.deepEqual(deleted.warnings, ["LOCK_RELEASE_FAILED"]);
  assert.equal(bootstrapExitCode(deleted), 1);
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();

  const foreign = await services.auth.createUser({ uid: "foreign-release-user", email: LOCAL_TECHNICAL_OWNER.email, password: "Foreign-release-password-123!", emailVerified: true });
  const refused = await createLocalTechnicalOwner(releaseFailingServices);
  assert.equal(refused.state, "refused");
  assert.equal("password" in refused, false);
  assert.deepEqual(refused.warnings, ["LOCK_RELEASE_FAILED"]);
  assert.equal(bootstrapExitCode(refused), 1);
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();
  await services.auth.deleteUser(foreign.uid);

  const failingDatabase = {
    doc: (path) => path === `users/${LOCAL_TECHNICAL_OWNER.uid}` ? { get: async () => { throw new Error("lecture injectée"); } } : services.database.doc(path),
    runTransaction: services.database.runTransaction.bind(services.database),
  };
  const unavailable = await createLocalTechnicalOwner({ auth: services.auth, database: failingDatabase, releaseLock });
  assert.equal(unavailable.state, "unavailable");
  assert.equal("password" in unavailable, false);
  assert.deepEqual(unavailable.warnings, ["LOCK_RELEASE_FAILED"]);
  assert.equal(bootstrapExitCode(unavailable), 1);
  await services.database.doc(BOOTSTRAP_LOCK_PATH).delete();
});

test("une libération normale n'ajoute aucun avertissement et aucun état interdit ne porte de mot de passe", async () => {
  const created = await createLocalTechnicalOwner(services);
  suiteOwnsFixture = true;
  assert.equal(created.state, "created");
  assert.equal("warnings" in created, false);
  assert.equal(bootstrapExitCode(created), 0);
  const deleted = await deleteLocalTechnicalOwner(services);
  suiteOwnsFixture = false;
  assert.equal(deleted.state, "deleted");
  assert.equal("warnings" in deleted, false);
  assert.equal("password" in deleted, false);
  for (const state of ["deleted", "refused", "unavailable", "conflict", "inconsistent", "absent"]) {
    assert.equal(state === "created" || state === "rotated", false);
  }
});
