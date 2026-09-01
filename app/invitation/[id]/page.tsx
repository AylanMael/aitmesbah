import type { Metadata } from "next";
import Link from "next/link";
import { ActivationForm } from "@/components/crm/ActivationForm";
export const metadata:Metadata={title:"Invitation CRM — Aït Mesbah",robots:{index:false,follow:false},referrer:"no-referrer"};
export default async function InvitationPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <main className="crm-auth-page"><section className="crm-auth-card" aria-labelledby="activation-title"><Link className="crm-auth-brand" href="/">Aït Mesbah <span>Village & Mémoire</span></Link><p className="crm-kicker">Invitation privée</p><h1 id="activation-title">Commencer l’activation</h1><p className="crm-auth-intro">Saisissez le code remis par un responsable. Aucune inscription publique n’est disponible.</p><ActivationForm stage="invitation" invitationId={id}/></section></main>}
