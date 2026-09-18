import { notFound } from "next/navigation";
import Link from "next/link";
import ArchiveViewer from "@/components/archives/ArchiveViewer";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { amarImacheArchives } from "@/data/amar-imache-archives";

export function generateStaticParams(){ return amarImacheArchives.map(({slug})=>({slug})); }

export default async function ArchiveDetailPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const archive=amarImacheArchives.find(item=>item.slug===slug); if(!archive) notFound();
  return <><SiteHeaderClient/><main className="imache-archive-detail">
    <header><Link href="/amar-imache/archives">← Retour au catalogue</Link><p className="eyebrow light">Archive de presse · {archive.year}</p><h1>« {archive.title} »</h1><p>{archive.summary}</p></header>
    <section className="imache-archive-document">
      <ArchiveViewer
        src={archive.image}
        alt={`Document ${archive.page ? archive.page.replace("Page ", "") : ""} de ${archive.publication}, ${archive.displayDate}`}
        caption={`Document original · ${archive.publication} ${archive.page ? `· ${archive.page}` : ""}`}
        title={archive.title}
        transcription={archive.transcription}
      />
      <aside>
        <p className="eyebrow">Notice</p>
        <dl>
          <div><dt>Date</dt><dd>{archive.displayDate}</dd></div>
          <div><dt>Source / Fonds</dt><dd>{archive.publication}</dd></div>
          <div><dt>Référence</dt><dd>{archive.issue}</dd></div>
          {archive.page && <div><dt>Emplacement</dt><dd>{archive.page}</dd></div>}
          <div><dt>Signature / Diffusion</dt><dd>{archive.signature}</dd></div>
        </dl>
        <h2>Contexte</h2>
        <p>{archive.context}</p>
        {archive.pdf && (
          <a href={archive.pdf} target="_blank" rel="noreferrer">
            Ouvrir le document PDF original <span aria-hidden="true">↗</span>
          </a>
        )}
        {archive.sivUrl && (
          <a href={archive.sivUrl} target="_blank" rel="noreferrer" className="block mt-2 font-bold text-[#efd094]">
            🏛️ Consulter la notice sur les Archives Nationales (SIV) <span aria-hidden="true">↗</span>
          </a>
        )}
      </aside>
    </section>

  </main><SiteFooter/></>;
}
