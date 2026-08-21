import type { Metadata } from "next";
import { resolveCrmSession } from "@/lib/firebase/session";
import { LogoutButton } from "@/components/crm/LogoutButton";
export const metadata:Metadata={title:"Administration communautaire",robots:{index:false,follow:false}};
const domains=["Contributions","Relecture","Organisations","Comptes","Fichiers privés","Journal d’audit"];
export default async function CrmPage(){const context=await resolveCrmSession();return <main className="crm-shell"><header className="crm-shell-header"><div><p className="crm-kicker">Espace privé</p><h1>Administration communautaire</h1><p>Session de <strong>{context.state==="authorized"?context.displayName:"membre autorisé"}</strong>. Les outils métier seront ouverts lors de missions séparées.</p></div><LogoutButton/></header><section aria-labelledby="future-domains"><h2 id="future-domains">Domaines à venir</h2><ul className="crm-domain-list">{domains.map((domain,index)=><li key={domain}><span>{String(index+1).padStart(2,"0")}</span><strong>{domain}</strong><small>Indisponible dans cette fondation</small></li>)}</ul></section></main>}
