import assert from "node:assert/strict";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

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
export function createInvitation({invitationId,uid,email,token,createdBy,createdAt,expiresAt}){
  assert.match(invitationId,ID,"invitationId invalide");assert.match(uid,ID,"uid invalide");assert.match(createdBy,ID,"createdBy invalide");
  assert.match(email,/^[^\s@]+@example\.test$/,"email fictif requis");assert.ok(createdAt&&expiresAt&&expiresAt.toMillis()>createdAt.toMillis(),"expiration invalide");
  return Object.freeze({invitationId,uid,email,state:"pending",tokenFingerprint:invitationTokenFingerprint(token),roles:Object.freeze([]),createdBy,createdAt,expiresAt,usedAt:null,revokedAt:null,version:1});
}
export function validateInvitation(invitation,{token,now}){
  assert.ok(invitation&&INVITATION_STATES.includes(invitation.state),"invitation invalide");assert.equal(invitation.state,"pending","invitation fermée");assert.equal(invitation.version,1,"version d'invitation invalide");assert.equal(invitation.usedAt,null,"invitation fermée");assert.equal(invitation.revokedAt,null,"invitation fermée");
  assert.ok(now.toMillis()<invitation.expiresAt.toMillis(),"invitation expirée");assert.ok(safeInvitationFingerprintEqual(invitation.tokenFingerprint,invitationTokenFingerprint(token)),"invitation invalide");assert.deepEqual(invitation.roles,[],"rôles interdits");return true;
}
export function consumeInvitation(invitation,{token,now}){validateInvitation(invitation,{token,now});return Object.freeze({...invitation,state:"used",usedAt:now,version:2});}
export function revokeInvitation(invitation,{now}){assert.equal(invitation?.state,"pending","invitation fermée");assert.equal(invitation.version,1,"version d'invitation invalide");return Object.freeze({...invitation,state:"revoked",revokedAt:now,version:2});}
