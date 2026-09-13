import type { Metadata } from "next";
import Link from "next/link";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Retour des champs à Tharkavthe — Aït Mesbah, 1966",
  description: "Femmes, jarres, paniers et troupeau sur un chemin vers Aït Mesbah. Une photographie située à Tharkavthe en janvier 1966 selon le témoignage transmis.",
  alternates: { canonical: "/histoire-memoire/archives/retour-des-champs-1966" },
};

export default function RetourDesChampsPage() {
  return <><SiteHeaderClient /><main className="village-archive-page" id="contenu-principal">
    <header className="village-archive-hero"><div><Link href="/histoire-memoire#archives">← Retour aux archives</Link><p className="eyebrow light">Vie quotidienne · Photographie transmise</p><h1>Retour des champs,<br /><em>à Tharkavthe</em></h1></div><p>Des femmes, des jarres et un troupeau sur un chemin menant vers Aït Mesbah. Une scène située en janvier 1966 par le témoignage accompagnant la photographie.</p></header>
    <ImageArchiveViewer src="/archives/vie-village/retour-des-champs-1966.jpg" alt="Femmes portant des jarres et de grands paniers sur le dos, accompagnées de moutons sur un sentier" title="La photographie · cadrage reçu conservé" aspectRatio="720 / 951" />
    <section className="village-archive-reading"><div><p className="eyebrow">Lire la scène</p><h2>Les objets au rythme des jours</h2></div><div><p className="village-archive-lead">Sur le sentier, les silhouettes des femmes côtoient celles des moutons. Des jarres et de grands paniers sont portés sur le dos.</p><p>Les vêtements à rayures, le chemin et les arbres inscrivent cette scène dans un paysage rural. L’image permet de regarder les objets en usage, au-delà de leur fabrication ou de leur présentation dans une collection.</p><p>Selon les précisions du contributeur, les femmes portent la robe traditionnelle avec des foutas à rayures, transportent de l’eau dans les jarres et de grands paniers appelés « akechoual ». Le groupe revient des champs et accompagne un petit troupeau.</p></div></section>
    <section className="village-archive-metadata"><p className="eyebrow">Repères transmis · source originale à retrouver</p><dl><div><dt>Date indiquée</dt><dd>Janvier 1966</dd></div><div><dt>Lieu indiqué</dt><dd>Tharkavthe, chemin vers Aït Mesbah</dd></div><div><dt>Nature</dt><dd>Photographie en noir et blanc</dd></div><div><dt>Photographe</dt><dd>Non identifié</dd></div><div><dt>Provenance de l’envoi</dt><dd>Image trouvée sur Internet, sans lien original fourni</dd></div><div><dt>Droits de reproduction</dt><dd>À identifier</dd></div></dl></section>
    <section className="village-archive-reading"><div><p className="eyebrow">Mémoire & vérification</p><h2>Ce que le témoignage précise</h2></div><div><p>La date, le lieu exact et l’identification comme un retour des champs proviennent du contributeur. La mention de l’eau et le nom « akechoual » ne peuvent pas être établis par la seule photographie.</p><p>La source originale reste nécessaire pour confirmer ces repères et retrouver le crédit photographique. Aucun lien n’est établi avec le reportage de 1939 ni avec les objets du Peabody Museum.</p><p><Link href="/contribuer?category=photographs_archives&title=Source%20de%20la%20photographie%20Tharkavthe%201966">Aider à identifier cette photographie →</Link></p><p><Link href="/artisanat/poterie#retour-des-champs-1966">Retrouver cette scène dans la page Poterie →</Link></p></div></section>
  </main><SiteFooter /></>;
}
