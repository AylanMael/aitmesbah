import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getContributionPreviewRecord } from "@/lib/firebase/contribution-admin";
import { resolveCrmSession } from "@/lib/firebase/session";

export const metadata: Metadata = { title: "Aperçu éditorial privé", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditorialPreviewPage({ params, searchParams }: { params: Promise<{ contributionId: string }>; searchParams: Promise<{ media?: string }> }) {
  const session = await resolveCrmSession();
  if (session.state !== "authorized") redirect("/connexion");
  let preview;
  try { preview = await getContributionPreviewRecord(session.uid, (await params).contributionId); } catch { notFound(); }
  const { contribution, body, assets } = preview;
  const meta = contribution.editorialMetadata;
  const requestedMedia = (await searchParams).media;
  const featuredAsset = assets.find((asset) => asset.assetId === requestedMedia) ?? assets[0];
  return <main className="crm-editorial-preview">
    <nav><Link href="/crm/contributions">← Retour au CRM</Link><span>Aperçu privé · non publié</span></nav>
    <header><p>{contribution.category.replaceAll("_", " ")}</p><h1>{contribution.title}</h1><strong>{contribution.summary}</strong></header>
    {featuredAsset && <figure>{featuredAsset.detectedMimeType?.startsWith("image/") ? <img src={`/api/crm/contributions/${contribution.contributionId}/assets/${featuredAsset.assetId}/download`} alt="" /> : <a href={`/api/crm/contributions/${contribution.contributionId}/assets/${featuredAsset.assetId}/download`}>Ouvrir le document associé ↗</a>}<figcaption>{featuredAsset.safeFileName}</figcaption></figure>}
    <section><article>{String(body).split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</article><aside><p>Fiche documentaire</p><dl><div><dt>Date</dt><dd>{meta.archiveDate || "À préciser"}</dd></div><div><dt>Auteur / producteur</dt><dd>{meta.creator || "À préciser"}</dd></div><div><dt>Lieu</dt><dd>{meta.location || "À préciser"}</dd></div><div><dt>Provenance</dt><dd>{meta.provenance || "À préciser"}</dd></div><div><dt>Crédit et droits</dt><dd>{meta.rightsCredit || "À préciser"}</dd></div><div><dt>Mots-clés</dt><dd>{meta.tags.length ? meta.tags.join(" · ") : "À préciser"}</dd></div></dl></aside></section>
  </main>;
}
