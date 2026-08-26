import "server-only";
import {randomUUID} from "node:crypto";
import {FieldPath,Timestamp} from "firebase-admin/firestore";
import {normalizeLegacyAudit} from "@/lib/crm/audit-log.mjs";
import {effectivePermissions} from "@/lib/crm/organization-authorization.mjs";
import {inspectUpload,reserveAsset,transitionAsset,updateAssetClearances} from "@/lib/crm/private-assets.mjs";
import {getLocalFirebaseAdmin} from "./admin";

type Actor={uid:string;permissions:string[];organizations:string[]};
type AssetMutation={operation:string;value?:string;field?:string;reason:string;expectedVersion:number};
const ID=/^[A-Za-z0-9_-]{3,80}$/;
const DOWNLOADABLE=new Set(["quarantined","validated"]);
const fail=(message:string,http:number)=>Object.assign(new Error(message),{http});
function assertId(value:string,label:string){if(!ID.test(value))throw fail(`${label} invalide`,422);}

// TESTABLE_ASSET_SAGAS_START
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeUploadSaga(operations:any,payload:any){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reservation:any;
  try{reservation=await operations.createReservation(payload);}catch{throw operations.closedError("réservation impossible");}
  try{await operations.uploadObject(reservation,payload);}
  catch{try{await operations.markUploadFailed(reservation,"storage_failed");}catch{}throw operations.closedError("téléversement impossible");}
  try{return await operations.finalizeUpload(reservation,payload);}
  catch{
    try{await operations.deleteCompensationObject(reservation);await operations.removeCompensatedReservation(reservation);}
    catch{try{await operations.markUploadReconciliation(reservation);}catch{}}
    throw operations.closedError("finalisation impossible");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeDeletionSaga(operations:any,payload:any){
  const current=await operations.loadAndValidate(payload);
  if(current.status==="deleted")return operations.stableDeleted(current);
  await operations.assertNotReferenced(current,payload);
  const reserved=await operations.reserveDeletion(current,payload);
  try{await operations.deleteObject(reserved,payload);}
  catch{try{await operations.markDeletionFailed(reserved,payload);}catch{}throw operations.closedError("suppression physique impossible");}
  try{return await operations.finalizeDeletion(reserved,payload);}
  catch{try{await operations.markDeletionReconciliation(reserved,payload);}catch{}throw operations.closedError("réconciliation requise");}
}
// TESTABLE_ASSET_SAGAS_END

async function actor(uid:string):Promise<Actor>{
  assertId(uid,"uid");
  const {database}=getLocalFirebaseAdmin(),profile=await database.doc(`users/${uid}`).get();
  if(!profile.exists||profile.data()!.status!=="active")throw fail("acteur inactif",403);
  const data=profile.data()!,permissions=effectivePermissions({accountStatus:data.status,globalRoles:data.globalRoles,organization:null,membership:null,organizationId:null}).global,organizations:string[]=[];
  for(const snap of (await database.collectionGroup("memberships").where("uid","==",uid).get()).docs){const membership=snap.data(),organization=await database.doc(`organizations/${membership.organizationId}`).get();if(membership.status==="active"&&organization.exists&&organization.data()!.status==="active")organizations.push(membership.organizationId);}
  return {uid,permissions,organizations};
}
function audit(database:FirebaseFirestore.Firestore,event:Record<string,unknown>,result:"success"|"failed"="success"){const ref=database.collection("auditLogs").doc();return {ref,value:normalizeLegacyAudit(event,{eventId:ref.id,correlationId:ref.id,result} as never)};}
async function context(uid:string,contributionId:string,permission:string,{allowAdministrator=false}={}){
  assertId(contributionId,"contributionId");
  const {database}=getLocalFirebaseAdmin(),currentActor=await actor(uid),snapshot=await database.doc(`contributions/${contributionId}`).get();
  if(!snapshot.exists)throw fail("introuvable",404);
  const contribution=snapshot.data()!,self=permission==="asset.self.manage"&&contribution.authorUid===uid&&currentActor.permissions.includes(permission),assigned=currentActor.permissions.includes(permission)&&contribution.assignedReviewerUids?.includes(uid),administrator=allowAdministrator&&currentActor.permissions.includes("asset.deletion.manage");
  if(!(self||assigned||administrator))throw fail("permission insuffisante",403);
  if(!administrator&&contribution.organizationId&&!currentActor.organizations.includes(contribution.organizationId))throw fail("organisation interdite",403);
  return {database,currentActor,contribution};
}
function minimalAsset(value:FirebaseFirestore.DocumentData){return {assetId:value.assetId,contributionId:value.contributionId,organizationId:value.organizationId??null,status:value.status,scanStatus:value.scanStatus,safeFileName:value.safeFileName,declaredMimeType:value.declaredMimeType,detectedMimeType:value.detectedMimeType,size:value.size,sha256:value.sha256,sourceStatus:value.sourceStatus??"unknown",rightsStatus:value.rightsStatus,consentStatus:value.consentStatus,deletionRequestedBy:value.deletionRequestedBy??null,deletionExecutionStatus:value.deletionExecutionStatus??null,version:value.version};}

export async function listAssetRecords(uid:string,contributionId:string){let ctx;try{ctx=await context(uid,contributionId,"asset.assigned.read");}catch{ctx=await context(uid,contributionId,"asset.self.manage");}const docs=await ctx.database.collection(`contributions/${contributionId}/assets`).orderBy("createdAt","desc").limit(100).get();return docs.docs.map(doc=>minimalAsset(doc.data()));}

export async function getAssetDownload(uid:string,contributionId:string,assetId:string){
  assertId(assetId,"assetId");
  let ctx;try{ctx=await context(uid,contributionId,"asset.assigned.read");}catch{ctx=await context(uid,contributionId,"asset.self.manage");}
  const snapshot=await ctx.database.doc(`contributions/${contributionId}/assets/${assetId}`).get();if(!snapshot.exists)throw fail("introuvable",404);
  const asset=snapshot.data()!,expectedPath=`private/contributions/${contributionId}/${assetId}/original`;
  if(asset.contributionId!==contributionId||asset.organizationId!==(ctx.contribution.organizationId??null)||!DOWNLOADABLE.has(asset.status)||asset.storagePath!==expectedPath)throw fail("fichier indisponible",404);
  const [bytes]=await getLocalFirebaseAdmin().bucket.file(expectedPath).download();
  return {bytes,fileName:String(asset.safeFileName),contentType:String(asset.detectedMimeType)};
}

export async function uploadAssetRecord(uid:string,contributionId:string,file:File){
  const {database,contribution}=await context(uid,contributionId,"asset.self.manage");if(file.size>25*1024*1024)throw fail("taille interdite",413);
  const buffer=Buffer.from(await file.arrayBuffer()),inspection=inspectUpload({fileName:file.name,declaredMimeType:file.type,buffer,reportedSize:file.size});
  const duplicate=await database.collection(`contributions/${contributionId}/assets`).where("sha256","==",inspection.sha256).limit(1).get();if(!duplicate.empty)throw fail("doublon dans la contribution",409);
  const assetId=`asset-${randomUUID()}`,now=Timestamp.now(),ref=database.doc(`contributions/${contributionId}/assets/${assetId}`);
  const base={...reserveAsset({assetId,contributionId,organizationId:contribution.organizationId??null,uploaderUid:uid,fileName:file.name,declaredMimeType:file.type,now,actorUid:uid} as never),sha256:inspection.sha256,sourceStatus:"unknown",uploadState:"reserved"};
  const storageFile=getLocalFirebaseAdmin().bucket.file(base.storagePath);
  return executeUploadSaga({
    closedError:(message:string)=>fail(message,503),
    createReservation:async()=>{const event=audit(database,{action:"asset.reserved",actorUid:uid,targetId:assetId,contributionId,assetId,organizationId:base.organizationId,previousState:null,nextState:"reserved",reason:"réservation privée",occurredAt:now}),batch=database.batch();batch.create(ref,base);batch.create(event.ref,event.value);await batch.commit();return base;},
    uploadObject:async()=>storageFile.save(buffer,{resumable:false,metadata:{contentType:inspection.detectedMimeType??file.type,metadata:{assetId,contributionId}}}),
    markUploadFailed:async(reserved:FirebaseFirestore.DocumentData,state:string)=>ref.set({uploadState:state,updatedAt:Timestamp.now(),updatedBy:uid,version:reserved.version+1},{merge:true}),
    finalizeUpload:async(reserved:FirebaseFirestore.DocumentData)=>{const quarantined={...transitionAsset(reserved,"quarantined",{actorUid:uid,now:Timestamp.now(),inspection,scanStatus:"unavailable"} as never),uploadState:"complete"},event=audit(database,{action:"asset.quarantined",actorUid:uid,targetId:assetId,contributionId,assetId,organizationId:quarantined.organizationId,previousState:"reserved",nextState:"quarantined",reason:"téléversement privé contrôlé",occurredAt:Timestamp.now()});await database.runTransaction(async transaction=>{const fresh=await transaction.get(ref);if(!fresh.exists||fresh.data()!.version!==reserved.version||fresh.data()!.uploadState!=="reserved")throw new Error("conflit de version");transaction.set(ref,quarantined);transaction.create(event.ref,event.value);});return minimalAsset(quarantined);},
    deleteCompensationObject:async()=>storageFile.delete({ignoreNotFound:true}),
    removeCompensatedReservation:async()=>ref.delete(),
    markUploadReconciliation:async()=>ref.set({uploadState:"reconciliation_required",updatedAt:Timestamp.now(),updatedBy:uid},{merge:true}),
  },{assetId,contributionId});
}

export async function listDeletionRequests(uid:string,raw:Record<string,string|undefined>){
  const currentActor=await actor(uid);if(!currentActor.permissions.includes("asset.deletion.manage"))throw fail("permission insuffisante",403);
  if(Object.keys(raw).some(key=>!["limit","cursor"].includes(key)))throw fail("filtre inconnu",422);
  const limit=raw.limit===undefined?25:Number(raw.limit);if(!Number.isInteger(limit)||limit<1||limit>100)throw fail("limite invalide",422);
  let cursor="";if(raw.cursor){try{cursor=Buffer.from(raw.cursor,"base64url").toString("utf8");}catch{throw fail("curseur invalide",422);}if(!/^contributions\/[A-Za-z0-9_-]{3,80}\/assets\/[A-Za-z0-9_-]{3,80}$/.test(cursor))throw fail("curseur invalide",422);}
  const {database}=getLocalFirebaseAdmin();let query:FirebaseFirestore.Query=database.collectionGroup("assets").where("status","==","pending_deletion").orderBy(FieldPath.documentId()).limit(limit+1);if(cursor)query=query.startAfter(cursor);
  const docs=(await query.get()).docs,page=docs.slice(0,limit);return {requests:page.map(doc=>minimalAsset(doc.data())),nextCursor:docs.length>limit?Buffer.from(page.at(-1)!.ref.path).toString("base64url"):null};
}

async function deleteAsset(database:FirebaseFirestore.Firestore,uid:string,contributionId:string,assetId:string,current:FirebaseFirestore.DocumentData,expectedVersion:number,reason:string){
  const ref=database.doc(`contributions/${contributionId}/assets/${assetId}`);
  return executeDeletionSaga({
    closedError:(message:string)=>fail(message,503),
    loadAndValidate:async()=>{if(current.status==="deleted")return current;if(current.status!=="pending_deletion"||current.deletionRequestedBy===uid)throw fail("suppression interdite",403);return current;},
    stableDeleted:async(value:FirebaseFirestore.DocumentData)=>minimalAsset(value),
    assertNotReferenced:async()=>{const references=await database.collection("contents").where("assetIds","array-contains",assetId).limit(1).get();if(!references.empty)throw fail("fichier encore référencé",409);},
    reserveDeletion:async(value:FirebaseFirestore.DocumentData)=>{const reservedVersion=expectedVersion+1,now=Timestamp.now();await database.runTransaction(async transaction=>{const fresh=await transaction.get(ref);if(!fresh.exists||fresh.data()!.version!==expectedVersion||fresh.data()!.status!=="pending_deletion")throw new Error("conflit de version");transaction.update(ref,{deletionExecutionStatus:"in_progress",deletionExecutorUid:uid,deletionExecutionAt:now,updatedAt:now,updatedBy:uid,version:reservedVersion});});return {...value,version:reservedVersion,deletionExecutionStatus:"in_progress",deletionExecutorUid:uid};},
    deleteObject:async(value:FirebaseFirestore.DocumentData)=>getLocalFirebaseAdmin().bucket.file(value.storagePath).delete({ignoreNotFound:true}),
    markDeletionFailed:async()=>ref.set({deletionExecutionStatus:"failed",updatedAt:Timestamp.now(),updatedBy:uid},{merge:true}),
    finalizeDeletion:async(reserved:FirebaseFirestore.DocumentData)=>{const now=Timestamp.now(),deleted={...transitionAsset(reserved,"deleted",{actorUid:uid,now} as never),deletionExecutionStatus:"completed"},event=audit(database,{action:"asset.deleted",actorUid:uid,targetId:assetId,contributionId,assetId,organizationId:current.organizationId,previousState:"pending_deletion",nextState:"deleted",reason,occurredAt:now});await database.runTransaction(async transaction=>{const fresh=await transaction.get(ref);if(!fresh.exists||fresh.data()!.version!==reserved.version||fresh.data()!.deletionExecutorUid!==uid)throw new Error("conflit de réconciliation");transaction.set(ref,deleted);transaction.create(event.ref,event.value);});return minimalAsset(deleted);},
    markDeletionReconciliation:async()=>ref.set({deletionExecutionStatus:"reconciliation_required",updatedAt:Timestamp.now(),updatedBy:uid},{merge:true}),
  },{assetId,contributionId,expectedVersion});
}

export async function mutateAssetRecord(uid:string,contributionId:string,assetId:string,input:AssetMutation){
  assertId(assetId,"assetId");const permission=input.operation==="request_deletion"||input.operation==="withdraw"?"asset.self.manage":input.operation==="delete"?"asset.deletion.manage":"asset.assigned.review";
  const {database,currentActor,contribution}=await context(uid,contributionId,permission,{allowAdministrator:input.operation==="delete"}),ref=database.doc(`contributions/${contributionId}/assets/${assetId}`),snapshot=await ref.get();if(!snapshot.exists)throw fail("introuvable",404);
  const current=snapshot.data()!;if(current.version!==input.expectedVersion||current.contributionId!==contributionId||current.organizationId!==(contribution.organizationId??null))throw new Error("conflit de version");if(input.operation==="delete")return deleteAsset(database,uid,contributionId,assetId,current,input.expectedVersion,input.reason);
  const now=Timestamp.now();let next=current,action="asset.updated";
  if(input.operation==="clearance"){
    const fields={sourceStatus:"editorial.provenance.verify",rightsStatus:"editorial.rights.verify",consentStatus:"editorial.consent.verify"} as const,field=input.field as keyof typeof fields;if(!fields[field]||!currentActor.permissions.includes(fields[field]))throw fail("permission documentaire insuffisante",403);
    if(field==="sourceStatus"){if(!["unknown","declared","verified"].includes(String(input.value)))throw fail("statut de provenance invalide",422);next={...current,sourceStatus:input.value,updatedAt:now,updatedBy:uid,version:current.version+1};action="contribution.updated";}
    else{next=updateAssetClearances(current,{rightsStatus:field==="rightsStatus"?input.value:current.rightsStatus,consentStatus:field==="consentStatus"?input.value:current.consentStatus,actorUid:uid,now});action=field==="consentStatus"?"consent.status_changed":"rights.status_changed";}
  }else if(["validate","reject","withdraw"].includes(input.operation)){const status=input.operation==="validate"?"validated":input.operation==="reject"?"rejected":"withdrawn";next=transitionAsset(current,status,{actorUid:uid,now} as never);action=`asset.${status}`;}
  else if(input.operation==="request_deletion"){next={...transitionAsset(current,"pending_deletion",{actorUid:uid,now} as never),deletionRequestedBy:uid,deletionRequestedAt:now,deletionExecutionStatus:"requested"};action="asset.deletion_requested";}
  else throw new TypeError("opération inconnue");
  const event=audit(database,{action,actorUid:uid,targetId:assetId,contributionId,assetId,organizationId:current.organizationId,previousState:current.status,nextState:next.status,changedFields:input.operation==="clearance"?[String(input.field)]:undefined,reason:input.reason,occurredAt:now});
  await database.runTransaction(async transaction=>{const fresh=await transaction.get(ref);if(!fresh.exists||fresh.data()!.version!==input.expectedVersion)throw new Error("conflit de version");transaction.set(ref,next);transaction.create(event.ref,event.value);});return minimalAsset(next);
}
