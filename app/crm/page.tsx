import type { Metadata } from "next";
import Link from "next/link";
import { resolveCrmSession } from "@/lib/firebase/session";
import { LogoutButton } from "@/components/crm/LogoutButton";
export const metadata:Metadata={title:"Administration communautaire",robots:{index:false,follow:false}};
const domains=["Contributions","Relecture","Organisations","Fichiers privés","Journal d’audit"];
export default async function CrmPage(){const context=await resolveCrmSession();return <main className="crm-shell"><header className="crm-shell-header"><div><p className="crm-kicker">Espace privé</p><h1>Administration communautaire</h1><p>Session de <strong>{context.state==="authorized"?context.displayName:"membre autorisé"}</strong>.</p></div><LogoutButton/></header>{context.state==="authorized"&&context.permissions.includes("profile.assigned.read")&&<section aria-labelledby="active-domain"><h2 id="active-domain">Outil disponible</h2><Link className="crm-tool-card" href="/crm/comptes"><strong>Comptes et rôles globaux</strong><span>Ouvrir la gestion privée →</span></Link></section>}<section aria-labelledby="future-domains"><h2 id="future-domains">Domaines à venir</h2><ul className="crm-domain-list">{domains.map((domain,index)=><li key={domain}><span>{String(index+1).padStart(2,"0")}</span><strong>{domain}</strong><small>Indisponible</small></li>)}</ul></section></main>}
