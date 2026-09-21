import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("déconnexion : erreur annoncée, jeton contrôlé et verrou immédiat", async () => {
  const source = await readFile("components/crm/LogoutButton.tsx", "utf8");
  assert.match(source, /if \(pending.current\) return/);
  assert.match(source, /if \(!csrf.ok\) throw/);
  assert.match(source, /typeof csrfToken !== "string"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /aria-busy=\{busy\}/);
  assert.match(source, /Déconnexion non confirmée/);
});

test("navigation : libellé de déconnexion visible et numéro seul décoratif", async () => {
  const css = await readFile("components/crm/crm-navigation.css", "utf8");
  assert.match(css, /\.crm-logout:after \{ content: none; \}/);
  assert.match(css, /min-height: 44px/);
  const header = await readFile("components/crm/CrmPageHeader.tsx", "utf8");
  assert.match(header, /<span aria-hidden="true">\{index\}/);
  assert.doesNotMatch(header, /className="crm-page-number" aria-hidden/);
});
