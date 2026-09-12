import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {crafts} from "@/data/crafts";
import {CraftDrawing} from "@/components/home/CraftSection";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import PotteryPhotoCollection from "@/components/archives/PotteryPhotoCollection";
import "../artisanat.css";

export function generateStaticParams(){return crafts.map(craft=>({metier:craft.slug}));}
export async function generateMetadata({params}:{params:Promise<{metier:string}>}):Promise<Metadata>{const {metier}=await params;const craft=crafts.find(item=>item.slug===metier);return craft?{title:`${craft.name} — Artisanat d’Aït Mesbah`,description:craft.summary,alternates:{canonical:`/artisanat/${craft.slug}`}}:{};}
export default async function MetierPage({params}:{params:Promise<{metier:string}>}){
  const {metier}=await params;const craft=crafts.find(item=>item.slug===metier);if(!craft)notFound();
  return <><SiteHeaderClient/><main className="craft-page" id="contenu-principal"><header className="craft-hero craft-detail-hero"><Link className="craft-back" href="/artisanat">← Artisanat & savoir-faire</Link><p className="craft-label">{craft.number} · {craft.material}</p><h1>{craft.name}</h1><p className="craft-subtitle">{craft.subtitle}</p><p>{craft.summary}</p><div className="craft-detail-drawing"><CraftDrawing kind={craft.slug}/></div></header>
  <nav className="craft-chapters" aria-label="Dans cette page">{craft.sections.map(([title],index)=><a href={`#chapitre-${index+1}`} key={title}><span>0{index+1}</span>{title}<span aria-hidden="true">↓</span></a>)}{metier === "poterie" && <a href="#photographies-1939"><span>04</span>Les photographies de 1939<span aria-hidden="true">↓</span></a>}</nav>
  {metier === "poterie" && <PotteryPhotoCollection />}
  <article className="craft-story">{craft.sections.map(([title,text],index)=><section id={`chapitre-${index+1}`} key={title}><div><p className="craft-label">0{index+1} · {craft.material}</p><h2>{title}</h2></div><p>{text}</p></section>)}<aside>Cette première présentation s’appuie sur les informations transmises pour le site. Les parcours, les techniques locales et les objets seront documentés avec les personnes concernées.</aside></article>
  {metier === "poterie" && <section className="craft-sources"><p className="craft-label">Repères documentaires</p><h2>Un décor à regarder, une origine à préciser.</h2><p>Une étude de la poterie modelée situe les Aït Douala dans une aire où se rencontrent fonds blancs, bandes brun-rouge et lignes brunes. Elle mentionne Aït Mesbah à propos des appellations de motifs, tout en soulignant les transitions entre styles régionaux. Ces rapprochements ne suffisent pas, à eux seuls, à attribuer une pièce au village.</p><p>Les bordures de ce site en proposent une interprétation graphique contemporaine. Elles ne reproduisent pas un objet identifié et ne revendiquent aucune signification symbolique traditionnelle.</p><ul><li><a href="https://alger-roi.fr/Alger/arts/pdf/12_poterie_kabyle_algerianiste101.pdf" target="_blank" rel="noreferrer">La poterie modelée d’Afrique du Nord — étude des styles de Kabylie (PDF)</a></li><li><a href="https://m.quaibranly.fr/fr/professionnels/expositions-itinerantes/ideqqi" target="_blank" rel="noreferrer">Ideqqi — exposition du musée du quai Branly–Jacques Chirac</a> : un éclairage plus large sur la poterie berbère en Algérie.</li></ul></section>}
  <section className="craft-invitation"><p className="craft-label">Transmettre à son tour</p><h2>Votre souvenir peut ouvrir un récit.</h2><p>Une photo, le nom d’une personne, une histoire d’atelier : partagez ce que vous connaissez. Les contributions seront relues avant publication.</p><Link className="craft-link" href="/contribuer">Proposer une contribution <span aria-hidden="true">↗</span></Link></section>
  <nav className="craft-related" aria-label="Autres savoir-faire">{crafts.filter(item=>item.slug!==metier).map(item=><Link href={`/artisanat/${item.slug}`} key={item.slug}>{item.name} <span aria-hidden="true">→</span></Link>)}</nav></main><SiteFooter/></>;
}
