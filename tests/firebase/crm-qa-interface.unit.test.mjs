import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {accountListQuery,filterAccountPage,accountPageHref} from "../../lib/crm/account-navigation.mjs";
import {organizationListQuery,filterOrganizationPage,organizationPageHref} from "../../lib/crm/organization-navigation.mjs";
import {assetLoadFailureMessage} from "../../lib/crm/upload-feedback.mjs";

test("les filtres comptes restent locaux et se conservent dans la pagination",()=>{
  assert.deepEqual(accountListQuery({prefix:"Am",status:"active",cursor:"abc",limit:"50",uid:"other"}),{cursor:"abc",limit:"50"});
  const accounts=[{displayName:"Amar",status:"active"},{displayName:"Amel",status:"invited"}];
  assert.deepEqual(filterAccountPage(accounts,{prefix:" aM ",status:"active"}),[accounts[0]]);
  assert.deepEqual(filterAccountPage(accounts,{prefix:"introuvable"}),[]);
  const url=new URL(accountPageHref("a/b",{prefix:"Aït &",status:"active"}),"https://example.test");
  assert.equal(url.searchParams.get("prefix"),"Aït &");assert.equal(url.searchParams.get("cursor"),"a/b");
});
test("les filtres organisations restent locaux",()=>{
  assert.deepEqual(organizationListQuery({cursor:"x",limit:"25",status:"active"}),{cursor:"x",limit:"25"});
  const org={type:"association",status:"active",verificationStatus:"verified"};
  assert.deepEqual(filterOrganizationPage([org],{type:"association",status:"active",verification:"verified"}),[org]);
  assert.deepEqual(filterOrganizationPage([org],{status:"archived"}),[]);
  assert.match(organizationPageHref("next",{verification:"verified"}),/verification=verified/);
});
test("le menu conserve des noms accessibles et une grille mobile sans défilement masqué",async()=>{
  const nav=await readFile("components/crm/CrmNavigation.tsx","utf8"),css=await readFile("components/crm/crm-navigation.css","utf8");
  assert.match(nav,/aria-label=\{item.label\}/);assert.match(nav,/aria-current/);
  assert.match(css,/repeat\(3, minmax\(0, 1fr\)\)/);assert.match(css,/position: sticky/);assert.match(css,/focus-visible/);
});
test("un refus de fichiers n'est pas présenté comme un fonds vide",()=>{
  assert.match(assetLoadFailureMessage(403),/réservés à son auteur/);
  assert.match(assetLoadFailureMessage(401),/session a expiré/);
  assert.match(assetLoadFailureMessage(500),/présence ne peut pas être déterminée/);
});
test("le choix nominatif utilise l'annuaire existant sans nouveau droit",async()=>{
  const picker=await readFile("components/crm/AccountPicker.tsx","utf8");
  assert.match(picker,/if\(!canRead\)/);assert.match(picker,/\/api\/crm\/accounts\?/);
  assert.match(picker,/account.uid!==excludeUid/);assert.match(picker,/account.authDisabled===false/);
  assert.doesNotMatch(picker,/method:\s*["']POST/);
  const preview=await readFile("app/crm/contributions/[contributionId]/apercu/page.tsx","utf8");
  assert.match(preview,/contributionCategoryLabels\[contribution.category\]/);
});
