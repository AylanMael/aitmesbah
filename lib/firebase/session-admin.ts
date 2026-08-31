import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { getLocalFirebaseAdmin } from "./admin";
import { MAX_SESSION_DURATION_MS,createSessionRecord,sessionFingerprint } from "@/lib/crm/session-policy.mjs";
import { normalizeLegacyAudit } from "@/lib/crm/audit-log.mjs";
import { incrementCrmSessionVersion,registerCrmSessionRecord,revokeProviderTokens } from "./session-registry.mjs";

export async function registerCrmSession(cookie:string,uid:string,sessionVersion:number){
  const {database}=getLocalFirebaseAdmin(),createdAt=Timestamp.now(),expiresAt=Timestamp.fromMillis(createdAt.toMillis()+MAX_SESSION_DURATION_MS);
  return registerCrmSessionRecord(database,createSessionRecord({cookie,uid,sessionVersion,createdAt,expiresAt}));
}

export async function revokeLocalCrmSession(cookie:string){
  const {database}=getLocalFirebaseAdmin(),ref=database.doc(`crmSessions/${sessionFingerprint(cookie)}`),snapshot=await ref.get();
  if(snapshot.exists)await ref.update({status:"revoked",revokedAt:Timestamp.now()});
}

export async function revokeAllCrmSessions(uid:string,actorUid:string,reason="déconnexion globale"){
  const {auth,database}=getLocalFirebaseAdmin(),now=Timestamp.now();
  await incrementCrmSessionVersion(database,{uid,actorUid,now,mutateTransaction:(tx:FirebaseFirestore.Transaction,current:FirebaseFirestore.DocumentData,updated:FirebaseFirestore.DocumentData)=>{const eventRef=database.collection("auditLogs").doc(),event=normalizeLegacyAudit({action:"session.revoked_all",actorUid,targetUid:uid,previousState:String(current.version),nextState:String(updated.version),changedFields:["sessionVersion"],reason,occurredAt:now},{eventId:eventRef.id,correlationId:database.collection("correlations").doc().id,actorType:"user"} as never);tx.create(eventRef,event);}});
  await revokeProviderTokens((value:string)=>auth.revokeRefreshTokens(value),uid);
}
