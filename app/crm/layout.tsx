import { redirect } from "next/navigation";
import { resolveCrmSession } from "@/lib/firebase/session";
export default async function CrmLayout({children}:{children:React.ReactNode}){const context=await resolveCrmSession();if(context.state==="unauthenticated")redirect("/connexion");if(context.state==="unauthorized")return <main className="crm-denied"><p className="crm-kicker">Accès refusé</p><h1>Permission insuffisante</h1><p>Votre compte est reconnu, mais aucune permission opérationnelle ne permet d’ouvrir le CRM.</p></main>;return <div data-crm-user={context.uid}>{children}</div>}
