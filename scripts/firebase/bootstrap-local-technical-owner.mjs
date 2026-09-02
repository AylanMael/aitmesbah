import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";
import { deleteApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { assertProfile } from "../../lib/crm/account-lifecycle.mjs";

export const LOCAL_TECHNICAL_OWNER = Object.freeze({ projectId: "demo-aitmesbah", uid: "local-technical-owner", email: "technical-owner@example.test", displayName: "Responsable technique local", role: "technical_owner", actorUid: "local-bootstrap" });
export const BOOTSTRAP_LOCK_PATH = "localAdministrativeLocks/technical-owner-bootstrap";
export const BOOTSTRAP_LOCK_LEASE_MS = 30_000;
const COMMANDS = new Set(["create", "status", "rotate-password", "delete"]);
const RESULT_STATES = new Set(["created", "exists", "rotated", "deleted", "absent", "ready", "inconsistent", "conflict", "refused", "unavailable", "operation_in_progress"]);
const REQUIRED_ENV = Object.freeze({ AITMESBAH_APP_ENV: "local", NEXT_PUBLIC_AITMESBAH_APP_ENV: "local", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-aitmesbah", GCLOUD_PROJECT: "demo-aitmesbah", FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099", FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080", FIREBASE_STORAGE_EMULATOR_HOST: "127.0.0.1:9199", USE_EMULATORS: "true", NEXT_PUBLIC_FIREBASE_USE_EMULATORS: "true" });
class BootstrapFailure extends Error { constructor(state) { super(state); this.state = state; } }
const outcome = (state, extra = {}) => {
  if (!RESULT_STATES.has(state)) fail();
  if (extra.password !== undefined && state !== "created" && state !== "rotated") fail();
  if (extra.warnings !== undefined && (extra.warnings.length !== 1 || extra.warnings[0] !== "LOCK_RELEASE_FAILED")) fail();
  return Object.freeze({ state, ...extra });
};
const withLockReleaseWarning = (result) => outcome(result.state, { ...result, warnings: Object.freeze(["LOCK_RELEASE_FAILED"]) });
const fail = (state = "refused") => { throw new BootstrapFailure(state); };

export function parseBootstrapCommand(args) {
  if (!Array.isArray(args) || args.length !== 1 || !COMMANDS.has(args[0])) fail();
  return args[0];
}
export function assertBootstrapSafety(env = process.env) {
  for (const [name, expected] of Object.entries(REQUIRED_ENV)) if (env[name] !== expected) fail();
  if (!env.GCLOUD_PROJECT.startsWith("demo-") || (env.GOOGLE_CLOUD_PROJECT !== undefined && env.GOOGLE_CLOUD_PROJECT !== LOCAL_TECHNICAL_OWNER.projectId)) fail();
  for (const name of ["GOOGLE_APPLICATION_CREDENTIALS", "GOOGLE_APPLICATION_CREDENTIALS_JSON", "GOOGLE_CLOUD_KEYFILE_JSON"]) if (env[name]?.trim()) fail();
  if (env.FIREBASE_CONFIG) {
    let config; try { config = JSON.parse(env.FIREBASE_CONFIG); } catch { fail(); }
    if (config?.projectId !== LOCAL_TECHNICAL_OWNER.projectId || (config.storageBucket !== undefined && config.storageBucket !== `${LOCAL_TECHNICAL_OWNER.projectId}.appspot.com`)) fail();
  }
  return true;
}
export function generateLocalPassword() { return `${randomBytes(18).toString("base64url")}Aa1!`; }
export function bootstrapExitCode(result) {
  return result.warnings || ["refused", "inconsistent", "conflict", "unavailable"].includes(result.state) ? 1 : 0;
}
function profileFor(now) { return assertProfile({ uid: LOCAL_TECHNICAL_OWNER.uid, displayName: LOCAL_TECHNICAL_OWNER.displayName, email: LOCAL_TECHNICAL_OWNER.email, status: "active", globalRoles: [LOCAL_TECHNICAL_OWNER.role], organizationMemberships: [], createdAt: now, updatedAt: now, createdBy: LOCAL_TECHNICAL_OWNER.actorUid, updatedBy: LOCAL_TECHNICAL_OWNER.actorUid, version: 1 }); }
function exactIdentity(v, active = false) { return v?.uid === LOCAL_TECHNICAL_OWNER.uid && v.email === LOCAL_TECHNICAL_OWNER.email && v.displayName === LOCAL_TECHNICAL_OWNER.displayName && v.emailVerified === true && (!active || v.disabled === false) && Object.keys(v.customClaims ?? {}).length === 0; }
function exactProfile(v) { try { assertProfile(v); return v.uid === LOCAL_TECHNICAL_OWNER.uid && v.email === LOCAL_TECHNICAL_OWNER.email && v.displayName === LOCAL_TECHNICAL_OWNER.displayName && v.status === "active" && v.version === 1 && v.createdBy === LOCAL_TECHNICAL_OWNER.actorUid && v.updatedBy === LOCAL_TECHNICAL_OWNER.actorUid && JSON.stringify(v.globalRoles) === '["technical_owner"]' && JSON.stringify(v.organizationMemberships) === "[]"; } catch { return false; } }
async function authRead(auth, method, value) { try { return await auth[method](value); } catch (e) { if (e?.code === "auth/user-not-found") return null; throw e; } }
async function inspect(auth, db) {
  const [uid, email, snap] = await Promise.all([authRead(auth, "getUser", LOCAL_TECHNICAL_OWNER.uid), authRead(auth, "getUserByEmail", LOCAL_TECHNICAL_OWNER.email), db.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).get()]);
  const profile = snap.exists ? snap.data() : null;
  return { uid, email, profile, collision: Boolean((uid && !exactIdentity(uid)) || (email && email.uid !== LOCAL_TECHNICAL_OWNER.uid) || (profile && !exactProfile(profile))) };
}
const ready = (v) => !v.collision && v.uid && v.email && v.profile && exactIdentity(v.uid, true);
const absent = (v) => !v.uid && !v.email && !v.profile;
const validLock = (v) => v && Object.keys(v).sort().join(",") === "expiresAt,owner,schemaVersion" && typeof v.owner === "string" && v.owner.length >= 32 && v.schemaVersion === 1 && v.expiresAt instanceof Timestamp;
async function acquire(db, now = Date.now()) {
  const owner = randomBytes(24).toString("base64url"), ref = db.doc(BOOTSTRAP_LOCK_PATH);
  const ok = await db.runTransaction(async (tx) => { const snap = await tx.get(ref); if (snap.exists) { const v = snap.data(); if (!validLock(v) || v.expiresAt.toMillis() > now) return false; } tx.set(ref, { owner, expiresAt: Timestamp.fromMillis(now + BOOTSTRAP_LOCK_LEASE_MS), schemaVersion: 1 }); return true; });
  return ok ? { owner, ref } : null;
}
async function release(db, lock) { await db.runTransaction(async (tx) => { const snap = await tx.get(lock.ref); if (snap.exists && validLock(snap.data()) && snap.data().owner === lock.owner) tx.delete(lock.ref); }); }
async function locked(services, operation) {
  let lock;
  try { lock = await acquire(services.database); } catch { return outcome("unavailable"); }
  if (!lock) return outcome("conflict");
  let result;
  try { result = await operation(); } catch { result = outcome("unavailable"); }
  const releaseOperation = services.releaseLock ?? release;
  try { await releaseOperation(services.database, lock); } catch (releaseError) {
    void releaseError;
    return withLockReleaseWarning(result);
  }
  return result;
}

export function getBootstrapServices(env = process.env) { assertBootstrapSafety(env); process.env.METADATA_SERVER_DETECTION = "none"; const name = "local-technical-owner-bootstrap"; const app = getApps().find((v) => v.name === name) ?? initializeApp({ projectId: LOCAL_TECHNICAL_OWNER.projectId }, name); return { app, auth: getAuth(app), database: getFirestore(app) }; }
export async function createLocalTechnicalOwner(services = getBootstrapServices()) { return locked(services, async () => {
  let v = await inspect(services.auth, services.database); if (v.collision) return outcome("refused"); if (ready(v)) return outcome("exists", { uid: LOCAL_TECHNICAL_OWNER.uid }); if (v.profile && !v.uid) return outcome("inconsistent");
  const password = generateLocalPassword();
  if (!v.uid) { try { await services.auth.createUser({ uid: LOCAL_TECHNICAL_OWNER.uid, email: LOCAL_TECHNICAL_OWNER.email, displayName: LOCAL_TECHNICAL_OWNER.displayName, password, disabled: true, emailVerified: true }); } catch { return outcome("unavailable"); } }
  else if (!v.uid.disabled || !exactIdentity(v.uid)) return outcome("refused");
  else { try { await services.auth.updateUser(LOCAL_TECHNICAL_OWNER.uid, { password, disabled: true }); } catch { return outcome("unavailable"); } }
  v = await inspect(services.auth, services.database); if (v.collision || !v.uid?.disabled) return outcome("inconsistent");
  if (!v.profile) { try { const ref = services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`); await services.database.runTransaction(async (tx) => { const snap = await tx.get(ref); if (snap.exists) fail("inconsistent"); tx.create(ref, profileFor(Timestamp.now())); }); } catch { return outcome("unavailable"); } }
  try { await services.auth.updateUser(LOCAL_TECHNICAL_OWNER.uid, { disabled: false }); } catch { return outcome("unavailable"); }
  return outcome("created", { uid: LOCAL_TECHNICAL_OWNER.uid, password });
}); }
export async function statusLocalTechnicalOwner(services = getBootstrapServices()) { try { const [v, snap] = await Promise.all([inspect(services.auth, services.database), services.database.doc(BOOTSTRAP_LOCK_PATH).get()]); if (snap.exists && !validLock(snap.data())) return outcome("inconsistent"); if (snap.exists && snap.data().expiresAt.toMillis() > Date.now()) return outcome("operation_in_progress"); if (absent(v)) return outcome("absent"); if (ready(v)) return outcome("ready", { uid: LOCAL_TECHNICAL_OWNER.uid, emailVerified: true, status: "active", globalRoles: Object.freeze([LOCAL_TECHNICAL_OWNER.role]) }); return outcome("inconsistent"); } catch { return outcome("unavailable"); } }
export async function rotateLocalTechnicalOwnerPassword(services = getBootstrapServices()) { return locked(services, async () => { const v = await inspect(services.auth, services.database); if (v.collision) return outcome("refused"); if (!ready(v)) return outcome("inconsistent"); try { await services.auth.revokeRefreshTokens(LOCAL_TECHNICAL_OWNER.uid); } catch { return outcome("unavailable"); } const password = generateLocalPassword(); try { await services.auth.updateUser(LOCAL_TECHNICAL_OWNER.uid, { password }); } catch { return outcome("unavailable"); } return outcome("rotated", { uid: LOCAL_TECHNICAL_OWNER.uid, password }); }); }
export async function deleteLocalTechnicalOwner(services = getBootstrapServices()) { return locked(services, async () => {
  let v = await inspect(services.auth, services.database); if (v.collision) return outcome("refused"); if (absent(v)) return outcome("absent"); if (v.uid && !exactIdentity(v.uid)) return outcome("refused");
  if (v.uid && !v.uid.disabled) { try { await services.auth.updateUser(LOCAL_TECHNICAL_OWNER.uid, { disabled: true }); } catch { return outcome("unavailable"); } }
  if (v.uid) { try { await services.auth.revokeRefreshTokens(LOCAL_TECHNICAL_OWNER.uid); } catch { return outcome("unavailable"); } }
  v = await inspect(services.auth, services.database); if (v.collision) return outcome("refused");
  if (v.profile) { try { await services.database.doc(`users/${LOCAL_TECHNICAL_OWNER.uid}`).delete(); } catch { return outcome("unavailable"); } }
  if (v.uid) { try { await services.auth.deleteUser(LOCAL_TECHNICAL_OWNER.uid); } catch { return outcome("unavailable"); } }
  return absent(await inspect(services.auth, services.database)) ? outcome("deleted", { uid: LOCAL_TECHNICAL_OWNER.uid }) : outcome("inconsistent");
}); }
export async function closeBootstrapServices(services) { if (services?.app) await deleteApp(services.app); }
async function main() { const command = parseBootstrapCommand(process.argv.slice(2)); let services; try { services = getBootstrapServices(); const result = command === "create" ? await createLocalTechnicalOwner(services) : command === "status" ? await statusLocalTechnicalOwner(services) : command === "rotate-password" ? await rotateLocalTechnicalOwnerPassword(services) : await deleteLocalTechnicalOwner(services); const publicResult = { ...result }; delete publicResult.password; process.stdout.write(`${JSON.stringify(publicResult)}\n`); if (result.password) process.stdout.write(`Mot de passe temporaire (affichage unique) : ${result.password}\n`); process.exitCode = bootstrapExitCode(result); } finally { await closeBootstrapServices(services); } }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { process.stderr.write(`${JSON.stringify({ state: error instanceof BootstrapFailure ? error.state : "unavailable" })}\n`); process.exitCode = 1; });
