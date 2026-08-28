import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const route=await readFile(new URL("../../app/api/crm/contributions/[contributionId]/assets/[assetId]/download/route.ts",import.meta.url),"utf8");
const admin=await readFile(new URL("../../lib/firebase/asset-admin.ts",import.meta.url),"utf8");
const request=await readFile(new URL("../../lib/firebase/crm-request.ts",import.meta.url),"utf8");

test("le téléchargement est une route GET serveur",()=>{assert.match(route,/export async function GET/);assert.match(route,/getAssetDownload/);});
test("une session CRM et une permission de lecture sont exigées",()=>{assert.match(route,/requireCrmActor/);assert.match(route,/asset\.self\.manage/);assert.match(route,/asset\.assigned\.read/);});
test("Host et Origin sont contrôlés centralement pour les lectures",()=>{assert.match(route,/validateCrmRead/);assert.match(request,/validateRequestSecurity/);assert.match(request,/request\.headers\.get\("host"\)/);});
test("la réponse force un téléchargement",()=>assert.match(route,/Content-Disposition.*attachment/));
test("la réponse interdit le sniffing",()=>assert.match(route,/X-Content-Type-Options|CRM_HEADERS/));
test("la réponse ne peut pas être mise en cache",()=>assert.match(route,/private, no-store, max-age=0/));
test("le nom téléchargé est nettoyé et borné",()=>{assert.match(route,/replace\(\/\[\^A-Za-z0-9\._-\]/);assert.match(route,/slice\(0,120\)/);});
test("aucune redirection ni URL signée n'est produite",()=>{assert.doesNotMatch(route,/redirect|signedUrl|getSignedUrl/i);assert.doesNotMatch(admin,/getSignedUrl/);});
test("le chemin Storage est reconstruit côté serveur",()=>assert.match(admin,/private\/contributions\/\$\{contributionId\}\/\$\{assetId\}\/original/));
test("un chemin Storage incohérent est refusé",()=>assert.match(admin,/asset\.storagePath!==expectedPath/));
test("les états retiré, rejeté et supprimé ne sont pas téléchargeables",()=>assert.match(admin,/DOWNLOADABLE=new Set\(\["quarantined","validated"\]\)/));
test("le Content-Type vient de la métadonnée détectée",()=>{assert.match(admin,/contentType:String\(asset\.detectedMimeType\)/);assert.doesNotMatch(route,/searchParams.*contentType/);});
