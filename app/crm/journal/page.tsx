import type {Metadata} from "next";
import {AuditLogViewer} from "@/components/crm/AuditLogViewer";
import {CrmPageHeader} from "@/components/crm/CrmPageHeader";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Journal d’audit privé",robots:{index:false,follow:false}};
export default async function AuditJournalPage(){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.includes("audit.read"))return <main className="crm-denied"><h1>Accès refusé</h1><p>Vous n’êtes pas autorisé à consulter ce journal.</p></main>;return <main className="crm-shell crm-audit"><CrmPageHeader index="05" kicker="Traçabilité" title="Journal d’audit" description="La mémoire des décisions sensibles du CRM. Ce registre privé, borné et non modifiable permet de comprendre qui a fait quoi, quand et dans quel cadre."/><AuditLogViewer/></main>}
