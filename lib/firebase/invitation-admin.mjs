import { Timestamp } from "firebase-admin/firestore";
import { INVITATION_PENDING_FIELDS,INVITATION_USED_FIELDS,InvitationPolicyError,invitationTokenFingerprint, safeInvitationFingerprintEqual } from "../crm/invitation-policy.mjs";

const ID=/^[A-Za-z0-9_-]{3,128}$/;
const EMAIL=/^[^\s@]+@example\.test$/,FINGERPRINT=/^[a-f0-9]{64}$/;
const reject=()=>{throw new InvitationPolicyError();};
function exactPlainObject(raw,fields){if(!raw||typeof raw!=="object"||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw))||Object.getOwnPropertySymbols(raw).length!==0)reject();const actual=Object.keys(raw).sort(),expected=[...fields].sort();if(actual.length!==expected.length||actual.some((key,index)=>key!==expected[index]))reject();}
export function validateExactPendingInvitation(raw){exactPlainObject(raw,INVITATION_PENDING_FIELDS);if(!ID.test(raw.invitationId)||!ID.test(raw.uid)||!ID.test(raw.createdBy)||typeof raw.email!=="string"||!EMAIL.test(raw.email)||raw.state!=="pending"||raw.version!==1||typeof raw.tokenFingerprint!=="string"||!FINGERPRINT.test(raw.tokenFingerprint)||!Array.isArray(raw.roles)||raw.roles.length!==0||!(raw.createdAt instanceof Timestamp)||!(raw.expiresAt instanceof Timestamp)||raw.usedAt!==null||raw.revokedAt!==null)reject();return raw;}
function usedInvitation(raw,now){const used={invitationId:raw.invitationId,uid:raw.uid,email:raw.email,state:"used",createdBy:raw.createdBy,createdAt:raw.createdAt,expiresAt:raw.expiresAt,usedAt:now,revokedAt:null,version:2};exactPlainObject(used,INVITATION_USED_FIELDS);return used;}

export async function consumeCrmInvitation(database,invitationId,token){
  if(!ID.test(invitationId))throw new InvitationPolicyError();
  let fingerprint;try{fingerprint=invitationTokenFingerprint(token);}catch{throw new InvitationPolicyError();}const ref=database.doc(`crmInvitations/${invitationId}`);
  return database.runTransaction(async tx=>{
    const snapshot=await tx.get(ref);if(!snapshot.exists)throw new InvitationPolicyError();
    const invitation=validateExactPendingInvitation(snapshot.data()),now=Timestamp.now();
    if(now.toMillis()>=invitation.expiresAt.toMillis()||!safeInvitationFingerprintEqual(invitation.tokenFingerprint,fingerprint))throw new InvitationPolicyError();
    const canonical=usedInvitation(invitation,now);tx.set(ref,canonical);
    return Object.freeze({invitationId,uid:invitation.uid,state:"used",usedAt:now});
  });
}
