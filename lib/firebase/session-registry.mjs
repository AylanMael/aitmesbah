import { Timestamp } from "firebase-admin/firestore";
import { SESSION_FIELDS,SESSION_SCHEMA_VERSION,assertSessionVersion,nextSessionVersion,validateSessionRecord } from "../crm/session-policy.mjs";

export class SessionRegistryError extends Error{constructor(code){super("session refusée");this.name="SessionRegistryError";this.code=code;}}
const reject=code=>{throw new SessionRegistryError(code);};
const ID=/^[A-Za-z0-9_-]{3,128}$/,FINGERPRINT=/^[a-f0-9]{64}$/;
function exactPlainObject(raw,fields){if(!raw||typeof raw!=="object"||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw))||Object.getOwnPropertySymbols(raw).length!==0)reject("SESSION_SCHEMA_INVALID");const actual=Object.keys(raw).sort(),expected=[...fields].sort();if(actual.length!==expected.length||actual.some((key,index)=>key!==expected[index]))reject("SESSION_SCHEMA_INVALID");}
export function validateExactRawSession(raw){exactPlainObject(raw,SESSION_FIELDS);if(typeof raw.sessionId!=="string"||!FINGERPRINT.test(raw.sessionId)||typeof raw.uid!=="string"||!ID.test(raw.uid)||!['active','revoked'].includes(raw.status)||raw.schemaVersion!==SESSION_SCHEMA_VERSION)reject("SESSION_SCHEMA_INVALID");try{assertSessionVersion(raw.sessionVersion);}catch{reject("SESSION_SCHEMA_INVALID");}if(!(raw.createdAt instanceof Timestamp)||!(raw.expiresAt instanceof Timestamp))reject("SESSION_SCHEMA_INVALID");if(raw.status==="active"&&raw.revokedAt!==null)reject("SESSION_SCHEMA_INVALID");if(raw.status==="revoked"&&!(raw.revokedAt instanceof Timestamp))reject("SESSION_SCHEMA_INVALID");return raw;}
export function sessionTimestampMillis(record){validateExactRawSession(record);return {createdAtMs:record.createdAt.toMillis(),expiresAtMs:record.expiresAt.toMillis()};}

export async function registerCrmSessionRecord(database,record){
  sessionTimestampMillis(record);if(record.status!=="active"||record.revokedAt!==null)reject("SESSION_SCHEMA_INVALID");
  const profileRef=database.doc(`users/${record.uid}`),sessionRef=database.doc(`crmSessions/${record.sessionId}`);
  await database.runTransaction(async tx=>{const profile=await tx.get(profileRef);if(!profile.exists||profile.data().uid!==record.uid||profile.data().status!=="active")reject("SESSION_PROFILE_INVALID");assertSessionVersion(profile.data().version);if(profile.data().version!==record.sessionVersion)reject("SESSION_VERSION_MISMATCH");tx.create(sessionRef,record);});
  return record;
}

export function readCrmSessionAuthorization(database,{uid,sessionId,validate}){
  return database.runTransaction(async tx=>{const [profile,session]=await Promise.all([tx.get(database.doc(`users/${uid}`)),tx.get(database.doc(`crmSessions/${sessionId}`))]);if(!profile.exists||!session.exists)reject("SESSION_NOT_FOUND");validate(profile.data(),session.data(),sessionTimestampMillis(session.data()));return profile.data();});
}

export async function issueRegisteredSession({createCookie,register}){const cookie=await createCookie();await register(cookie);return cookie;}
export function validateRegisteredSession({cookie,decoded,profile,record,nowMs}){const times=sessionTimestampMillis(record);return validateSessionRecord({cookie,decoded,profile,record,...times,nowMs});}
export async function incrementCrmSessionVersion(database,{uid,actorUid,now,mutateTransaction}){const ref=database.doc(`users/${uid}`);return database.runTransaction(async tx=>{const snapshot=await tx.get(ref);if(!snapshot.exists||snapshot.data().status!=="active")reject("SESSION_PROFILE_INVALID");const current=snapshot.data(),updated={...current,updatedAt:now,updatedBy:actorUid,version:nextSessionVersion(current.version)};tx.set(ref,updated);if(mutateTransaction)mutateTransaction(tx,current,updated);return updated;});}
export async function revokeProviderTokens(revoke,uid){try{await revoke(uid);}catch{throw new SessionRegistryError("SESSION_PROVIDER_REVOCATION_FAILED");}}
