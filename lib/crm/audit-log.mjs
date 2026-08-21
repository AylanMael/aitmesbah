import assert from "node:assert/strict";

export const AUDIT_CATEGORIES = Object.freeze(["account","organization","membership","authorization","contribution","editorial","asset","rights","consent","security"]);
export const AUDIT_RESULTS = Object.freeze(["success","denied","failed"]);
export const AUDIT_EVENT_CATALOG = Object.freeze({
  "account.invited":"account", "account.status_changed":"account",
  "organization.created":"organization", "organization.status_changed":"organization", "organization.verification_changed":"organization", "organization.mandate_changed":"organization",
  "membership.invited":"membership", "membership.status_changed":"membership", "membership.roles_changed":"membership",
  "contribution.created":"contribution", "contribution.updated":"contribution", "contribution.submitted":"contribution", "contribution.status_changed":"contribution", "contribution.version_created":"contribution",
  "review.assigned":"editorial", "editorial.decision_recorded":"editorial", "contribution.changes_requested":"editorial", "contribution.approved":"editorial", "contribution.rejected":"editorial", "contribution.withdrawn":"editorial", "contribution.contested":"editorial", "contribution.unpublished":"editorial",
  "asset.reserved":"asset", "asset.quarantined":"asset", "asset.validated":"asset", "asset.rejected":"asset", "asset.withdrawn":"asset", "asset.deletion_requested":"asset", "asset.deleted":"asset",
  "rights.declared":"rights", "rights.status_changed":"rights", "consent.recorded":"consent", "consent.status_changed":"consent", "consent.withdrawn":"consent",
  "authorization.denied":"authorization", "security.account_suspended":"security", "security.account_revoked":"security", "security.emergency_remove":"security",
});
const FIELDS=["eventId","eventType","category","actorUid","actorType","targetType","targetId","organizationId","contributionId","assetId","previousState","nextState","changedFields","reason","result","occurredAt","correlationId","schemaVersion"];
const REQUIRED=["eventId","eventType","category","actorType","targetType","targetId","changedFields","result","occurredAt","correlationId","schemaVersion"];
const REASON_REQUIRED=new Set(["organization.status_changed","organization.mandate_changed","membership.status_changed","membership.roles_changed","contribution.changes_requested","contribution.rejected","contribution.withdrawn","contribution.contested","contribution.unpublished","asset.rejected","asset.withdrawn","asset.deletion_requested","consent.withdrawn","security.account_suspended","security.account_revoked","security.emergency_remove"]);
const ID=/^[A-Za-z0-9_-]{3,128}$/;
const FORBIDDEN=/(?:@|password|token|secret|private[_ -]?key|authorization\s*:|-----BEGIN)/i;
function cleanText(value,label,max=500,required=true){ if(value==null&&!required)return null; assert.equal(typeof value,"string",`${label} invalide`); const clean=value.trim().replace(/\s+/g," "); assert.ok((!required||clean)&&clean.length<=max,`${label} invalide`); assert.ok(!FORBIDDEN.test(clean),`${label} contient une donnée interdite`); return clean||null; }
function optionalId(value,label){ if(value==null)return null; assert.match(value,ID,`${label} invalide`); return value; }
export function createAuditEvent(input){
  assert.ok(Object.keys(input).every(key=>FIELDS.includes(key))&&REQUIRED.every(key=>Object.hasOwn(input,key)),"champs d'audit inconnus ou manquants");
  assert.match(input.eventId,ID); assert.ok(AUDIT_EVENT_CATALOG[input.eventType],"type d'événement inconnu"); assert.equal(input.category,AUDIT_EVENT_CATALOG[input.eventType],"catégorie incohérente");
  optionalId(input.actorUid,"actorUid"); assert.ok(["user","local_admin","system"].includes(input.actorType),"actorType inconnu");
  assert.match(input.targetType,/^[a-z_]{3,40}$/); assert.match(input.targetId,ID);
  optionalId(input.organizationId,"organizationId"); optionalId(input.contributionId,"contributionId"); optionalId(input.assetId,"assetId"); optionalId(input.correlationId,"correlationId");
  if(input.category==="organization"||input.category==="membership") assert.ok(input.organizationId,"organizationId requis");
  if(["contribution","editorial","asset","rights","consent"].includes(input.category)) assert.ok(input.contributionId,"contributionId requis");
  if(["asset","rights","consent"].includes(input.category)) assert.ok(input.assetId,"assetId requis");
  const changed=[...new Set(input.changedFields.map(x=>cleanText(x,"changedFields",60)))].sort(); assert.ok(changed.length<=20,"changedFields trop long");
  const reasonRequired=REASON_REQUIRED.has(input.eventType)||(input.eventType==="account.status_changed"&&["suspended","revoked"].includes(input.nextState))||(["rights.status_changed","consent.status_changed"].includes(input.eventType)&&["withdrawn","rejected"].includes(input.nextState));
  const reason=cleanText(input.reason,"reason",500,reasonRequired);
  assert.ok(AUDIT_RESULTS.includes(input.result),"résultat inconnu"); assert.ok(input.occurredAt&&typeof input.occurredAt==="object","horodatage invalide"); assert.ok(Number.isInteger(input.schemaVersion)&&input.schemaVersion>0,"schemaVersion invalide");
  if(input.previousState!==null&&input.nextState!==null) assert.notEqual(input.previousState,input.nextState,"états identiques");
  const event={...input,changedFields:Object.freeze(changed),reason};
  for(const key of Object.keys(event))if(event[key]===null||event[key]===undefined)delete event[key];
  return Object.freeze(event);
}
export function normalizeLegacyAudit(legacy,{eventId,correlationId=eventId,actorType="local_admin",result="success"}={}){
  const original=legacy.action; let eventType=original;
  if(original==="asset.pending_deletion")eventType="asset.deletion_requested";
  if(original==="asset.clearances_updated")eventType="rights.status_changed";
  if(original?.startsWith("rights."))eventType=original==="rights.pending"?"rights.declared":"rights.status_changed";
  if(original?.startsWith("consent."))eventType=original==="consent.pending"?"consent.recorded":original==="consent.withdrawn"?"consent.withdrawn":"consent.status_changed";
  if(original==="contribution.submitted"||original==="contribution.changes_requested"||original==="contribution.approved"||original==="contribution.rejected"||original==="contribution.withdrawn"||original==="contribution.contested"||original==="contribution.unpublished"){} else if(original?.startsWith("contribution.")&&!AUDIT_EVENT_CATALOG[original])eventType="contribution.status_changed";
  const targetId=legacy.targetId??legacy.targetUid??legacy.assetId??legacy.contributionId??legacy.organizationId;
  const targetType=eventType.startsWith("account.")?"account":eventType.startsWith("organization.")?"organization":eventType.startsWith("membership.")?"membership":eventType.startsWith("asset.")?"asset":eventType.startsWith("rights.")?"rights":eventType.startsWith("consent.")?"consent":"contribution";
  let previousState=legacy.previousState??legacy.previousStatus??null, nextState=legacy.nextState??legacy.nextStatus??null;
  if(previousState===nextState){previousState=null;nextState=null;}
  return createAuditEvent({eventId,eventType,category:AUDIT_EVENT_CATALOG[eventType],actorUid:legacy.actorUid??null,actorType,targetType,targetId,organizationId:legacy.organizationId??null,contributionId:legacy.contributionId??null,assetId:legacy.assetId??null,previousState,nextState,changedFields:previousState===nextState?[]:[targetType==="account"?"status":"state"],reason:legacy.reason??null,result,occurredAt:legacy.occurredAt,correlationId,schemaVersion:1});
}
export function buildAuditQuery(input={}){
  const allowed=["limit","cursor","category","eventType","actorUid","organizationId","contributionId","targetType","targetId","from","to"];
  assert.ok(Object.keys(input).every(k=>allowed.includes(k)),"filtre inconnu");
  const limit=input.limit??25; assert.ok(Number.isInteger(limit)&&limit>=1&&limit<=100,"limite invalide");
  if(input.category!=null)assert.ok(AUDIT_CATEGORIES.includes(input.category),"catégorie inconnue");
  if(input.eventType!=null)assert.ok(AUDIT_EVENT_CATALOG[input.eventType],"événement inconnu");
  for(const key of ["actorUid","organizationId","contributionId","targetId","cursor"])optionalId(input[key],key);
  if(input.targetType!=null)assert.match(input.targetType,/^[a-z_]{3,40}$/);
  for(const key of ["from","to"])if(input[key]!=null)assert.ok(typeof input[key]==="object",`${key} invalide`);
  return Object.freeze({...input,limit,orderBy:"occurredAt",direction:"desc"});
}
export function assertAuditImmutable(){throw new Error("un événement d'audit est immuable");}
export function assertAuditNotDeletable(){throw new Error("suppression ordinaire d'un audit interdite");}
