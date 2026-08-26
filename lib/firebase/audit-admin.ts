import "server-only";
import {FieldPath,Timestamp} from "firebase-admin/firestore";
import {encodeAuditCursor,matchesAuditFilters,minimizeAuditEvent,parseAuditQuery} from "@/lib/crm/audit-management.mjs";
import {getLocalFirebaseAdmin} from "./admin";

export async function listAuditRecords(raw:Record<string,string|undefined>){
  const spec=parseAuditQuery(Object.fromEntries(Object.entries(raw).filter(([,value])=>value!==undefined))),{database}=getLocalFirebaseAdmin();
  let query:FirebaseFirestore.Query=database.collection("auditLogs").orderBy("occurredAt","desc").orderBy(FieldPath.documentId(),"desc");
  if(spec.cursor)query=query.startAfter(Timestamp.fromMillis(spec.cursor.occurredAtMillis),spec.cursor.eventId);
  const scanned=(await query.limit(101).get()).docs,page=scanned.slice(0,100),matching=page.filter(doc=>matchesAuditFilters(doc.data(),spec)),selected=matching.slice(0,spec.limit),items=selected.map(doc=>({...minimizeAuditEvent(doc.data()),occurredAt:{seconds:doc.data().occurredAt.seconds}}));
  const hasMore=matching.length>spec.limit||scanned.length>100,last=matching.length>spec.limit?selected.at(-1):scanned.length>100?page.at(-1):undefined;
  return {items,nextCursor:hasMore&&last?encodeAuditCursor({eventId:last.id,occurredAtMillis:last.data().occurredAt.toMillis()},spec.filters):null,hasMore};
}
