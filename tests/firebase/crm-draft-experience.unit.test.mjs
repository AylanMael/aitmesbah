import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("la création ouvre la fiche et n’est pas proposée à l’intérieur d’un dossier", async () => {
  const source = await readFile("components/crm/ContributionManager.tsx", "utf8");
  assert.match(source, /canDraft && mode === "list"/);
  assert.match(source, /router.push\(`\/crm\/contributions\/\$\{encodeURIComponent\(created.contributionId\)\}`\)/);
  const creation = source.slice(source.indexOf("async function create("), source.indexOf("async function act("));
  assert.doesNotMatch(creation, /form.reset/);
  assert.match(creation, /organizationId: null/);
  assert.match(creation, /if\(creationPendingRef.current\)return false/);
  assert.match(creation, /creationPendingRef.current=true/);
  assert.match(creation, /return true/);
});
test("le formulaire conserve le contrat et explique la confidentialité", async () => {
  const source = await readFile("components/crm/ContributionDraftForm.tsx", "utf8");
  for (const field of ["title", "summary", "category", "sensitivity"]) assert.ok(source.includes(`name="${field}"`));
  assert.match(source, /<EditorialBodyEditor required/);
  assert.match(source, /ne le publie pas/);
  assert.match(source, /fieldset disabled=\{busy \|\| retrying\}/);
  assert.match(source, /document.addEventListener\("click", guardLink, true\)/);
  assert.match(source, /document.removeEventListener\("click", guardLink, true\)/);
  assert.match(source, /onValueChange=\{value=>update\("body",value\)\}/);
});

test("la copie temporaire est isolée par compte dans le layout et jamais stockée sur disque",async()=>{
  const layout=await readFile("app/crm/layout.tsx","utf8");
  const workspace=await readFile("components/crm/DraftWorkspace.tsx","utf8");
  const form=await readFile("components/crm/ContributionDraftForm.tsx","utf8");
  assert.match(layout, /DraftWorkspace key=\{context.uid\}/);
  assert.match(workspace, /useState<DraftFields \| null>\(null\)/);
  assert.doesNotMatch(workspace+form,/localStorage|sessionStorage|indexedDB/);
  assert.match(workspace,/removeEventListener\("beforeunload",warn\)/);
  assert.match(workspace,/window.confirm/);
  for(const field of ["title","summary","category","sensitivity"])assert.ok(form.includes(`value={fields.${field}}`));
  assert.match(form,/defaultValue=\{fields.body\}/);
});

test("la création en cours et son verrou survivent à la navigation interne",async()=>{
  const workspace=await readFile("components/crm/DraftWorkspace.tsx","utf8");
  const manager=await readFile("components/crm/ContributionManager.tsx","utf8");
  assert.match(workspace,/creationPending = useRef\(false\)/);
  assert.match(manager,/busy=\{busy \|\| saving\}/);
  assert.match(manager,/clearDraft\(\)/);
});
