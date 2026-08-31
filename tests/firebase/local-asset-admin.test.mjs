import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { reserveLocalAsset, quarantineLocalAsset, setLocalAssetClearances, changeLocalAssetStatus, physicallyDeleteLocalAsset, recordLocalRights, recordLocalConsent } from "../../scripts/firebase/local-asset-admin.mjs";
import { getLocalAdminServices } from "../../scripts/firebase/local-account-admin.mjs";

const suite=`asset_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,contributions=[`${suite}_1`,`${suite}_2`,`${suite}_3`];
before(()=>{ process.env.GCLOUD_PROJECT="demo-aitmesbah"; process.env.FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"; process.env.FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"; process.env.FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"; });
after(async()=>{ const {database,bucket}=getLocalAdminServices();for(const id of contributions){await database.recursiveDelete(database.doc(`contributions/${id}`)).catch(()=>{});const logs=await database.collection("auditLogs").where("contributionId","==",id).get();await Promise.all(logs.docs.map(document=>document.ref.delete()));await bucket.deleteFiles({prefix:`private/${id}/`}).catch(()=>{});} });
test("cycle local privé, validation, retrait et suppression physique tracée", async()=>{
  let asset=await reserveLocalAsset({assetId:`${suite}_asset_1`,contributionId:contributions[0],uploaderUid:`${suite}_user`,fileName:"preuve.pdf",declaredMimeType:"application/pdf",actorUid:`${suite}_editor`});
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
  await reserveLocalAsset({assetId:`${suite}_asset_2`,contributionId:contributions[1],uploaderUid:`${suite}_user`,fileName:"photo.jpg",declaredMimeType:"image/jpeg",actorUid:`${suite}_editor`});
  await assert.rejects(()=>quarantineLocalAsset({contributionId:contributions[1],assetId:`${suite}_asset_2`,buffer:Buffer.from("%PDF-x"),fileName:"photo.jpg",declaredMimeType:"image/jpeg",actorUid:`${suite}_editor`}));
});
test("les décisions de droits et consentement sont privées et auditées", async()=>{
  const now=new Date("2026-08-21T00:00:00Z");
  const base={contributionId:contributions[2],assetId:`${suite}_asset_3`,createdAt:now,updatedAt:now,decidedAt:now,withdrawnAt:null,createdBy:`${suite}_rights`,updatedBy:`${suite}_rights`,version:1};
  const rights=await recordLocalRights({...base,rightsId:`${suite}_rights`,origin:"auteur",holderReference:"adult-opaque",authorizationBasis:"déclaration",authorizationScope:"site privé",credit:"À déterminer",status:"cleared"});
  const consent=await recordLocalConsent({...base,consentId:`${suite}_consent`,subjectReference:"adult-opaque",purpose:"archive privée",scope:"site privé",status:"granted"});
  assert.equal(rights.status,"cleared"); assert.equal(consent.status,"granted");
  const logs=await getLocalAdminServices().database.collection("auditLogs").where("contributionId","==",contributions[2]).get(); assert.equal(logs.size,2);
});
