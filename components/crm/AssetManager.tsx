"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {fileSelectionError,uploadFailureMessage,assetLoadFailureMessage} from "@/lib/crm/upload-feedback.mjs";

type Contribution={contributionId:string;title:string};
type Asset={assetId:string;contributionId:string;safeFileName:string;declaredMimeType:string;detectedMimeType:string|null;size:number|null;sha256:string|null;status:string;scanStatus:string;sourceStatus:string;rightsStatus:string;consentStatus:string;deletionRequestedBy:string|null;deletionExecutionStatus:string|null;version:number};
const ANTIVIRUS_WARNING="Analyse antivirus indisponible — ce fichier n’est pas déclaré exempt de logiciel malveillant.";
const states:Record<string,string>={reserved:"Réservé",quarantined:"En quarantaine",validated:"Validé",rejected:"Rejeté",withdrawn:"Retiré",pending_deletion:"Suppression demandée",deleted:"Supprimé",unknown:"À établir",declared:"Déclarée",verified:"Vérifiée",pending:"En attente",cleared:"Autorisés",not_applicable:"Sans objet",not_required:"Non requis",granted:"Accordé",withdrawn_consent:"Retiré"};

async function csrf(){const response=await fetch("/api/auth/csrf",{cache:"no-store"});return(await response.json()).csrfToken;}
async function json(url:string,method="GET",body?:unknown){const headers:Record<string,string>={};if(body){headers["Content-Type"]="application/json";headers["X-CSRF-Token"]=await csrf();}const response=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined,cache:"no-store"}),value=await response.json();if(!response.ok)throw Object.assign(new Error(value.error??"Opération impossible."),{status:response.status});return value;}
const sizeLabel=(size:number|null)=>size==null?"Taille inconnue":size>1024*1024?`${(size/1024/1024).toFixed(1)} Mo`:`${Math.ceil(size/1024)} Ko`;

type AssetManagerProps={contributions:Contribution[];permissions:readonly string[];initialDeletionRequests?:Asset[];embeddedContribution?:Contribution};
export function AssetManager(props:AssetManagerProps){
  return <AssetManagerWorkspace key={props.embeddedContribution?.contributionId??"library"} {...props}/>;
}
function AssetManagerWorkspace({contributions,permissions,initialDeletionRequests=[],embeddedContribution}:AssetManagerProps){
  const[selected,setSelected]=useState<Contribution|null>(embeddedContribution??null),[assets,setAssets]=useState<Asset[]>([]),[deletionRequests,setDeletionRequests]=useState<Asset[]>(initialDeletionRequests),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false),[query,setQuery]=useState("");
  const [loadError,setLoadError]=useState(false);
  const [initialLoading,setInitialLoading]=useState(Boolean(embeddedContribution));
  const embeddedId=embeddedContribution?.contributionId;
  useEffect(()=>{
    if(!embeddedId)return;
    let active=true;
    json(`/api/crm/contributions/${encodeURIComponent(embeddedId)}/assets`)
      .then(value=>{if(active)setAssets(value.assets);})
      .catch(error=>{if(active){setLoadError(true);setNotice(assetLoadFailureMessage(error?.status));}})
      .finally(()=>{if(active)setInitialLoading(false);});
    return()=>{active=false;};
  },[embeddedId]);
  const canDelete=permissions.includes("asset.deletion.manage"),filtered=useMemo(()=>contributions.filter(item=>item.title.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))),[contributions,query]);
  async function open(contribution:Contribution){setSelected(contribution);setAssets([]);setLoadError(false);setBusy(true);try{setAssets((await json(`/api/crm/contributions/${contribution.contributionId}/assets`)).assets);setNotice("");}catch(error){setLoadError(true);setNotice(assetLoadFailureMessage((error as {status?:number})?.status));}finally{setBusy(false);}}
  async function refreshDeletionRequests(){if(!canDelete)return;try{setDeletionRequests((await json("/api/crm/assets/deletion-requests?limit=25")).requests);}catch(error){setNotice(error instanceof Error?error.message:"Erreur");}}
  async function upload(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(!selected||busy)return;
    const form=event.currentTarget,file=new FormData(form).get("file");
    if(!(file instanceof File))return;
    const issue=fileSelectionError(file);if(issue){setNotice(issue);return;}
    setBusy(true);setNotice("Vérification du fichier avant envoi…");
    try{
      // L’empreinte locale évite un transfert inutile ; le serveur revérifie toujours.
      if(globalThis.crypto?.subtle){
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",await file.arrayBuffer()))).map(byte=>byte.toString(16).padStart(2,"0")).join("");
        if(assets.some(asset=>asset.sha256===hash)){setNotice("Cet original est déjà présent dans ce dossier. Aucun nouvel envoi n’a été effectué.");return;}
      }
      const body=new FormData();body.set("file",file);
      setNotice("Envoi en cours, puis contrôle du fichier par le serveur. Gardez cette page ouverte.");
      const response=await fetch(`/api/crm/contributions/${selected.contributionId}/assets`,{method:"POST",headers:{"X-CSRF-Token":await csrf()},body});
      if(!response.ok)throw new Error(uploadFailureMessage(response.status));
      const value=await response.json();
      setAssets(current=>[value,...current]);form.reset();
      setNotice("Fichier reçu dans le dossier privé. "+ANTIVIRUS_WARNING);
    }catch(error){setNotice(error instanceof TypeError?uploadFailureMessage(0):error instanceof Error?error.message:uploadFailureMessage(0));}
    finally{setBusy(false);}
  }
  async function mutate(asset:Asset,event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);setBusy(true);try{const value=await json(`/api/crm/contributions/${asset.contributionId}/assets/${asset.assetId}`,"PATCH",{operation:data.get("operation"),field:data.get("field"),value:data.get("value"),reason:data.get("reason"),expectedVersion:asset.version});setAssets(current=>current.map(item=>item.assetId===value.assetId?value:item));setDeletionRequests(current=>current.filter(item=>item.assetId!==value.assetId));setNotice("Décision privée enregistrée et auditée.");await refreshDeletionRequests();}catch(error){setNotice(error instanceof Error?error.message:"Erreur");}finally{setBusy(false);}}
  return <div className="crm-assets-manager">
    <p className="crm-notice">{ANTIVIRUS_WARNING} Une validation humaine porte sur le contenu et les droits, pas sur la sécurité antivirus.</p>
    {initialLoading?<p role="status">Chargement des fichiers du dossier…</p>:null}
    <fieldset hidden={initialLoading} disabled={initialLoading} style={{border:0,padding:0,margin:0,minWidth:0}} aria-busy={initialLoading}>
    {notice&&<p role="status" className="crm-notice">{notice}</p>}
    {canDelete&&deletionRequests.length>0&&<details className="crm-deletion-queue"><summary><span>Suppressions à examiner</span><strong>{deletionRequests.length}</strong></summary><ul>{deletionRequests.map(asset=><li key={`${asset.contributionId}-${asset.assetId}`}><div><strong>{asset.safeFileName}</strong><small>Contribution {asset.contributionId}</small></div><form onSubmit={event=>mutate(asset,event)}><input type="hidden" name="operation" value="delete"/><textarea name="reason" required maxLength={500} placeholder="Motif de suppression définitive"/><button disabled={busy}>Supprimer les octets</button></form></li>)}</ul></details>}
    <section className="crm-media-library" style={embeddedContribution?{gridTemplateColumns:"minmax(0, 1fr)"}:undefined}>{!embeddedContribution&&<aside><p className="crm-kicker">Fonds accessibles</p><h2>Choisir un dossier</h2><label>Rechercher<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Titre de la contribution"/></label><nav>{filtered.map(contribution=><button className={selected?.contributionId===contribution.contributionId?"is-active":""} type="button" key={contribution.contributionId} disabled={busy} onClick={()=>open(contribution)}><span>{contribution.title.slice(0,1)}</span><strong>{contribution.title}</strong><i>→</i></button>)}</nav>{filtered.length===0&&<p>Aucun dossier ne correspond à cette recherche.</p>}</aside>}
      <div className="crm-media-workspace">{!selected?<div className="crm-media-welcome"><span>▧</span><h2>La maison des originaux</h2><p>Choisissez une contribution pour consulter ses fichiers, documenter leurs droits et préparer leur publication.</p></div>:<><header><div><p className="crm-kicker">Dossier sélectionné</p><h2>{selected.title}</h2><button type="button" disabled={busy} onClick={()=>open(selected)}>Actualiser les fichiers</button></div><span>{loadError?"Accès aux fichiers indisponible":busy?"Chargement…":`${assets.length} ${assets.length>1?"fichiers":"fichier"}`}</span></header>
        {permissions.includes("asset.self.manage")&&!loadError&&<form className="crm-upload-zone" onSubmit={upload}><label><span>＋</span><strong>Ajouter un original</strong><small>JPEG, PNG, WebP ou PDF · 25 Mo maximum</small><input name="file" type="file" disabled={busy} required accept=".jpg,.jpeg,.png,.webp,.pdf"/></label><button disabled={busy}>{busy?"Envoi ou traitement en cours…":"Ajouter au dossier privé"}</button></form>}
        {loadError?<div role="alert" className="crm-notice"><p>Fichiers indisponibles : la liste ne peut pas être considérée comme vide.</p><button type="button" disabled={busy} onClick={()=>open(selected)}>Réessayer</button></div>:busy&&assets.length===0?<p className="crm-media-loading">Chargement du fonds…</p>:assets.length===0?<div className="crm-media-empty"><span>◇</span><strong>Aucun original versé</strong><p>Le premier fichier apparaîtra ici après son dépôt en quarantaine.</p></div>:<div className="crm-asset-grid">{assets.map(asset=><article key={asset.assetId}><div className="crm-asset-preview">{asset.detectedMimeType?.startsWith("image/")&&["quarantined","validated"].includes(asset.status)?<img src={`/api/crm/contributions/${asset.contributionId}/assets/${asset.assetId}/download`} alt=""/>:<span>{asset.detectedMimeType==="application/pdf"?"DOCUMENT PDF":"FICHIER"}</span>}<b data-status={asset.status}>{states[asset.status]??"État technique"}</b></div><div className="crm-asset-copy"><h3>{asset.safeFileName}</h3><p>{sizeLabel(asset.size)} · {asset.detectedMimeType??asset.declaredMimeType}</p><dl><div><dt>Provenance</dt><dd>{states[asset.sourceStatus]??"À établir"}</dd></div><div><dt>Droits</dt><dd>{states[asset.rightsStatus]??"À établir"}</dd></div><div><dt>Consentement</dt><dd>{states[asset.consentStatus]??"À établir"}</dd></div></dl>{["quarantined","validated"].includes(asset.status)&&<a href={`/api/crm/contributions/${asset.contributionId}/assets/${asset.assetId}/download`} target="_blank" rel="noreferrer">Consulter l’original ↗</a>}<details><summary>Examiner ce fichier <i>＋</i></summary><form onSubmit={event=>mutate(asset,event)}><label>Action<select name="operation"><option value="validate" disabled={!permissions.includes("asset.assigned.review")}>Valider humainement</option><option value="reject" disabled={!permissions.includes("asset.assigned.review")}>Rejeter</option><option value="withdraw" disabled={!permissions.includes("asset.self.manage")}>Retirer</option><option value="clearance" disabled={!permissions.some(permission=>permission.endsWith(".verify"))}>Contrôle documentaire</option><option value="request_deletion" disabled={!permissions.includes("asset.self.manage")}>Demander la suppression</option></select></label><label>Domaine<select name="field"><option value="rightsStatus">Droits</option><option value="consentStatus">Consentement</option><option value="sourceStatus">Provenance</option></select></label><label>Décision<select name="value"><option value="verified">Vérifié</option><option value="declared">Déclaré, à vérifier</option><option value="unknown">À établir</option><option value="cleared">Diffusion autorisée</option><option value="not_applicable">Sans objet</option><option value="granted">Consentement accordé</option><option value="not_required">Consentement non requis</option><option value="pending">En attente</option><option value="withdrawn">Retiré</option></select></label><label>Motif<textarea name="reason" required maxLength={500}/></label><button disabled={busy}>Confirmer la décision</button></form></details></div></article>)}</div>}</>}</div>
    </section>
    </fieldset>
  </div>;
}
