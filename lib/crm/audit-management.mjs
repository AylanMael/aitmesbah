import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {AUDIT_CATEGORIES,AUDIT_EVENT_CATALOG,AUDIT_RESULTS} from "./audit-log.mjs";

const IDS=/^[A-Za-z0-9_-]{3,128}$/;
const TARGET_TYPES=Object.freeze(["account","organization","membership","contribution","asset","rights","consent","security"]);
const FILTERS=Object.freeze(["category","eventType","actorUid","organizationId","contributionId","targetType","targetId","result","from","to"]);
const ALLOWED=new Set(["limit","cursor",...FILTERS]);
const MAX_RANGE=90*24*60*60*1000;
const SENSITIVE=new Set(["email","displayName","body","content","storagePath","downloadUrl","password","token","cookie","secret","ipAddress","deviceFingerprint","auth"]);

function fingerprint(filters){return createHash("sha256").update(JSON.stringify(FILTERS.map(key=>[key,filters[key]??null]))).digest("base64url").slice(0,18);}
function parseDate(value,label){if(value==null||value==="")return undefined;assert.equal(typeof value,"string",`${label} invalide`);const date=new Date(value);assert.ok(!Number.isNaN(date.valueOf())&&date.toISOString().startsWith(value.length===10?value:`${value}`.slice(0,10)),`${label} invalide`);return date;}
function parseLimit(value){if(value==null||value==="")return 25;assert.match(String(value),/^\d+$/,"limite invalide");const limit=Number(value);assert.ok(limit>=1&&limit<=100,"limite invalide");return limit;}
export function parseAuditQuery(raw={}){
  assert.ok(raw&&typeof raw==="object"&&!Array.isArray(raw),"filtres invalides");
  assert.ok(Object.keys(raw).every(key=>ALLOWED.has(key)),"filtre inconnu");
  const filters={};for(const key of FILTERS)if(raw[key]!=null&&raw[key]!=="")filters[key]=String(raw[key]);
  if(filters.category)assert.ok(AUDIT_CATEGORIES.includes(filters.category),"catégorie inconnue");
  if(filters.eventType)assert.ok(AUDIT_EVENT_CATALOG[filters.eventType],"événement inconnu");
  if(filters.result)assert.ok(AUDIT_RESULTS.includes(filters.result),"résultat inconnu");
  if(filters.targetType)assert.ok(TARGET_TYPES.includes(filters.targetType),"cible inconnue");
  for(const key of ["actorUid","organizationId","contributionId","targetId"])if(filters[key])assert.match(filters[key],IDS,`${key} invalide`);
  const from=parseDate(filters.from,"date de début"),to=parseDate(filters.to,"date de fin");
  if(from&&to){assert.ok(from<=to,"période inversée");assert.ok(to-from<=MAX_RANGE,"période supérieure à 90 jours");}
  const parsed={limit:parseLimit(raw.limit),filters,from,to};
  return Object.freeze({...parsed,cursor:raw.cursor?decodeAuditCursor(String(raw.cursor),filters):null});
}
export function encodeAuditCursor(position,filters={}){assert.match(position.eventId,IDS);assert.ok(Number.isFinite(position.occurredAtMillis));const payload={v:1,e:position.eventId,t:position.occurredAtMillis,f:fingerprint(filters)};const json=JSON.stringify(payload),signature=createHash("sha256").update(`audit-cursor-v1:${json}`).digest("base64url").slice(0,22);return Buffer.from(JSON.stringify({payload,signature})).toString("base64url");}
export function decodeAuditCursor(cursor,filters={}){try{assert.ok(cursor.length<=600);const envelope=JSON.parse(Buffer.from(cursor,"base64url").toString("utf8")),json=JSON.stringify(envelope.payload),expected=createHash("sha256").update(`audit-cursor-v1:${json}`).digest("base64url").slice(0,22);assert.equal(envelope.signature,expected);assert.deepEqual(Object.keys(envelope.payload).sort(),["e","f","t","v"]);assert.equal(envelope.payload.v,1);assert.match(envelope.payload.e,IDS);assert.ok(Number.isFinite(envelope.payload.t));assert.equal(envelope.payload.f,fingerprint(filters),"curseur incompatible avec les filtres");return Object.freeze({eventId:envelope.payload.e,occurredAtMillis:envelope.payload.t});}catch(error){if(error?.message?.includes("incompatible"))throw error;throw new TypeError("curseur invalide");}}
export function matchesAuditFilters(event,spec){for(const key of ["category","eventType","actorUid","organizationId","contributionId","targetType","targetId","result"])if(spec.filters[key]&&event[key]!==spec.filters[key])return false;const millis=event.occurredAt?.toMillis?.()??event.occurredAt?.milliseconds??event.occurredAt?.seconds*1000;if(spec.from&&millis<spec.from.valueOf())return false;if(spec.to&&millis>spec.to.valueOf()+86_399_999)return false;return true;}
export function minimizeAuditEvent(event){const result={};for(const key of ["eventId","eventType","category","actorType","actorUid","targetType","targetId","organizationId","contributionId","assetId","changedFields","result","occurredAt","correlationId","schemaVersion","reason"])if(event[key]!=null&&!SENSITIVE.has(key))result[key]=event[key];return Object.freeze(result);}
export function stableAuditSort(left,right){const a=left.occurredAt?.toMillis?.()??left.occurredAt?.seconds*1000??0,b=right.occurredAt?.toMillis?.()??right.occurredAt?.seconds*1000??0;return b-a||String(right.eventId).localeCompare(String(left.eventId));}
export function assertAuditReadOnly(method){assert.equal(method,"GET","méthode interdite");return true;}
