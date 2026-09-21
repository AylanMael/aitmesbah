import test from "node:test";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {getLocalAdminServices} from "../../scripts/firebase/local-account-admin.mjs";
import {assertLocalEmulatorSafety} from "./test-helpers.mjs";
import {draftCreationIdentity,commitDraftOnce} from "../../lib/crm/draft-idempotency.mjs";

test("Firestore : concurrence, réponse perdue, conflit de contenu et préservation des modifications",async()=>{
  assertLocalEmulatorSafety();
  const {database}=getLocalAdminServices(),uid=`qa-${randomUUID()}`,key=randomUUID();
  const input={title:"Test QA",summary:"Résumé",body:"Texte",category:"history_memory",sensitivity:"ordinary",organizationId:null,organizationRepresentation:null};
  const identity=draftCreationIdentity(uid,key,input);
  const scope=database.collection("qaDraftAttempts").doc(uid);
  const ref=scope.collection("contributions").doc(identity.contributionId);
  const versionRef=ref.collection("versions").doc("v1");
  const auditRefs=[];
  const send=async(identityOverride=identity,author=uid)=>{
    const auditRef=scope.collection("auditLogs").doc();auditRefs.push(auditRef);
    return commitDraftOnce(database,{ref,contribution:{authorUid:uid,title:input.title},versionRef,version:{body:input.body},auditRef,audit:{action:"created"},identity:identityOverride,uid:author});
  };
  try {
    const results=await Promise.all(Array.from({length:5},()=>send()));
    assert.equal(results.length,5);
    assert.equal((await scope.collection("auditLogs").get()).size,1);
    assert.equal((await ref.collection("versions").get()).size,1);
    await ref.update({title:"Titre modifié après création"});
    assert.equal((await send()).title,"Titre modifié après création");
    await assert.rejects(send(draftCreationIdentity(uid,key,{...input,body:"Différent"})),{http:409});
    await assert.rejects(send(identity,"another-author"),{http:409});
    assert.equal((await scope.collection("auditLogs").get()).size,1);
  } finally {
    await Promise.all([...auditRefs.map(audit=>audit.delete()),versionRef.delete(),ref.delete()]);
  }
});
