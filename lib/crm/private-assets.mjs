import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";

export const UPLOAD_LIMITS = Object.freeze({ image: 15 * 1024 * 1024, pdf: 25 * 1024 * 1024 });
export const ASSET_STATUSES = Object.freeze(["reserved", "quarantined", "validated", "rejected", "withdrawn", "pending_deletion", "deleted"]);
export const SCAN_STATUSES = Object.freeze(["not_scanned", "pending", "passed", "failed", "unavailable"]);
const FORMATS = Object.freeze({
  "image/jpeg": { extensions: ["jpg", "jpeg"], kind: "image" },
  "image/png": { extensions: ["png"], kind: "image" },
  "image/webp": { extensions: ["webp"], kind: "image" },
  "application/pdf": { extensions: ["pdf"], kind: "pdf" },
});
const TRANSITIONS = Object.freeze({ reserved: ["quarantined", "rejected"], quarantined: ["validated", "rejected", "withdrawn"], validated: ["withdrawn", "pending_deletion"], rejected: ["pending_deletion"], withdrawn: ["pending_deletion"], pending_deletion: ["deleted"], deleted: [] });

function exactKeys(value, keys, label) {
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label}: champs invalides`);
}
function normalizedId(value, label) {
  assert.match(value, /^[A-Za-z0-9_-]{3,80}$/, `${label} invalide`);
  return value;
}
function safeSourceName(name) {
  assert.equal(typeof name, "string");
  assert.ok(name.length > 0 && name.length <= 120, "nom de fichier invalide");
  assert.ok(!/[\\/\0]/.test(name) && !name.includes(".."), "traversée de chemin interdite");
  assert.ok(!/@|\b\d{8,}\b/.test(name), "donnée personnelle interdite dans le nom");
  return name;
}
export function detectMimeType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return "image/png";
  if (buffer.length >= 12 && buffer.subarray(0,4).toString() === "RIFF" && buffer.subarray(8,12).toString() === "WEBP") return "image/webp";
  if (buffer.subarray(0,5).toString() === "%PDF-") return "application/pdf";
  return null;
}
export function inspectUpload({ fileName, declaredMimeType, buffer, reportedSize = buffer?.length }) {
  safeSourceName(fileName);
  assert.ok(Buffer.isBuffer(buffer) && buffer.length > 0, "fichier vide interdit");
  const format = FORMATS[declaredMimeType];
  assert.ok(format, "format déclaré interdit");
  const extension = fileName.split(".").pop().toLowerCase();
  assert.ok(format.extensions.includes(extension), "extension incohérente");
  const detectedMimeType = detectMimeType(buffer);
  assert.equal(detectedMimeType, declaredMimeType, "signature binaire incohérente");
  assert.ok(Number.isSafeInteger(reportedSize) && reportedSize > 0 && reportedSize <= UPLOAD_LIMITS[format.kind], "taille interdite");
  return { detectedMimeType, extension, size: reportedSize, sha256: createHash("sha256").update(buffer).digest("hex") };
}
export function buildPrivateStoragePath(contributionId, assetId) {
  return `private/contributions/${normalizedId(contributionId, "contributionId")}/${normalizedId(assetId, "assetId")}/original`;
}
export function reserveAsset({ assetId = randomUUID(), contributionId, organizationId = null, uploaderUid, fileName, declaredMimeType, now, actorUid }) {
  normalizedId(assetId, "assetId"); normalizedId(contributionId, "contributionId"); normalizedId(uploaderUid, "uploaderUid"); safeSourceName(fileName);
  if (organizationId !== null) normalizedId(organizationId, "organizationId");
  const extension = fileName.split(".").pop().toLowerCase();
  assert.ok(FORMATS[declaredMimeType]?.extensions.includes(extension), "format interdit");
  return { assetId, contributionId, organizationId, uploaderUid, storagePath: buildPrivateStoragePath(contributionId, assetId), safeFileName: `${assetId}.${extension}`, declaredMimeType, detectedMimeType: null, size: null, sha256: null, status: "reserved", scanStatus: "not_scanned", rightsStatus: "unknown", consentStatus: "not_required", createdAt: now, updatedAt: now, validatedAt: null, deletedAt: null, createdBy: actorUid, updatedBy: actorUid, version: 1 };
}
export function transitionAsset(asset, nextStatus, { actorUid, now, inspection, scanStatus = asset.scanStatus } = {}) {
  assert.ok(TRANSITIONS[asset.status]?.includes(nextStatus), `transition ${asset.status} -> ${nextStatus} interdite`);
  assert.ok(SCAN_STATUSES.includes(scanStatus)); normalizedId(actorUid, "actorUid");
  if (nextStatus === "quarantined") assert.ok(inspection?.sha256 && inspection.detectedMimeType && inspection.size, "inspection requise");
  if (nextStatus === "validated") {
    assert.equal(asset.status, "quarantined");
    assert.notEqual(scanStatus, "failed", "analyse échouée");
    assert.equal(asset.rightsStatus, "cleared", "droits non validés");
    assert.ok(["granted", "not_required"].includes(asset.consentStatus), "consentement non validé");
  }
  const next = { ...asset, ...(inspection ?? {}), status: nextStatus, scanStatus, updatedAt: now, updatedBy: actorUid, version: asset.version + 1 };
  if (nextStatus === "validated") next.validatedAt = now;
  if (nextStatus === "deleted") next.deletedAt = now;
  return next;
}
export function findDuplicateWithinContribution(candidate, assets) {
  return assets.find((asset) => asset.contributionId === candidate.contributionId && asset.assetId !== candidate.assetId && asset.sha256 === candidate.sha256) ?? null;
}

const RIGHTS_KEYS = ["rightsId","contributionId","assetId","origin","holderReference","authorizationBasis","authorizationScope","credit","status","createdAt","updatedAt","decidedAt","withdrawnAt","createdBy","updatedBy","version"];
export function createRightsRecord(input) {
  exactKeys(input, RIGHTS_KEYS, "droits");
  assert.ok(["unknown","pending","cleared","not_applicable","withdrawn","rejected"].includes(input.status));
  return { ...input };
}
const CONSENT_KEYS = ["consentId","contributionId","assetId","subjectReference","purpose","scope","status","createdAt","updatedAt","decidedAt","withdrawnAt","createdBy","updatedBy","version"];
export function createConsentRecord(input) {
  exactKeys(input, CONSENT_KEYS, "consentement");
  assert.ok(["not_required","pending","granted","withdrawn","rejected"].includes(input.status));
  assert.notEqual(input.subjectReference, "minor", "mineurs hors périmètre");
  return { ...input };
}
export function updateAssetClearances(asset, { rightsStatus, consentStatus, actorUid, now }) {
  assert.ok(["unknown","pending","cleared","not_applicable","withdrawn","rejected"].includes(rightsStatus));
  assert.ok(["not_required","pending","granted","withdrawn","rejected"].includes(consentStatus));
  return { ...asset, rightsStatus, consentStatus, updatedAt: now, updatedBy: actorUid, version: asset.version + 1 };
}
