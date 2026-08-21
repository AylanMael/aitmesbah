import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/crm/LoginForm";
export const metadata:Metadata={title:"Connexion — Espace communautaire",robots:{index:false,follow:false}};
export default function ConnexionPage(){return <main className="crm-auth-page"><section className="crm-auth-card" aria-labelledby="login-title"><Link className="crm-auth-brand" href="/">Aït Mesbah <span>Village & Mémoire</span></Link><p className="crm-kicker">Accès privé</p><h1 id="login-title">Connexion nominative</h1><p className="crm-auth-intro">Cet espace est réservé aux membres et responsables expressément autorisés. Aucune inscription publique n’est proposée.</p><LoginForm/><p className="crm-auth-note">En cas de difficulté, contactez directement un responsable habilité.</p></section></main>}
