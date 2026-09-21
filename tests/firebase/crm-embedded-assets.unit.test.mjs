import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("la fiche utilise le gestionnaire existant sans autoriser le dépôt sur le dossier d’un autre auteur", async () => {
  const page=await readFile("app/crm/contributions/[contributionId]/page.tsx","utf8");
  assert.match(page,/embeddedContribution=\{\{contributionId:contribution.contributionId/);
  assert.match(page,/p!=="asset.self.manage"\|\|contribution.authorUid===session.uid/);
  assert.match(page,/id="fichiers-du-dossier"/);
});
test("le chargement distingue une erreur d’un fonds vide et ignore les réponses après démontage", async () => {
  const source=await readFile("components/crm/AssetManager.tsx","utf8");
  assert.match(source,/if\(active\)setAssets/);
  assert.match(source,/return\(\)=>\{active=false;\}/);
  assert.match(source,/setLoadError\(true\)/);
  assert.match(source,/Réessayer/);
  assert.match(source,/!loadError&&<form/);
  assert.match(source,/"X-CSRF-Token":await csrf\(\)/);
});
