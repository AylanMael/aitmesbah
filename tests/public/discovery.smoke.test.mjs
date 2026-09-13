import test, { before } from "node:test";
import assert from "node:assert/strict";

// Run against a local development or production server; never mutates data.
const base = process.env.PUBLIC_TEST_URL || "http://localhost:3000";
let html;
before(async () => {
  const response = await fetch(new URL("/decouvrir", base), { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, "Le parcours doit répondre sans erreur");
  html = await response.text();
});

test("les cinq étapes et leur suite sont présentes dans le HTML rendu", () => {
  for (const id of ["lieux", "memoire", "gestes", "present", "participer"]) {
    assert.ok(html.includes(`id="${id}"`), `Section absente : ${id}`);
    assert.ok(html.includes(`href="#${id}"`), `Ancre absente : ${id}`);
    assert.ok(html.includes(`id="titre-${id}"`), `Titre absent : ${id}`);
  }
  assert.ok(html.includes('id="continuer"'));
  assert.ok(html.includes('href="#continuer"'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("les destinations du parcours sont disponibles", async () => {
  for (const path of ["/village", "/histoire-memoire", "/artisanat", "/vivre", "/contribuer", "/diaspora", "/agir"]) {
    assert.ok(html.includes(`href="${path}"`), `Lien absent : ${path}`);
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, `Destination indisponible : ${path}`);
    await response.body?.cancel();
  }
});

test("les cinq photographies sont accessibles et sont des images", async () => {
  for (const path of ["/ait-mesbah-village.jpg", "/images/amar-imache/portrait-ancien.jpg", "/archives/poterie-1939/14.jpg", "/images/jcam-jeunes-taqaats.jpg", "/images/asam-2026-finaliste.jpg"]) {
    assert.ok(html.includes(encodeURIComponent(path)), `Image non utilisée : ${path}`);
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Image absente : ${path}`);
    assert.match(response.headers.get("content-type") || "", /^image\//);
    await response.body?.cancel();
  }
});

test("le référencement et les commandes de partage sont rendus", () => {
  assert.match(html, /rel="canonical" href="https:\/\/ait-mesbah.org\/decouvrir"/);
  assert.match(html, /property="og:url" content="https:\/\/ait-mesbah.org\/decouvrir"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.ok(html.includes("Partager ce parcours"));
  assert.ok(html.includes("Copier le lien"));
  assert.ok(html.includes('role="status"'));
});

test("les images réservent leur format réel et se chargent à la demande", () => {
  const images = html.match(/<img\b[^>]*>/g) || [];
  for (const [path, width, height] of [
    ["/ait-mesbah-village.jpg", 720, 540],
    ["/images/amar-imache/portrait-ancien.jpg", 312, 472],
    ["/archives/poterie-1939/14.jpg", 910, 950],
    ["/images/jcam-jeunes-taqaats.jpg", 958, 540],
    ["/images/asam-2026-finaliste.jpg", 2048, 1536],
  ]) {
    const image = images.find(tag => tag.includes(encodeURIComponent(path)));
    assert.ok(image, `Image absente : ${path}`);
    assert.ok(image.includes(`width="${width}"`), `Largeur incorrecte : ${path}`);
    assert.ok(image.includes(`height="${height}"`), `Hauteur incorrecte : ${path}`);
    assert.ok(image.includes('loading="lazy"'), `Chargement différé absent : ${path}`);
  }
});
