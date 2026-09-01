import { Timestamp } from "firebase-admin/firestore";
import { createHash } from "node:crypto";
import { INVITATION_PENDING_FIELDS,INVITATION_USED_FIELDS,InvitationPolicyError,invitationTokenFingerprint, safeInvitationFingerprintEqual } from "../crm/invitation-policy.mjs";
import { ACTIVATION_FIELDS,createActivationRecord,validateActivationRecord,validateApprovedGlobalRoles } from "../crm/activation-policy.mjs";
import { assertProfile } from "../crm/account-lifecycle.mjs";
import { validateAccountVersion } from "../crm/account-version.mjs";

const ID=/^[A-Za-z0-9_-]{3,128}$/;
const EMAIL=/^[^\s@]+@example\.test$/,FINGERPRINT=/^[a-f0-9]{64}$/;
const reject=()=>{throw new InvitationPolicyError();};
function exactPlainObject(raw,fields){if(!raw||typeof raw!=="object"||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw))||Object.getOwnPropertySymbols(raw).length!==0)reject();const actual=Object.keys(raw).sort(),expected=[...fields].sort();if(actual.length!==expected.length||actual.some((key,index)=>key!==expected[index]))reject();}
export function validateExactPendingInvitation(raw){exactPlainObject(raw,INVITATION_PENDING_FIELDS);if(!ID.test(raw.invitationId)||!ID.test(raw.uid)||!ID.test(raw.createdBy)||typeof raw.email!=="string"||!EMAIL.test(raw.email)||raw.email!==raw.email.trim().toLowerCase()||raw.state!=="pending"||raw.version!==1||typeof raw.tokenFingerprint!=="string"||!FINGERPRINT.test(raw.tokenFingerprint)||!(raw.createdAt instanceof Timestamp)||!(raw.expiresAt instanceof Timestamp)||raw.expiresAt.toMillis()<=raw.createdAt.toMillis()||raw.usedAt!==null||raw.revokedAt!==null)reject();try{validateApprovedGlobalRoles(raw.roles);}catch{reject();}return raw;}
function usedInvitation(raw,now){const used={invitationId:raw.invitationId,uid:raw.uid,email:raw.email,state:"used",createdBy:raw.createdBy,createdAt:raw.createdAt,expiresAt:raw.expiresAt,usedAt:now,revokedAt:null,version:2};exactPlainObject(used,INVITATION_USED_FIELDS);return used;}
const ACTIVATION_TIMESTAMP_FIELDS=Object.freeze(["createdAt","expiresAt","passwordCompletedAt","emailVerifiedAt","mfaCompletedAt","completedAt","cancelledAt","expiredAt"]);
export function deriveActivationId(invitationId){if(!ID.test(invitationId))reject();return createHash("sha256").update(`crm-activation:v1:${invitationId}`).digest("hex");}
export function validateExactRawActivation(raw){exactPlainObject(raw,ACTIVATION_FIELDS);for(const field of ACTIVATION_TIMESTAMP_FIELDS)if(raw[field]!==null&&!(raw[field] instanceof Timestamp))reject();if(!(raw.createdAt instanceof Timestamp)||!(raw.expiresAt instanceof Timestamp))reject();const projected={...raw};for(const field of ACTIVATION_TIMESTAMP_FIELDS)projected[field]=raw[field]===null?null:raw[field].toMillis();try{validateActivationRecord(projected);}catch{reject();}return projected;}
export function activationRecordToFirestore(record){validateActivationRecord(record);const raw={...record};for(const field of ACTIVATION_TIMESTAMP_FIELDS)raw[field]=record[field]===null?null:Timestamp.fromMillis(record[field]);validateExactRawActivation(raw);return raw;}
function validateEligibleProfile(raw,{uid,email}){try{assertProfile(raw);validateAccountVersion(raw.version);}catch{reject();}if(raw.uid!==uid||raw.email!==email||raw.status!=="invited"||!Array.isArray(raw.globalRoles)||raw.globalRoles.length!==0)reject();return raw;}

export async function consumeCrmInvitation(database,auth,invitationId,token){
  if(!ID.test(invitationId))throw new InvitationPolicyError();
  let fingerprint;try{fingerprint=invitationTokenFingerprint(token);}catch{throw new InvitationPolicyError();}const ref=database.doc(`crmInvitations/${invitationId}`);
  let identity,activationId,activationRef;try{const invitationSnapshot=await ref.get();if(!invitationSnapshot.exists)reject();const candidate=validateExactPendingInvitation(invitationSnapshot.data());if(candidate.invitationId!==invitationId)reject();activationId=deriveActivationId(candidate.invitationId);activationRef=database.doc(`crmActivations/${activationId}`);identity=await auth.getUser(candidate.uid);if(identity.uid!==candidate.uid||identity.email?.trim().toLowerCase()!==candidate.email||identity.disabled!==true||identity.emailVerified!==false)reject();}catch{reject();}
  try{return await database.runTransaction(async tx=>{
    const [snapshot,profileSnapshot,activationSnapshot]=await Promise.all([tx.get(ref),tx.get(database.doc(`users/${identity.uid}`)),tx.get(activationRef)]);if(!snapshot.exists||!profileSnapshot.exists||activationSnapshot.exists)throw new InvitationPolicyError();
    const invitation=validateExactPendingInvitation(snapshot.data()),now=Timestamp.now();
    if(invitation.invitationId!==invitationId||deriveActivationId(invitation.invitationId)!==activationId||invitation.uid!==identity.uid||now.toMillis()>=invitation.expiresAt.toMillis()||!safeInvitationFingerprintEqual(invitation.tokenFingerprint,fingerprint))throw new InvitationPolicyError();
    validateEligibleProfile(profileSnapshot.data(),{uid:invitation.uid,email:invitation.email});
    const activation=activationRecordToFirestore(createActivationRecord({activationId,invitationId:invitation.invitationId,uid:invitation.uid,email:invitation.email,approvedGlobalRoles:invitation.roles,createdAt:now.toMillis(),expiresAt:invitation.expiresAt.toMillis()}));
    const canonical=usedInvitation(invitation,now);tx.set(ref,canonical);tx.create(activationRef,activation);
    return Object.freeze({state:"accepted",activationId,uid:invitation.uid,email:invitation.email,version:activation.version});
  });}catch{reject();}
}
