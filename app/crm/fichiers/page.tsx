import type {Metadata} from "next";
import {AssetManager} from "@/components/crm/AssetManager";
import {CrmPageHeader} from "@/components/crm/CrmPageHeader";
import {listContributionRecords} from "@/lib/firebase/contribution-admin";
import {listDeletionRequests} from "@/lib/firebase/asset-admin";
import {resolveCrmSession} from "@/lib/firebase/session";

export const metadata:Metadata={title:"Fichiers privés",robots:{index:false,follow:false}};
const useful=["asset.self.manage","asset.assigned.read","asset.assigned.review","asset.deletion.manage"];
export default async function FilesPage(){
  const session=await resolveCrmSession();
  if(session.state!=="authorized"||!session.permissions.some(permission=>useful.includes(permission)))return <main className="crm-denied"><h1>Accès refusé</h1></main>;
  const [contributions,deletions]=await Promise.all([listContributionRecords(session.uid,{}),session.permissions.includes("asset.deletion.manage")?listDeletionRequests(session.uid,{limit:"25"}):Promise.resolve({requests:[]})]);
  return <main className="crm-shell crm-files"><CrmPageHeader index="02" kicker="Fonds documentaires" title="Fichiers & droits" description="Les originaux restent privés tant que leur provenance, leurs droits et les consentements nécessaires ne sont pas établis. Aucun dépôt n’entraîne une publication automatique." count={contributions.contributions.length} countLabel="fonds accessibles"/><AssetManager contributions={JSON.parse(JSON.stringify(contributions.contributions))} permissions={session.permissions} initialDeletionRequests={JSON.parse(JSON.stringify(deletions.requests))}/></main>;
}
