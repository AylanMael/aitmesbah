import { Timestamp } from "firebase-admin/firestore";
import { getLocalAdminServices } from "./local-account-admin.mjs";
import { createConsentRecord, createRightsRecord, inspectUpload, reserveAsset, transitionAsset, updateAssetClearances } from "../../lib/crm/private-assets.mjs";
import { normalizeLegacyAudit } from "../../lib/crm/audit-log.mjs";

function assetRef(database, contributionId, assetId) { return database.doc(`contributions/${contributionId}/assets/${assetId}`); }
async function audit(database, action, actorUid, asset, reason = null) {
  const reference=database.collection("auditLogs").doc();
  const legacy={action,actorUid,targetId:asset.assetId,contributionId:asset.contributionId,assetId:asset.assetId,previousState:null,nextState:action.split(".").at(-1),reason,occurredAt:Timestamp.now()};
  await reference.create(normalizeLegacyAudit(legacy,{eventId:reference.id}));
}
export async function reserveLocalAsset(input) {
  const { database } = getLocalAdminServices(); const now = Timestamp.now();
  const asset = reserveAsset({ ...input, now });
  await assetRef(database, asset.contributionId, asset.assetId).create(asset); await audit(database, "asset.reserved", input.actorUid, asset); return asset;
}
export async function quarantineLocalAsset({ contributionId, assetId, buffer, fileName, declaredMimeType, reportedSize, actorUid }) {
  const { database, bucket } = getLocalAdminServices(); const ref = assetRef(database, contributionId, assetId); const snap = await ref.get();
  if (!snap.exists) throw new Error("fichier réservé introuvable");
  const inspection = inspectUpload({ buffer, fileName, declaredMimeType, reportedSize });
  const duplicate = await database.collection(`contributions/${contributionId}/assets`).where("sha256", "==", inspection.sha256).get();
  if (!duplicate.empty) throw new Error("doublon dans la contribution");
  const asset = transitionAsset(snap.data(), "quarantined", { actorUid, now: Timestamp.now(), inspection, scanStatus: "unavailable" });
  await bucket.file(asset.storagePath).save(buffer, { resumable: false, metadata: { contentType: declaredMimeType, metadata: { assetId, contributionId } } });
  await ref.set(asset); await audit(database, "asset.quarantined", actorUid, asset); return asset;
}
export async function setLocalAssetClearances({ contributionId, assetId, rightsStatus, consentStatus, actorUid }) {
  const { database } = getLocalAdminServices(); const ref = assetRef(database, contributionId, assetId); const snap = await ref.get();
  const asset = updateAssetClearances(snap.data(), { rightsStatus, consentStatus, actorUid, now: Timestamp.now() });
  await ref.set(asset); await audit(database, "asset.clearances_updated", actorUid, asset); return asset;
}
export async function recordLocalRights(input) {
  const { database } = getLocalAdminServices();
  const record = createRightsRecord(input);
  await database.doc(`contributions/${record.contributionId}/rights/${record.rightsId}`).set(record);
  await audit(database, `rights.${record.status}`, input.updatedBy, { contributionId: record.contributionId, assetId: record.assetId, version: record.version });
  return record;
}
export async function recordLocalConsent(input) {
  const { database } = getLocalAdminServices();
  const record = createConsentRecord(input);
  await database.doc(`contributions/${record.contributionId}/consents/${record.consentId}`).set(record);
  await audit(database, `consent.${record.status}`, input.updatedBy, { contributionId: record.contributionId, assetId: record.assetId, version: record.version });
  return record;
}
export async function changeLocalAssetStatus({ contributionId, assetId, nextStatus, actorUid, reason = null }) {
  const { database } = getLocalAdminServices(); const ref = assetRef(database, contributionId, assetId); const snap = await ref.get();
  const asset = transitionAsset(snap.data(), nextStatus, { actorUid, now: Timestamp.now() });
  await ref.set(asset); await audit(database, `asset.${nextStatus}`, actorUid, asset, reason); return asset;
}
export async function physicallyDeleteLocalAsset({ contributionId, assetId, actorUid, referenced = false }) {
  if (referenced) throw new Error("fichier encore référencé");
  const { database, bucket } = getLocalAdminServices(); const ref = assetRef(database, contributionId, assetId); const snap = await ref.get();
  if (!snap.exists || snap.data().status !== "pending_deletion") throw new Error("suppression physique interdite");
  await bucket.file(snap.data().storagePath).delete({ ignoreNotFound: true });
  const asset = transitionAsset(snap.data(), "deleted", { actorUid, now: Timestamp.now() });
  await ref.set(asset); await audit(database, "asset.deleted", actorUid, asset); return asset;
}
