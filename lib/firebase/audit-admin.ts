import "server-only";
import {FieldPath,Timestamp} from "firebase-admin/firestore";
import {encodeAuditCursor,minimizeAuditEvent,parseAuditQuery} from "@/lib/crm/audit-management.mjs";
import {getLocalFirebaseAdmin} from "./admin";
import {rejectInexactFilters} from "@/lib/crm/request-security.mjs";

export async function listAuditRecords(raw:Record<string,string|undefined>){
  rejectInexactFilters(raw);const spec=parseAuditQuery(Object.fromEntries(Object.entries(raw).filter(([,value])=>value!==undefined))),{database}=getLocalFirebaseAdmin();
  let query:FirebaseFirestore.Query=database.collection("auditLogs").orderBy("occurredAt","desc").orderBy(FieldPath.documentId(),"desc");
  if(spec.cursor)query=query.startAfter(Timestamp.fromMillis(spec.cursor.occurredAtMillis),spec.cursor.eventId);
  const scanned=(await query.limit(spec.limit+1).get()).docs,selected=scanned.slice(0,spec.limit),items=selected.map(doc=>({...minimizeAuditEvent(doc.data()),occurredAt:{seconds:doc.data().occurredAt.seconds}}));
  const hasMore=scanned.length>spec.limit,last=hasMore?selected.at(-1):undefined;
  return {items,nextCursor:hasMore&&last?encodeAuditCursor({eventId:last.id,occurredAtMillis:last.data().occurredAt.toMillis()},spec.filters):null,hasMore};
}
