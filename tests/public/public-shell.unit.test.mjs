import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");
const [home, layout, brand, header, footer, hero, navigation, homeData, publicCss] = await Promise.all([
  read("app/page.tsx"),
  read("app/layout.tsx"),
  read("components/layout/Brand.tsx"),
  read("components/layout/SiteHeaderClient.tsx"),
  read("components/layout/SiteFooter.tsx"),
  read("components/home/HeroSection.tsx"),
  read("data/navigation.ts"),
  read("data/home.ts"),
  read("app/public.css"),
]);

test("la marque retourne à l’accueil et la page active est annoncée", () => {
  assert.match(brand, /<Link href="\/"/);
  assert.doesNotMatch(brand, /#accueil/);
  assert.match(header, /aria-current=/);
  assert.match(header, /usePathname/);
});

test("le shell conserve une sémantique publique accessible", () => {
  assert.equal((home.match(/<main\b/g) ?? []).length, 1);
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
  assert.match(home, /className="skip-link"/);
  assert.match(header, /aria-expanded=\{menu\}/);
  assert.match(header, /aria-controls="navigation-principale"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /event\.key !== "Tab"/);
  assert.match(header, /document\.body\.style\.overflow = "hidden"/);
});

test("les contrats tactiles et de mouvement réduit sont explicites", () => {
  assert.match(publicCss, /min-height:44px/);
  assert.match(publicCss, /width:48px;height:48px/);
  assert.match(publicCss, /prefers-reduced-motion:reduce/);
});

test("l’accueil ne publie ni faux contenu ni placeholder prioritaire", () => {
  for (const forbidden of ["NewsSection", "AgendaSection", "VoicesSection", "PlacesSection", "À remplacer", "Archive authentique à intégrer", "fausse actualité"])
    assert.equal(home.includes(forbidden), false);
  assert.equal(navigation.includes("/#agenda"), false);
  assert.equal(navigation.includes("/#vivre"), false);
  assert.equal(homeData.includes('href: "#vivre"'), false);
  assert.equal(homeData.includes('href: "#agenda"'), false);
});

test("la feuille publique ne redéfinit pas globalement les interfaces privées", () => {
  assert.doesNotMatch(publicCss, /(?:^|})\s*:focus-visible\s*\{/);
  assert.doesNotMatch(publicCss, /(?:^|})\s*\*\s*,/);
  assert.match(publicCss, /body:has\(\.site-header\) :focus-visible/);
});

test("la langue disponible est présentée honnêtement", () => {
  assert.match(footer, /FR — version actuelle/);
  assert.doesNotMatch(footer, /FR · KAB · ع/);
  assert.doesNotMatch(footer, /<button[^>]*>\s*(KAB|ع)/);
});

test("le domaine et le média réel restent inchangés", async () => {
  assert.match(layout, /https:\/\/ait-mesbah\.com/);
  assert.doesNotMatch(layout, /ait-mesbah\.org/);
  assert.match(hero, /src="\/images\/ait-mesbah-hero\.webp"/);
  assert.doesNotMatch(hero, /src="https?:\/\//);
  await access("public/images/ait-mesbah-hero.webp");
  await access("public/logo-ait-mesbah.webp");
});

test("les routes publiques exigées restent présentes", async () => {
  for (const path of ["village", "histoire", "histoire-memoire", "culture", "diaspora", "contribuer", "mentions-legales", "confidentialite", "credits"])
    await access(`app/${path}/page.tsx`);
});
