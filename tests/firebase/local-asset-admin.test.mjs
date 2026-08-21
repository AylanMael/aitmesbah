import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { reserveLocalAsset, quarantineLocalAsset, setLocalAssetClearances, changeLocalAssetStatus, physicallyDeleteLocalAsset, recordLocalRights, recordLocalConsent } from "../../scripts/firebase/local-asset-admin.mjs";
import { getLocalAdminServices } from "../../scripts/firebase/local-account-admin.mjs";

before(()=>{ process.env.GCLOUD_PROJECT="demo-aitmesbah"; process.env.FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"; process.env.FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"; process.env.FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"; });
after(async()=>{ const {database,bucket}=getLocalAdminServices(); for(const name of ["contributions","auditLogs"]){const s=await database.collection(name).get(); for(const d of s.docs) await database.recursiveDelete(d.ref);} await bucket.deleteFiles({prefix:"private/"}); });
test("cycle local privé, validation, retrait et suppression physique tracée", async()=>{
  let asset=await reserveLocalAsset({assetId:"asset_local_1",contributionId:"contribution_local_1",uploaderUid:"user_local_1",fileName:"preuve.pdf",declaredMimeType:"application/pdf",actorUid:"editor_local_1"});
  asset=await quarantineLocalAsset({contributionId:asset.contributionId,assetId:asset.assetId,buffer:Buffer.from("%PDF-1.7 synthetic"),fileName:"preuve.pdf",declaredMimeType:"application/pdf",actorUid:"editor_local_1"});
  assert.equal(asset.status,"quarantined"); assert.equal(asset.scanStatus,"unavailable");
  asset=await setLocalAssetClearances({contributionId:asset.contributionId,assetId:asset.assetId,rightsStatus:"cleared",consentStatus:"not_required",actorUid:"rights_local_1"});
  asset=await changeLocalAssetStatus({contributionId:asset.contributionId,assetId:asset.assetId,nextStatus:"validated",actorUid:"editor_local_1"});
  asset=await changeLocalAssetStatus({contributionId:asset.contributionId,assetId:asset.assetId,nextStatus:"pending_deletion",actorUid:"editor_local_1",reason:"retrait demandé"});
  await assert.rejects(()=>physicallyDeleteLocalAsset({contributionId:asset.contributionId,assetId:asset.assetId,actorUid:"owner_local_1",referenced:true}));
  asset=await physicallyDeleteLocalAsset({contributionId:asset.contributionId,assetId:asset.assetId,actorUid:"owner_local_1"}); assert.equal(asset.status,"deleted");
  const [exists]=await getLocalAdminServices().bucket.file(asset.storagePath).exists(); assert.equal(exists,false);
  const logs=await getLocalAdminServices().database.collection("auditLogs").where("assetId","==",asset.assetId).get(); assert.ok(logs.size>=6);
});
test("l’administration locale rejette signature incohérente et dépassement", async()=>{
  await reserveLocalAsset({assetId:"asset_local_2",contributionId:"contribution_local_2",uploaderUid:"user_local_1",fileName:"photo.jpg",declaredMimeType:"image/jpeg",actorUid:"editor_local_1"});
  await assert.rejects(()=>quarantineLocalAsset({contributionId:"contribution_local_2",assetId:"asset_local_2",buffer:Buffer.from("%PDF-x"),fileName:"photo.jpg",declaredMimeType:"image/jpeg",actorUid:"editor_local_1"}));
});
test("les décisions de droits et consentement sont privées et auditées", async()=>{
  const now=new Date("2026-08-21T00:00:00Z");
  const base={contributionId:"contribution_local_3",assetId:"asset_local_3",createdAt:now,updatedAt:now,decidedAt:now,withdrawnAt:null,createdBy:"rights_local_1",updatedBy:"rights_local_1",version:1};
  const rights=await recordLocalRights({...base,rightsId:"rights_local_1",origin:"auteur",holderReference:"adult-opaque",authorizationBasis:"déclaration",authorizationScope:"site privé",credit:"À déterminer",status:"cleared"});
  const consent=await recordLocalConsent({...base,consentId:"consent_local_1",subjectReference:"adult-opaque",purpose:"archive privée",scope:"site privé",status:"granted"});
  assert.equal(rights.status,"cleared"); assert.equal(consent.status,"granted");
  const logs=await getLocalAdminServices().database.collection("auditLogs").where("contributionId","==","contribution_local_3").get(); assert.equal(logs.size,2);
});
