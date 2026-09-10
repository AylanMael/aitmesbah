import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { loadPublicContent } from "@/lib/public-contents-server";

export const dynamic = "force-dynamic";
const labels = { article: "Récit", news: "Nouvelle", archive: "Archive", photo: "Photographie" } as const;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = await loadPublicContent((await params).slug); return item ? { title: `${item.title} — Aït Mesbah`, description: item.summary, alternates: { canonical: `/publications/${item.slug}` } } : {}; }

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await loadPublicContent((await params).slug);
  if (!item) notFound();
  return <><SiteHeaderClient /><main className="publication-page"><header><Link href="/publications">← Toutes les publications</Link><p className="eyebrow light">{labels[item.kind]} · Aït Mesbah</p><h1>{item.title}</h1><p>{item.summary}</p></header>{item.primaryAssetId && <figure>{item.primaryAssetMimeType?.startsWith("image/") ? <img src={`/api/public/contents/${item.slug}/media`} alt={item.title} /> : <a className="publication-document-link" href={`/api/public/contents/${item.slug}/media`} target="_blank" rel="noreferrer">Ouvrir le document original <span aria-hidden="true">↗</span></a>}<figcaption>Document ou photographie associé à cette publication.</figcaption></figure>}<article>{item.body.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</article><footer><span>Publié le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(item.publishedAt))}</span><Link href="/contribuer">Contribuer à la mémoire du village ↗</Link></footer></main><SiteFooter /></>;
}
