import type { Metadata } from "next";
import Link from "next/link";
import { ActivationForm } from "@/components/crm/ActivationForm";
export const metadata:Metadata={title:"Vérification d’adresse CRM — Aït Mesbah",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function VerificationEmailPage(){return <main className="crm-auth-page"><section className="crm-auth-card" aria-labelledby="verification-title"><Link className="crm-auth-brand" href="/">Aït Mesbah <span>Village & Mémoire</span></Link><p className="crm-kicker">Adresse électronique</p><h1 id="verification-title">Vérifier l’adresse</h1><p className="crm-auth-intro">Récupérez le code du lien de vérification dans l’interface locale de l’émulateur Auth. L’étape MFA restera ensuite bloquée jusqu’à une validation dédiée.</p><ActivationForm stage="verification"/></section></main>}
