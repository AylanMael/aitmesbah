import type {Metadata} from "next";
import Link from "next/link";
import {AssetManager} from "@/components/crm/AssetManager";
import {listContributionRecords} from "@/lib/firebase/contribution-admin";
import {listDeletionRequests} from "@/lib/firebase/asset-admin";
import {resolveCrmSession} from "@/lib/firebase/session";

export const metadata:Metadata={title:"Fichiers privés",robots:{index:false,follow:false}};
const useful=["asset.self.manage","asset.assigned.read","asset.assigned.review","asset.deletion.manage"];
export default async function FilesPage(){
  const session=await resolveCrmSession();
  if(session.state!=="authorized"||!session.permissions.some(permission=>useful.includes(permission)))return <main className="crm-denied"><h1>Accès refusé</h1></main>;
  const [contributions,deletions]=await Promise.all([listContributionRecords(session.uid,{}),session.permissions.includes("asset.deletion.manage")?listDeletionRequests(session.uid,{limit:"25"}):Promise.resolve({requests:[]})]);
  return <main className="crm-shell crm-files"><Link className="crm-back" href="/crm">← Administration</Link><p className="crm-kicker">Originaux privés</p><h1>Fichiers, droits et consentements</h1><p className="crm-page-intro">Quarantaine locale uniquement. Aucun fichier n’est publié ni déclaré exempt de logiciel malveillant.</p><AssetManager contributions={JSON.parse(JSON.stringify(contributions.contributions))} permissions={session.permissions} initialDeletionRequests={JSON.parse(JSON.stringify(deletions.requests))}/></main>;
}
