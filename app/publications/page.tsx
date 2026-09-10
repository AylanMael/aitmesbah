import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { loadPublicContents } from "@/lib/public-contents-server";

export const metadata: Metadata = { title: "Publications du village — Aït Mesbah", description: "Nouvelles, récits, photographies et archives publiés par la rédaction d’Aït Mesbah.", alternates: { canonical: "/publications" } };
export const dynamic = "force-dynamic";
const labels = { article: "Récit", news: "Nouvelle", archive: "Archive", photo: "Photographie" } as const;

export default async function PublicationsPage({ searchParams }: { searchParams: Promise<{ type?: string; q?: string }> }) {
  const params = await searchParams, kinds = new Set(["article", "news", "archive", "photo"]), selectedKind = kinds.has(params.type ?? "") ? params.type : "all", query = (params.q ?? "").trim().toLocaleLowerCase("fr");
  const allContents = await loadPublicContents(), contents = allContents.filter(item => (selectedKind === "all" || item.kind === selectedKind) && (!query || `${item.title} ${item.summary} ${item.editorialMetadata.tags.join(" ")}`.toLocaleLowerCase("fr").includes(query)));
  return <><SiteHeaderClient /><main className="publications-page">
    <header className="publications-hero"><p className="eyebrow light">Le village publie</p><h1>À lire, à voir,<br/><em>à transmettre</em></h1><p>Une collection vivante, préparée avec soin à partir des contributions, des archives et des nouvelles d’Aït Mesbah.</p></header>
    <section className="publications-index" aria-labelledby="publications-title"><div><p className="eyebrow">Collection éditoriale</p><h2 id="publications-title">Les dernières publications</h2></div>
      <form className="publications-filters"><label>Rechercher<input name="q" defaultValue={params.q ?? ""} placeholder="Un lieu, une personne, un mot-clé…" /></label><label>Nature<select name="type" defaultValue={selectedKind}><option value="all">Toutes</option><option value="news">Nouvelles</option><option value="article">Récits</option><option value="archive">Archives</option><option value="photo">Photographies</option></select></label><button>Explorer la collection</button>{(query || selectedKind !== "all") && <Link href="/publications">Effacer les filtres</Link>}</form>
      {contents.length ? <div className="publications-grid">{contents.map((item, index) => <article key={item.publicationId}><Link className="publications-card-media" href={`/publications/${item.slug}`}>{item.primaryAssetId && item.primaryAssetMimeType?.startsWith("image/") ? <img src={`/api/public/contents/${item.slug}/media`} alt="" /> : <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}</Link><p><span>{labels[item.kind]}</span><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(item.publishedAt))}</time></p><h3><Link href={`/publications/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p><Link className="publications-read" href={`/publications/${item.slug}`}>Découvrir <span aria-hidden="true">→</span></Link></article>)}</div> : <div className="publications-empty"><span>{allContents.length ? "Aucun résultat" : "Collection ouverte"}</span><h3>{allContents.length ? "Essayez une recherche plus large." : "Les premières publications se préparent."}</h3><p>Les contenus approuvés dans la maison des archives apparaissent ici, sans perdre leur provenance ni leur historique éditorial.</p></div>}
    </section>
  </main><SiteFooter /></>;
}
