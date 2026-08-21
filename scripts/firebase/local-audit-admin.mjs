import { Timestamp } from "firebase-admin/firestore";
import { buildAuditQuery, createAuditEvent, normalizeLegacyAudit } from "../../lib/crm/audit-log.mjs";
import { getLocalAdminServices } from "./local-account-admin.mjs";

export async function appendCanonicalAudit(legacy,{correlationId,actorType="local_admin"}={}){
  const {database}=getLocalAdminServices(); const reference=database.collection("auditLogs").doc();
  const event=normalizeLegacyAudit(legacy,{eventId:reference.id,correlationId:correlationId??reference.id,actorType}); await reference.create(event); return event;
}
export async function createSyntheticAudit(input){const {database}=getLocalAdminServices();const reference=database.collection("auditLogs").doc();const event=createAuditEvent({...input,eventId:reference.id,occurredAt:input.occurredAt??Timestamp.now()});await reference.create(event);return event;}
export async function queryLocalAudit(filters={}){const spec=buildAuditQuery(filters);const {database}=getLocalAdminServices();let query=database.collection("auditLogs");for(const key of ["category","eventType","actorUid","organizationId","contributionId","targetType","targetId"]){if(spec[key]!=null)query=query.where(key,"==",spec[key]);}if(spec.from)query=query.where("occurredAt",">=",spec.from);if(spec.to)query=query.where("occurredAt","<=",spec.to);query=query.orderBy("occurredAt","desc").orderBy("eventId","desc");if(spec.cursor){const cursor=await database.doc(`auditLogs/${spec.cursor}`).get();if(!cursor.exists)throw new Error("curseur invalide");query=query.startAfter(cursor);}return (await query.limit(spec.limit).get()).docs.map(d=>d.data());}
export async function clearLocalAuditFixtures(){const {database}=getLocalAdminServices();const snapshot=await database.collection("auditLogs").get();for(const document of snapshot.docs)await document.ref.delete();}
