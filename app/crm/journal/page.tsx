import type {Metadata} from "next";
import Link from "next/link";
import {AuditLogViewer} from "@/components/crm/AuditLogViewer";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Journal d’audit privé",robots:{index:false,follow:false}};
export default async function AuditJournalPage(){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.includes("audit.read"))return <main className="crm-denied"><h1>Accès refusé</h1><p>Vous n’êtes pas autorisé à consulter ce journal.</p></main>;return <main className="crm-shell crm-audit"><Link href="/crm" className="crm-back">← Administration</Link><p className="crm-kicker">Consultation privée</p><h1>Journal d’audit</h1><p className="crm-page-intro">Consultez les opérations sensibles enregistrées par le CRM. Ce journal est privé, borné et non modifiable depuis cette interface. Les événements présentés sont techniques et éditoriaux.</p><AuditLogViewer/></main>}
