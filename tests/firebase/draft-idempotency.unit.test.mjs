import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {draftCreationIdentity} from "../../lib/crm/draft-idempotency.mjs";
const key="c7edb832-21d1-4a0f-912a-b5f447999fb3";
const input={title:"Archive",summary:"Résumé",body:"Texte",category:"history_memory",sensitivity:"ordinary",organizationId:null,organizationRepresentation:null};
test("identité stable, liée au compte et indépendante de l'ordre des propriétés",()=>{
  const identity=draftCreationIdentity("author",key,input);
  assert.deepEqual(identity,draftCreationIdentity("author",key.toUpperCase(),Object.fromEntries(Object.entries(input).reverse())));
  assert.notEqual(identity.contributionId,draftCreationIdentity("other",key,input).contributionId);
  assert.notEqual(identity.fingerprint,draftCreationIdentity("author",key,{...input,body:"Autre"}).fingerprint);
  assert.equal(identity.contributionId,draftCreationIdentity("author",key,{...input,body:"Autre"}).contributionId);
});
test("clé absente compatible ; clé invalide refusée",()=>{
  assert.equal(draftCreationIdentity("author",null,input),null);
  for(const invalid of ["","../test","a".repeat(500),123])assert.throws(()=>draftCreationIdentity("author",invalid,input),{http:422});
});
test("la reprise conserve clé et contenu et le serveur revérifie la permission",async()=>{
  const route=await readFile("app/api/crm/contributions/route.ts","utf8");
  const client=await readFile("components/crm/ContributionManager.tsx","utf8");
  assert.match(route,/requireCrmActor\("draft.self.manage"\)/);
  assert.match(route,/request.headers.get\("Idempotency-Key"\)/);
  assert.match(client,/attempt.body, attempt.key/);
  assert.match(client,/if\(!creationAttemptRef.current\)/);
});
