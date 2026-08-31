import assert from "node:assert/strict";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { validateApprovedGlobalRoles } from "./activation-policy.mjs";

export const INVITATION_STATES=Object.freeze(["pending","used","revoked"]);
export const INVITATION_PENDING_FIELDS=Object.freeze(["invitationId","uid","email","state","tokenFingerprint","roles","createdBy","createdAt","expiresAt","usedAt","revokedAt","version"]);
export const INVITATION_USED_FIELDS=Object.freeze(["invitationId","uid","email","state","createdBy","createdAt","expiresAt","usedAt","revokedAt","version"]);
export const INVITATION_REVOKED_FIELDS=Object.freeze(["invitationId","uid","email","state","createdBy","createdAt","expiresAt","usedAt","revokedAt","version"]);
export const INVITATION_REJECTED="INVITATION_REJECTED";
export class InvitationPolicyError extends Error{constructor(){super("invitation refusée");this.name="InvitationPolicyError";this.code=INVITATION_REJECTED;}}
const ID=/^[A-Za-z0-9_-]{3,128}$/;
const digest=value=>createHash("sha256").update(value).digest("hex");

export function generateInvitationToken(){return randomBytes(32).toString("base64url");}
export function invitationTokenFingerprint(token){assert.equal(typeof token,"string","invitation invalide");assert.ok(token.length>=32&&token.length<=256,"invitation invalide");return digest(token);}
export function safeInvitationFingerprintEqual(left,right){if(typeof left!=="string"||typeof right!=="string"||!/^[a-f0-9]{64}$/.test(left)||!/^[a-f0-9]{64}$/.test(right))return false;const a=Buffer.from(left,"hex"),b=Buffer.from(right,"hex");return a.length===b.length&&timingSafeEqual(a,b);}
export function createInvitation({invitationId,uid,email,token,roles,createdBy,createdAt,expiresAt}){
  assert.match(invitationId,ID,"invitationId invalide");assert.match(uid,ID,"uid invalide");assert.match(createdBy,ID,"createdBy invalide");
  assert.match(email,/^[^\s@]+@example\.test$/,"email fictif requis");assert.ok(createdAt&&expiresAt&&expiresAt.toMillis()>createdAt.toMillis(),"expiration invalide");
  return Object.freeze({invitationId,uid,email,state:"pending",tokenFingerprint:invitationTokenFingerprint(token),roles:validateApprovedGlobalRoles(roles),createdBy,createdAt,expiresAt,usedAt:null,revokedAt:null,version:1});
}
export function validateInvitation(invitation,{token,now}){
  assert.ok(invitation&&INVITATION_STATES.includes(invitation.state),"invitation invalide");assert.equal(invitation.state,"pending","invitation fermée");assert.equal(invitation.version,1,"version d'invitation invalide");assert.equal(invitation.usedAt,null,"invitation fermée");assert.equal(invitation.revokedAt,null,"invitation fermée");
  assert.ok(now.toMillis()<invitation.expiresAt.toMillis(),"invitation expirée");assert.ok(safeInvitationFingerprintEqual(invitation.tokenFingerprint,invitationTokenFingerprint(token)),"invitation invalide");validateApprovedGlobalRoles(invitation.roles);return true;
}
function closedInvitation(invitation,state,now){return Object.freeze({invitationId:invitation.invitationId,uid:invitation.uid,email:invitation.email,state,createdBy:invitation.createdBy,createdAt:invitation.createdAt,expiresAt:invitation.expiresAt,usedAt:state==="used"?now:null,revokedAt:state==="revoked"?now:null,version:2});}
export function consumeInvitation(invitation,{token,now}){validateInvitation(invitation,{token,now});return closedInvitation(invitation,"used",now);}
export function revokeInvitation(invitation,{now}){assert.equal(invitation?.state,"pending","invitation fermée");assert.equal(invitation.version,1,"version d'invitation invalide");return closedInvitation(invitation,"revoked",now);}
