import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { amarImacheArchives } from "@/data/amar-imache-archives";

export const metadata: Metadata = { title: "Archives d’Amar Imache", description: "Presse, écrits et documents originaux relatifs au parcours d’Amar Imache.", alternates: { canonical: "/amar-imache/archives" } };

export default function AmarImacheArchivesPage() {
  return <><a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient/><main id="contenu-principal" className="imache-archive-page" tabIndex={-1}>
    <header className="imache-archive-hero"><p className="eyebrow light">Fonds documentaire</p><h1>Archives<br/><em>d’Amar Imache</em></h1><p>Lire les documents originaux, retrouver leur contexte et suivre la constitution progressive d’un fonds ouvert à la recherche.</p><span aria-hidden="true">A · I</span></header>
    <section className="imache-archive-index"><header><div><p className="eyebrow">Catalogue</p><h2>Les pièces conservées</h2></div><div><strong>{String(amarImacheArchives.length).padStart(2,"0")}</strong><span>{amarImacheArchives.length > 1 ? "documents catalogués" : "document catalogué"}</span></div></header><div className="imache-archive-filters" aria-label="Classement actuel"><span>Toutes les archives</span><span>Presse</span><span>1937</span></div><div className="imache-archive-grid">{amarImacheArchives.map((archive,index)=><article key={archive.slug}><Link className="imache-archive-card-image" href={`/amar-imache/archives/${archive.slug}`}><Image src={archive.image} alt={`Page originale de ${archive.publication} contenant « ${archive.title} »`} fill sizes="(max-width: 700px) 100vw, 420px"/><span>Consulter la pièce</span></Link><div><small>{String(index+1).padStart(2,"0")} · {archive.type}</small><time dateTime={archive.date}>{archive.displayDate}</time><h3><Link href={`/amar-imache/archives/${archive.slug}`}>« {archive.title} »</Link></h3><p>{archive.publication} · {archive.page}</p><ul>{archive.themes.map(theme=><li key={theme}>{theme}</li>)}</ul><div className="imache-archive-card-actions"><Link href={`/amar-imache/archives/${archive.slug}`}>Voir le document</Link><Link className="primary" href={`/amar-imache/archives/${archive.slug}#transcription`}>Lire la transcription <span aria-hidden="true">→</span></Link></div></div></article>)}</div></section>
    <section className="imache-archive-method"><p className="eyebrow light">Méthode documentaire</p><h2>Conserver la pièce.<br/>Éclairer son contexte.</h2><p>Chaque notice distingue le document original de son commentaire, indique ses références et conserve un accès au fichier complet.</p><Link href="/contribuer">Proposer une archive <span aria-hidden="true">↗</span></Link></section>
  </main><SiteFooter/></>;
}
