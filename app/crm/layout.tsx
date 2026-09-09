import { redirect } from "next/navigation";
import { resolveCrmSession } from "@/lib/firebase/session";
import { CrmNavigation } from "@/components/crm/CrmNavigation";
export const dynamic="force-dynamic";
export default async function CrmLayout({children}:{children:React.ReactNode}){const context=await resolveCrmSession();if(context.state==="unauthenticated")redirect("/connexion");if(context.state==="unauthorized")return <main className="crm-denied"><p className="crm-kicker">Accès refusé</p><h1>Permission insuffisante</h1><p>Votre compte est reconnu, mais aucune permission opérationnelle ne permet d’ouvrir le CRM.</p></main>;return <div className="crm-app" data-crm-user={context.uid}><CrmNavigation displayName={context.displayName} permissions={context.permissions}/><div className="crm-workspace">{children}</div></div>}
