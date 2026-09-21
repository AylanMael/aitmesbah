"use client";
import {useRef,useState} from "react";

type Choice={uid:string;displayName:string;status:string;authDisabled?:boolean;globalRoles:string[]};
export default function AccountPicker({name,canRead,excludeUid,reviewersOnly=false}:{name:string;canRead:boolean;excludeUid?:string;reviewersOnly?:boolean}){
  const [accounts,setAccounts]=useState<Choice[]>([]),[loaded,setLoaded]=useState(false),[cursor,setCursor]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const pending=useRef(false);
  async function load(){
    if(pending.current)return;
    pending.current=true;setBusy(true);setError("");
    try{
      const params=new URLSearchParams({limit:"50"});if(cursor)params.set("cursor",cursor);
      const response=await fetch(`/api/crm/accounts?${params}`,{cache:"no-store"});
      if(!response.ok)throw new Error(response.status===403?"Votre rôle ne permet pas de consulter cet annuaire.":"L’annuaire n’a pas pu être chargé. Réessayez.");
      const data=await response.json();
      setAccounts(current=>[...new Map([...current,...data.accounts].map(account=>[account.uid,account])).values()]);
      setCursor(data.nextCursor);setLoaded(true);
    }catch(reason){setError(reason instanceof Error?reason.message:"Chargement impossible.");}
    finally{pending.current=false;setBusy(false);}
  }
  if(!canRead)return <span><input name={name} required maxLength={128} placeholder="Identifiant communiqué par un responsable"/><small>Votre rôle n’autorise pas la consultation de l’annuaire des comptes.</small></span>;
  const choices=accounts.filter(account=>account.uid!==excludeUid&&account.status==="active"&&account.authDisabled===false&&(!reviewersOnly||account.globalRoles.some(role=>["reviewer","editorial_manager","memory_archives_referent"].includes(role))));
  return <span className="crm-account-picker">
    <select name={name} required defaultValue="" aria-label={reviewersOnly?"Choisir un relecteur":"Choisir un compte"}>
      <option value="">{loaded?"Choisir une personne…":"Chargez les personnes disponibles…"}</option>
      {choices.map(account=><option key={account.uid} value={account.uid}>{account.displayName} · {account.uid.slice(-6)}</option>)}
    </select>
    {(!loaded||cursor)&&<button type="button" disabled={busy} onClick={load}>{busy?"Chargement…":loaded?"Voir davantage de personnes":"Charger les personnes"}</button>}
    {error&&<small role="alert">{error}</small>}
    {loaded&&!choices.length&&<small>Aucune personne éligible parmi les comptes chargés.{cursor?" Vous pouvez charger la page suivante.":""}</small>}
    <small>Le serveur vérifiera les droits et, si nécessaire, l’appartenance à l’organisation avant toute affectation.</small>
  </span>;
}
