import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("le statut des fichiers est indexé pour la fiche et pour la médiathèque", async () => {
  const config = JSON.parse(await readFile("firestore.indexes.json", "utf8"));
  const status = config.fieldOverrides.find(field => field.collectionGroup === "assets" && field.fieldPath === "status");
  for (const scope of ["COLLECTION", "COLLECTION_GROUP"]) {
    assert.ok(status?.indexes.some(index => index.queryScope === scope && index.order === "ASCENDING"), scope);
  }
});

test("les erreurs techniques de fiche et d’aperçu ne sont pas masquées en 404", async () => {
  for (const path of ["app/crm/contributions/[contributionId]/page.tsx", "app/crm/contributions/[contributionId]/apercu/page.tsx"]) {
    const source = await readFile(path, "utf8");
    assert.match(source, /status\s*===\s*403\s*\|\|\s*status\s*===\s*404/);
    assert.match(source, /throw error;/);
    assert.doesNotMatch(source, /catch\s*\{\s*notFound\(\)/);
  }
});
