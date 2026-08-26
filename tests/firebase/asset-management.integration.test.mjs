import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {inspectUpload,UPLOAD_LIMITS} from "../../lib/crm/private-assets.mjs";

const admin=await readFile(new URL("../../lib/firebase/asset-admin.ts",import.meta.url),"utf8");
const uploadRoute=await readFile(new URL("../../app/api/crm/contributions/[contributionId]/assets/route.ts",import.meta.url),"utf8");
const deletionRoute=await readFile(new URL("../../app/api/crm/assets/deletion-requests/route.ts",import.meta.url),"utf8");
const ui=await readFile(new URL("../../components/crm/AssetManager.tsx",import.meta.url),"utf8");
const rules=await readFile(new URL("../../storage.rules",import.meta.url),"utf8");
const jpeg=Buffer.from([0xff,0xd8,0xff,0xe0,1]);
const pdf=Buffer.from("%PDF-1.7 synthetic");
const sagaSource=admin.match(/\/\/ TESTABLE_ASSET_SAGAS_START([\s\S]*?)\/\/ TESTABLE_ASSET_SAGAS_END/)[1].replaceAll(":any","");
const {executeUploadSaga,executeDeletionSaga}=new Function(`${sagaSource};return {executeUploadSaga,executeDeletionSaga};`)();

function uploadHarness(failure){
  const state={document:null,object:false,successAudits:0,objectsCreated:0,calls:{createReservation:0,uploadObject:0,finalizeUpload:0,deleteCompensationObject:0,removeCompensatedReservation:0,markUploadFailed:0,markUploadReconciliation:0}};
  const call=name=>state.calls[name]++;
  const operations={
    closedError:message=>Object.assign(new Error(message),{http:503}),
    createReservation:async()=>{call("createReservation");if(failure.reservation)throw new Error("firestore");if(state.document)throw Object.assign(new Error("doublon"),{http:409});state.document={assetId:"asset_fault",status:"reserved",uploadState:"reserved",version:1,organizationId:"org_a"};return state.document;},
    uploadObject:async()=>{call("uploadObject");if(failure.storage)throw new Error("storage");state.object=true;state.objectsCreated++;},
    markUploadFailed:async reservation=>{call("markUploadFailed");state.document={...reservation,uploadState:"storage_failed",version:reservation.version+1};},
    finalizeUpload:async reservation=>{call("finalizeUpload");if(failure.finalize)throw new Error("firestore");state.document={...reservation,status:"quarantined",uploadState:"complete",version:reservation.version+1};state.successAudits++;return state.document;},
    deleteCompensationObject:async()=>{call("deleteCompensationObject");if(failure.compensation)throw new Error("storage compensation");state.object=false;},
    removeCompensatedReservation:async()=>{call("removeCompensatedReservation");state.document=null;},
    markUploadReconciliation:async()=>{call("markUploadReconciliation");state.document={...state.document,uploadState:"reconciliation_required"};},
  };
  return {state,operations};
}

function deletionHarness(options={}){
  const state={document:{assetId:"asset_fault",status:options.status??"pending_deletion",version:options.version??3,deletionRequestedBy:options.requester??"author_a",organizationId:"org_a"},object:options.object??true,successAudits:options.successAudits??0,calls:{loadAndValidate:0,assertNotReferenced:0,reserveDeletion:0,deleteObject:0,markDeletionFailed:0,finalizeDeletion:0,markDeletionReconciliation:0,stableDeleted:0}};
  const call=name=>state.calls[name]++;
  const operations={
    closedError:message=>Object.assign(new Error(message),{http:503}),
    loadAndValidate:async payload=>{call("loadAndValidate");if(payload.expectedVersion!==state.document.version)throw Object.assign(new Error("conflit de version"),{http:409});if(state.document.status!=="deleted"&&state.document.deletionRequestedBy===payload.executorUid)throw Object.assign(new Error("séparation"),{http:403});return state.document;},
    stableDeleted:async value=>{call("stableDeleted");return value;},
    assertNotReferenced:async()=>{call("assertNotReferenced");if(options.referenced)throw Object.assign(new Error("référencé"),{http:409});},
    reserveDeletion:async value=>{call("reserveDeletion");state.document={...value,deletionExecutionStatus:"in_progress",deletionExecutorUid:"admin_b",version:value.version+1};return state.document;},
    deleteObject:async()=>{call("deleteObject");if(options.deleteFailure)throw new Error("storage");state.object=false;},
    markDeletionFailed:async()=>{call("markDeletionFailed");state.document={...state.document,deletionExecutionStatus:"failed"};},
    finalizeDeletion:async value=>{call("finalizeDeletion");if(options.finalizeFailure)throw new Error("firestore");state.document={...value,status:"deleted",deletionExecutionStatus:"completed",version:value.version+1};if(!state.successAudits)state.successAudits++;return state.document;},
    markDeletionReconciliation:async()=>{call("markDeletionReconciliation");state.document={...state.document,deletionExecutionStatus:"reconciliation_required"};},
  };
  return {state,operations,options};
}

test("la limite multipart absolue est 26 Mio",()=>{assert.match(uploadRoute,/26\*1024\*1024/);assert.match(uploadRoute,/size>MAX/);});
test("une image de plus de 15 Mio est refusée",()=>assert.throws(()=>inspectUpload({fileName:"x.jpg",declaredMimeType:"image/jpeg",buffer:jpeg,reportedSize:UPLOAD_LIMITS.image+1})));
test("un PDF de plus de 25 Mio est refusé",()=>assert.throws(()=>inspectUpload({fileName:"x.pdf",declaredMimeType:"application/pdf",buffer:pdf,reportedSize:UPLOAD_LIMITS.pdf+1})));
test("les incohérences extension MIME et signature sont refusées",()=>{assert.throws(()=>inspectUpload({fileName:"x.pdf",declaredMimeType:"application/pdf",buffer:jpeg}));assert.throws(()=>inspectUpload({fileName:"x.jpg",declaredMimeType:"application/pdf",buffer:pdf}));});
test("l'organisation est héritée de la contribution",()=>{assert.match(admin,/organizationId:contribution\.organizationId\?\?null/);assert.doesNotMatch(uploadRoute,/organizationId.*form\.get/);});
test("le doublon est recherché dans la contribution seulement",()=>assert.match(admin,/collection\(`contributions\/\$\{contributionId\}\/assets`\)\.where\("sha256"/));
test("la réservation Firestore précède l'écriture Storage",()=>assert.ok(admin.indexOf("reservationBatch.commit()")<admin.indexOf("storageFile.save")));
test("un échec Storage retire la réservation",()=>assert.match(admin,/storageFile\.save[\s\S]*ref\.delete\(\)/));
test("un échec de finalisation déclenche la compensation Storage",()=>assert.match(admin,/runTransaction[\s\S]*storageFile\.delete\(\{ignoreNotFound:true\}\)/));
test("un échec de compensation reste explicite",()=>assert.match(admin,/uploadState:"reconciliation_required"/));
test("aucun faux succès n'est retourné après une compensation",()=>assert.match(admin,/closedError\("finalisation impossible"\)/));
test("la provenance possède un statut canonique persistant",()=>{assert.match(admin,/sourceStatus:"unknown"/);assert.match(admin,/sourceStatus:input\.value/);assert.match(admin,/sourceStatus:value\.sourceStatus/);});
test("chaque contrôle documentaire exige sa permission précise",()=>{for(const permission of ["editorial.provenance.verify","editorial.rights.verify","editorial.consent.verify"])assert.match(admin,new RegExp(permission.replaceAll(".","\\.")));});
test("la file de suppression exige asset.deletion.manage",()=>{assert.match(deletionRoute,/requireCrmActor\("asset\.deletion\.manage"\)/);assert.match(admin,/permissions\.includes\("asset\.deletion\.manage"\)/);});
test("la pagination vaut 25 par défaut et refuse plus de 100",()=>{assert.match(admin,/raw\.limit===undefined\?25/);assert.match(admin,/limit>100/);});
test("la file ne retourne jamais storagePath",()=>{const body=admin.slice(admin.indexOf("function minimalAsset"),admin.indexOf("export async function listAssetRecords"));assert.doesNotMatch(body,/storagePath/);});
test("la suppression réserve Firestore avant de supprimer les octets",()=>assert.ok(admin.indexOf('reserveDeletion:async')<admin.indexOf('deleteObject:async')));
test("le conflit de version précède toute suppression Storage",()=>assert.ok(admin.indexOf('fresh.data()!.version!==expectedVersion')<admin.indexOf('deleteObject:async')));
test("un fichier référencé ne peut pas être supprimé",()=>assert.match(admin,/array-contains[\s\S]*fichier encore référencé/));
test("demandeur et exécutant doivent être distincts",()=>assert.match(admin,/current\.deletionRequestedBy===uid/));
test("un échec Storage conserve un état récupérable",()=>assert.match(admin,/deletionExecutionStatus:"failed"/));
test("un échec de finalisation exige une réconciliation",()=>assert.match(admin,/deletionExecutionStatus:"reconciliation_required"/));
test("la suppression d'un objet déjà absent est idempotente",()=>assert.match(admin,/delete\(\{ignoreNotFound:true\}\)/));
test("Storage reste fermé à tous les SDK clients",()=>assert.match(rules,/allow read, write: if false/));
test("custom claims et organizationMemberships ne participent pas aux décisions",()=>{assert.doesNotMatch(admin,/customClaims|organizationMemberships/);});
test("le message antivirus exact est visible",()=>assert.match(ui,/Analyse antivirus indisponible — ce fichier n’est pas déclaré exempt de logiciel malveillant\./));
test("aucun vocabulaire ne prétend que le fichier est sain",()=>{for(const phrase of ["fichier sûr","fichier propre","sans virus","analyse réussie","fichier sécurisé"])assert.ok(!ui.toLowerCase().includes(phrase));});
test("le navigateur n'utilise aucun SDK Storage",()=>assert.doesNotMatch(ui,/firebase\/storage|getStorage|uploadBytes|9199/));

test("injection: échec de réservation Firestore n'appelle jamais Storage",async()=>{const h=uploadHarness({reservation:true});await assert.rejects(executeUploadSaga(h.operations,{}),error=>error.http===503);assert.deepEqual(h.state.calls,{createReservation:1,uploadObject:0,finalizeUpload:0,deleteCompensationObject:0,removeCompensatedReservation:0,markUploadFailed:0,markUploadReconciliation:0});assert.equal(h.state.document,null);assert.equal(h.state.object,false);assert.equal(h.state.successAudits,0);});
test("injection: échec Storage conserve un état non disponible sans faux succès",async()=>{const h=uploadHarness({storage:true});await assert.rejects(executeUploadSaga(h.operations,{}),/téléversement impossible/);assert.equal(h.state.document.uploadState,"storage_failed");assert.equal(h.state.document.status,"reserved");assert.equal(h.state.object,false);assert.equal(h.state.successAudits,0);assert.equal(h.state.calls.finalizeUpload,0);});
test("injection: échec de finalisation compense réellement l'objet",async()=>{const h=uploadHarness({finalize:true});await assert.rejects(executeUploadSaga(h.operations,{}),/finalisation impossible/);assert.equal(h.state.calls.deleteCompensationObject,1);assert.equal(h.state.object,false);assert.equal(h.state.document,null);assert.equal(h.state.successAudits,0);});
test("injection: double échec finalisation et compensation exige réconciliation",async()=>{const h=uploadHarness({finalize:true,compensation:true});await assert.rejects(executeUploadSaga(h.operations,{}),error=>error.http===503&&!error.message.includes("private/"));assert.equal(h.state.document.uploadState,"reconciliation_required");assert.equal(h.state.object,true);assert.equal(h.state.successAudits,0);assert.equal(h.state.calls.markUploadReconciliation,1);});
test("injection: répétition après échec Storage ne crée aucun second objet",async()=>{const h=uploadHarness({storage:true});await assert.rejects(executeUploadSaga(h.operations,{}));await assert.rejects(executeUploadSaga(h.operations,{}));assert.equal(h.state.objectsCreated,0);assert.equal(h.state.calls.uploadObject,1);assert.equal(h.state.successAudits,0);});
test("injection: conflit de version précède toute suppression",async()=>{const h=deletionHarness();await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:2,executorUid:"admin_b"}),error=>error.http===409);assert.equal(h.state.calls.reserveDeletion,0);assert.equal(h.state.calls.deleteObject,0);assert.equal(h.state.object,true);assert.equal(h.state.document.version,3);});
test("injection: demandeur identique à l'exécutant est refusé avant Storage",async()=>{const h=deletionHarness();await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:3,executorUid:"author_a"}),error=>error.http===403);assert.equal(h.state.calls.deleteObject,0);assert.equal(h.state.object,true);assert.equal(h.state.document.status,"pending_deletion");});
test("injection: fichier référencé est refusé avant réservation",async()=>{const h=deletionHarness({referenced:true});await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:3,executorUid:"admin_b"}),error=>error.http===409);assert.equal(h.state.calls.reserveDeletion,0);assert.equal(h.state.calls.deleteObject,0);assert.equal(h.state.object,true);});
test("injection: échec Storage après réservation reste récupérable",async()=>{const h=deletionHarness({deleteFailure:true});await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:3,executorUid:"admin_b"}),/suppression physique impossible/);assert.equal(h.state.document.status,"pending_deletion");assert.equal(h.state.document.deletionExecutionStatus,"failed");assert.equal(h.state.document.version,4);assert.equal(h.state.object,true);assert.equal(h.state.successAudits,0);});
test("injection: échec de finalisation après effacement exige réconciliation",async()=>{const h=deletionHarness({finalizeFailure:true});await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:3,executorUid:"admin_b"}),/réconciliation requise/);assert.equal(h.state.object,false);assert.equal(h.state.document.status,"pending_deletion");assert.equal(h.state.document.deletionExecutionStatus,"reconciliation_required");assert.equal(h.state.successAudits,0);});
test("injection: reprise après réconciliation finalise sans nouvel objet ni double audit",async()=>{const h=deletionHarness({finalizeFailure:true});await assert.rejects(executeDeletionSaga(h.operations,{expectedVersion:3,executorUid:"admin_b"}));h.options.finalizeFailure=false;const result=await executeDeletionSaga(h.operations,{expectedVersion:4,executorUid:"admin_b"});assert.equal(result.status,"deleted");assert.equal(h.state.object,false);assert.equal(h.state.calls.deleteObject,2);assert.equal(h.state.successAudits,1);});
test("injection: nouvel appel sur deleted est stable et sans effet",async()=>{const h=deletionHarness({status:"deleted",version:7,object:false,successAudits:1});const result=await executeDeletionSaga(h.operations,{expectedVersion:7,executorUid:"admin_b"});assert.equal(result.status,"deleted");assert.equal(h.state.calls.stableDeleted,1);assert.equal(h.state.calls.reserveDeletion,0);assert.equal(h.state.calls.deleteObject,0);assert.equal(h.state.calls.finalizeDeletion,0);assert.equal(h.state.successAudits,1);});
