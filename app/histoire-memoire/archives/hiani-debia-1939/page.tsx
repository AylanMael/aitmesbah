import type { Metadata } from "next";
import Link from "next/link";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Hiani Debia, potière à Aït Mesbah — Archive de 1939",
  description: "Photographie de Thérèse Rivière et verso annoté : Hiani Debia décorant une poterie à Aït Mesbah en 1939, notice PP0193025 du musée du quai Branly – Jacques Chirac.",
  alternates: { canonical: "/histoire-memoire/archives/hiani-debia-1939" },
};

export default function HianiDebiaArchivePage() {
  return <><SiteHeaderClient /><main className="village-archive-page" id="contenu-principal">
    <header className="village-archive-hero"><div><Link href="/histoire-memoire#archives">← Retour aux archives</Link><p className="eyebrow light">Photographie d’archives · Pièce 002 · 1939</p><h1>Hiani Debia,<br /><em>le geste du décor</em></h1></div><p>Une photographie de Thérèse Rivière, conservée au musée du quai Branly – Jacques Chirac, documente le travail d’une potière d’Aït Mesbah.</p></header>
    <ImageArchiveViewer src="/archives/poterie-1939/14.jpg" alt="Hiani Debia décorant un récipient à anse, Aït Mesbah, 1939, photographie de Thérèse Rivière" title="La photographie · Décor" aspectRatio="920 / 960" />
    <section className="village-archive-reading"><div><p className="eyebrow">Lire la photographie</p><h2>Une artisane, des mains, un objet</h2></div><div><p className="village-archive-lead">Le récipient repose sur les genoux de la potière. Ses mains travaillent près de l’anse, au milieu d’un décor de lignes, de points et de triangles.</p><p>Ce cadrage rapproché permet d’observer le geste de décoration. Il ne documente ni la préparation de l’argile ni le façonnage de cette pièce : ces étapes ne doivent pas être déduites de la seule photographie.</p><p>La notice PP0193025, intitulée « Décor », nomme Hiani Debia et situe la scène à Aït Mesbah en 1939. Elle attribue le cliché à Thérèse Rivière.</p><Link href="/artisanat/poterie#photographies-1939">Parcourir le documentaire sur la poterie →</Link></div></section>
    <section className="village-archive-metadata"><p className="eyebrow">Référence documentaire</p><dl>
      <div><dt>Personne nommée dans la notice</dt><dd>Hiani Debia</dd></div><div><dt>Photographe</dt><dd>Thérèse Rivière</dd></div><div><dt>Date de prise de vue</dt><dd>1939</dd></div><div><dt>Localisation</dt><dd>Aït Mesbah, Grande Kabylie</dd></div><div><dt>Titre historique</dt><dd>Décor</dd></div><div><dt>Numéro de gestion</dt><dd>PP0193025</dd></div><div><dt>Collection</dt><dd>Musée du quai Branly – Jacques Chirac</dd></div><div><dt>Précédente collection</dt><dd>Musée de l’Homme, Photothèque</dd></div><div><dt>Support catalogué</dt><dd>Tirage argentique sur papier, 9 × 14 cm</dd></div>
    </dl></section>
    <section className="village-archive-reading" id="source"><div><p className="eyebrow">La trace au verso</p><h2>Le document qui étaye l’identification</h2></div><div><p className="village-archive-lead">La capture transmise reproduit les annotations au dos du tirage. On y lit notamment le nom du village, celui de la potière et le tampon du photographe.</p><p>Elle porte les mentions « Décor », « objet 40.8.86 » et le numéro de film « 39-202 ». Ces repères complètent la notice ; ils ne doivent pas être confondus avec son numéro de gestion PP0193025.</p><p>Le champ « numéro de négatif » de la notice indique 1939-214, tandis que le verso porte 39-202. Nous conservons cette différence sans la corriger par supposition. La date de 1939 est renseignée par la notice du musée.</p><p><a href="/archives/poterie-1939/verso-decor-hiani-debia.pdf" target="_blank" rel="noreferrer">Consulter le PDF transmis (1 page) ↗</a></p><p><a href="https://collections.quaibranly.fr/" target="_blank" rel="noreferrer">Consulter le catalogue du musée ↗</a> — rechercher « PP0193025 » ou « Hiani ».</p><aside><strong>Source et reproduction</strong><p>La capture conserve le crédit du musée et l’inscription relative à l’autorisation de reproduction. L’identification d’une source ne constitue pas une autorisation de réutilisation ; les conditions actuelles restent à vérifier auprès du musée.</p></aside></div></section>
    <ImageArchiveViewer src="/archives/poterie-1939/verso-decor-hiani-debia.png" alt="Capture du verso annoté : tampon Thérèse Rivière, Aït Mesbah, Décor, objet 40.8.86, Hiani Debia et film 39-202" title="Pièce justificative · verso annoté du tirage" aspectRatio="1600 / 1154" />
  </main><SiteFooter /></>;
}
