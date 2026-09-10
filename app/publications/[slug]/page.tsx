import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { loadPublicContent } from "@/lib/public-contents-server";
import StructuredText from "@/components/editorial/StructuredText";

export const dynamic = "force-dynamic";
const labels = { article: "Récit", news: "Nouvelle", archive: "Archive", photo: "Photographie" } as const;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = await loadPublicContent((await params).slug); return item ? { title: `${item.title} — Aït Mesbah`, description: item.summary, alternates: { canonical: `/publications/${item.slug}` } } : {}; }

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await loadPublicContent((await params).slug); if (!item) notFound();
  const meta = item.editorialMetadata, hasMetadata = Boolean(meta.archiveDate || meta.creator || meta.location || meta.provenance || meta.rightsCredit || meta.tags.length);
  return <><SiteHeaderClient /><main className="publication-page"><header><Link href="/publications">← Toutes les publications</Link><p className="eyebrow light">{labels[item.kind]} · Aït Mesbah</p><h1>{item.title}</h1><p>{item.summary}</p></header>
    {item.primaryAssetId && <figure>{item.primaryAssetMimeType?.startsWith("image/") ? <img src={`/api/public/contents/${item.slug}/media`} alt={item.title} /> : <a className="publication-document-link" href={`/api/public/contents/${item.slug}/media`} target="_blank" rel="noreferrer">Ouvrir le document original <span aria-hidden="true">↗</span></a>}<figcaption>{meta.rightsCredit || "Document ou photographie associé à cette publication."}</figcaption></figure>}
    <div className="publication-reading"><article><StructuredText value={item.body} /></article>{hasMetadata && <aside><p className="eyebrow">Notice documentaire</p><dl>{meta.archiveDate && <div><dt>Date ou période</dt><dd>{meta.archiveDate}</dd></div>}{meta.creator && <div><dt>Auteur ou producteur</dt><dd>{meta.creator}</dd></div>}{meta.location && <div><dt>Lieu</dt><dd>{meta.location}</dd></div>}{meta.provenance && <div><dt>Provenance</dt><dd>{meta.provenance}</dd></div>}{meta.rightsCredit && <div><dt>Crédit et droits</dt><dd>{meta.rightsCredit}</dd></div>}</dl>{meta.tags.length > 0 && <div className="publication-tags">{meta.tags.map(tag => <Link href={`/publications?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div>}</aside>}</div>
    <footer><span>Publié le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(item.publishedAt))}</span><Link href="/contribuer">Contribuer à la mémoire du village ↗</Link></footer></main><SiteFooter /></>;
}
