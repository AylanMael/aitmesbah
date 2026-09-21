import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { contributionListQuery, contributionPageHref } from "../../lib/crm/contribution-navigation.mjs";

test("les filtres d’affichage ne deviennent pas des filtres serveur", () => {
  assert.deepEqual(contributionListQuery({cursor:"abc",limit:"25",status:"published",category:"diaspora",titlePrefix:"test",authorUid:"other"}), {cursor:"abc",limit:"25"});
});
test("la pagination conserve et encode uniquement les filtres d’affichage", () => {
  const url = new URL(contributionPageHref("a/b", {status:"published", category:"diaspora", titlePrefix:"Aït & mémoire", authorUid:"other"}), "https://example.test");
  assert.equal(url.pathname, "/crm/contributions");
  assert.equal(url.searchParams.get("cursor"), "a/b");
  assert.equal(url.searchParams.get("titlePrefix"), "Aït & mémoire");
  assert.equal(url.searchParams.get("status"), "published");
  assert.equal(url.searchParams.get("category"), "diaspora");
  assert.equal(url.searchParams.has("authorUid"), false);
});
test("le tableau de bord ne masque pas les échecs et ouvre les fiches par identifiant", async () => {
  const page = await readFile("app/crm/page.tsx", "utf8");
  assert.doesNotMatch(page, /\.catch\(/);
  assert.doesNotMatch(page, /titlePrefix=/);
  assert.match(page, /encodeURIComponent\(item.contributionId\)/);
  const fallback = await readFile("app/crm/error.tsx", "utf8");
  assert.match(fallback, /role="alert"/);
  assert.match(fallback, /onClick=\{reset\}/);
});
