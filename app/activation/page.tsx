import type { Metadata } from "next";
import Link from "next/link";
import { ActivationForm } from "@/components/crm/ActivationForm";
export const metadata:Metadata={title:"Mot de passe CRM — Aït Mesbah",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function ActivationPage(){return <main className="crm-auth-page"><section className="crm-auth-card" aria-labelledby="activation-title"><Link className="crm-auth-brand" href="/">Aït Mesbah <span>Village & Mémoire</span></Link><p className="crm-kicker">Activation locale</p><h1 id="activation-title">Définir le mot de passe</h1><p className="crm-auth-intro">Récupérez le code du lien de réinitialisation dans l’interface locale de l’émulateur Auth. Le mot de passe n’est jamais enregistré dans le CRM.</p><ActivationForm stage="password"/></section></main>}
