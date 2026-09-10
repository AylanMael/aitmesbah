import type {Metadata} from "next";
import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {ContributionManager} from "@/components/crm/ContributionManager";
import {CrmPageHeader} from "@/components/crm/CrmPageHeader";
import StructuredText from "@/components/editorial/StructuredText";
import {getContributionPreviewRecord} from "@/lib/firebase/contribution-admin";
import {resolveCrmSession} from "@/lib/firebase/session";

export const metadata:Metadata={title:"Fiche de contribution",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
const categories:Record<string,string>={photographs_archives:"Photographies et archives",testimonies_stories:"Témoignages et récits",history_memory:"Histoire et mémoire",places_heritage:"Lieux et patrimoine",events_village_life:"Agenda et vie du village",craft_knowhow:"Artisanat et savoir-faire",diaspora:"Diaspora",documentary_correction:"Correction documentaire"};
const statuses:Record<string,string>={draft:"Brouillon",submitted:"Soumis",completeness_review:"Contrôle de complétude",rights_review:"Contrôle documentaire",editorial_review:"Relecture éditoriale",changes_requested:"Corrections demandées",approved:"Approuvé",rejected:"Refusé",withdrawn:"Retiré",published:"Publié",contested:"Contesté",unpublished:"Dépublié"};
const steps=["Réception","Complétude","Provenance et droits","Relecture","Publication"];
function currentStep(status:string){if(["draft","submitted","changes_requested"].includes(status))return 0;if(status==="completeness_review")return 1;if(status==="rights_review")return 2;if(["editorial_review","approved"].includes(status))return 3;if(["published","unpublished","contested"].includes(status))return 4;return 0;}
type GuideContribution={status:string;completenessStatus:string;sourceStatus:string;rightsStatus:string;consentStatus:string};
function guidance(c:GuideContribution){
 const missing:string[]=[];
 if(c.completenessStatus!=="complete")missing.push("Complétude à confirmer");
 if(!["verified","not_applicable"].includes(c.sourceStatus))missing.push("Provenance à documenter");
 if(!["cleared","not_applicable"].includes(c.rightsStatus))missing.push("Droits de diffusion à établir");
 if(!["granted","not_required"].includes(c.consentStatus))missing.push("Consentement à préciser");
 if(c.status==="published")return{tone:"complete",eyebrow:"Dossier publié",title:"Maintenir la publication à jour",text:"Le contenu est en ligne. Toute modification restera tracée dans son historique éditorial.",action:"Gérer la publication",missing:[]};
 if(c.status==="approved")return{tone:"ready",eyebrow:"Prêt à diffuser",title:"Préparer sa forme publique",text:"Choisissez sa présentation et son média principal, puis contrôlez l’aperçu avant publication.",action:"Préparer la publication",missing};
 if(c.status==="editorial_review")return{tone:"review",eyebrow:"Décision attendue",title:"Conclure la relecture éditoriale",text:"Relisez le fond et la forme, puis rendez un avis motivé ou demandez des corrections précises.",action:"Rendre un avis",missing};
 if(c.status==="rights_review")return{tone:"document",eyebrow:"Contrôle documentaire",title:"Sécuriser la provenance et les droits",text:"Vérifiez chaque point encore ouvert avant de transmettre le dossier à la rédaction.",action:"Effectuer le contrôle",missing};
 if(["submitted","completeness_review"].includes(c.status))return{tone:"intake",eyebrow:"Dossier reçu",title:"Vérifier qu’il peut être instruit",text:"Contrôlez les éléments fournis, affectez un relecteur si nécessaire et signalez clairement ce qui manque.",action:"Examiner le dossier",missing};
 return{tone:"draft",eyebrow:"Préparation",title:"Consolider puis soumettre le dossier",text:"Complétez le texte et sa fiche documentaire. La soumission ouvrira le parcours de validation.",action:"Poursuivre la préparation",missing};
}

export default async function ContributionRecordPage({params}:{params:Promise<{contributionId:string}>}){
 const session=await resolveCrmSession();if(session.state!=="authorized")redirect("/connexion");
 let preview;try{preview=await getContributionPreviewRecord(session.uid,(await params).contributionId);}catch{notFound();}
 const {contribution,body,assets}=preview,step=currentStep(contribution.status),meta=contribution.editorialMetadata,guide=guidance(contribution);
 return <main className="crm-shell crm-record-page">
  <CrmPageHeader index={String(contribution.currentVersion).padStart(2,"0")} kicker={categories[contribution.category]??"Contribution"} title={contribution.title} description={contribution.summary} count={assets.length} countLabel="médias validés"/>
  <nav className="crm-record-toolbar"><Link href="/crm/contributions">← Retour à la file</Link><Link href={`/crm/contributions/${contribution.contributionId}/apercu`} target="_blank">Voir l’aperçu privé ↗</Link></nav>
  <section className="crm-record-progress" aria-label="Progression éditoriale"><header><span>État actuel</span><strong>{statuses[contribution.status]??"Étape éditoriale"}</strong></header><ol>{steps.map((label,index)=><li className={index<step?"is-done":index===step?"is-current":""} key={label}><span>{index<step?"✓":String(index+1).padStart(2,"0")}</span><strong>{label}</strong></li>)}</ol></section>
  <section className={`crm-next-guidance is-${guide.tone}`}><div><span>{guide.eyebrow}</span><h2>{guide.title}</h2><p>{guide.text}</p></div>{guide.missing.length>0&&<ul>{guide.missing.map(item=><li key={item}>{item}</li>)}</ul>}<a href="#atelier-editorial">{guide.action} ↓</a></section>
  <div className="crm-record-layout"><section className="crm-record-document"><header><div><p className="crm-kicker">Version de travail</p><h2>Le contenu du dossier</h2></div><span>Version {contribution.currentVersion}</span></header><article className="structured-text"><StructuredText value={String(body)}/></article></section><aside className="crm-record-facts"><p className="crm-kicker">Fiche documentaire</p><h2>Contexte et repères</h2><dl><div><dt>Date ou période</dt><dd>{meta.archiveDate||"À préciser"}</dd></div><div><dt>Auteur ou producteur</dt><dd>{meta.creator||"À préciser"}</dd></div><div><dt>Lieu</dt><dd>{meta.location||"À préciser"}</dd></div><div><dt>Provenance</dt><dd>{meta.provenance||"À préciser"}</dd></div><div><dt>Crédit et droits</dt><dd>{meta.rightsCredit||"À préciser"}</dd></div><div><dt>Mots-clés</dt><dd>{meta.tags.length?meta.tags.join(" · "):"À préciser"}</dd></div></dl><Link href="/crm/fichiers">Gérer les originaux →</Link></aside></div>
  <section className="crm-record-actions" id="atelier-editorial"><div className="crm-section-heading"><p className="crm-kicker">Atelier éditorial</p><h2>Décider de la prochaine étape</h2></div><ContributionManager initial={[JSON.parse(JSON.stringify(contribution))]} nextCursor={null} permissions={session.permissions} uid={session.uid} mode="detail"/></section>
 </main>;
}
