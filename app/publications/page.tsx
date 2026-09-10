import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { loadPublicContents } from "@/lib/public-contents-server";

export const metadata: Metadata = { title: "Publications du village — Aït Mesbah", description: "Nouvelles, récits, photographies et archives publiés par la rédaction d’Aït Mesbah.", alternates: { canonical: "/publications" } };
export const dynamic = "force-dynamic";
const labels = { article: "Récit", news: "Nouvelle", archive: "Archive", photo: "Photographie" } as const;

export default async function PublicationsPage() {
  const contents = await loadPublicContents();
  return <><SiteHeaderClient /><main className="publications-page">
    <header className="publications-hero"><p className="eyebrow light">Le village publie</p><h1>À lire, à voir,<br/><em>à transmettre</em></h1><p>Une collection vivante, préparée avec soin à partir des contributions, des archives et des nouvelles d’Aït Mesbah.</p></header>
    <section className="publications-index" aria-labelledby="publications-title"><div><p className="eyebrow">Collection éditoriale</p><h2 id="publications-title">Les dernières publications</h2></div>{contents.length ? <div className="publications-grid">{contents.map((item, index) => <article key={item.publicationId}><Link className="publications-card-media" href={`/publications/${item.slug}`}>{item.primaryAssetId && item.primaryAssetMimeType?.startsWith("image/") ? <img src={`/api/public/contents/${item.slug}/media`} alt="" /> : <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}</Link><p><span>{labels[item.kind]}</span><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(item.publishedAt))}</time></p><h3><Link href={`/publications/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p><Link className="publications-read" href={`/publications/${item.slug}`}>Découvrir <span aria-hidden="true">→</span></Link></article>)}</div> : <div className="publications-empty"><span>Collection ouverte</span><h3>Les premières publications se préparent.</h3><p>Les contenus approuvés dans la maison des archives apparaîtront ici, sans perdre leur provenance ni leur historique éditorial.</p></div>}</section>
  </main><SiteFooter /></>;
}
