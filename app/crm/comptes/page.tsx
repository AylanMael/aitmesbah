import type {Metadata} from "next";
import Link from "next/link";
import {AccountManager} from "@/components/crm/AccountManager";
import {listAccounts} from "@/lib/firebase/account-admin";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Gestion des comptes",robots:{index:false,follow:false}};
export default async function AccountsPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.includes("profile.assigned.read"))return <main className="crm-denied"><h1>Accès refusé</h1><p>La consultation des comptes exige une permission dédiée.</p></main>;const result=await listAccounts({uid:session.uid,permissions:session.permissions,status:"active"},await searchParams);return <main className="crm-shell crm-accounts"><Link href="/crm" className="crm-back">← Administration</Link><p className="crm-kicker">Gestion privée</p><h1>Comptes et rôles globaux</h1><p className="crm-page-intro">Consultation minimale et opérations administratives locales. Chaque décision sensible est motivée et auditée.</p><AccountManager initial={JSON.parse(JSON.stringify(result.accounts))} nextCursor={result.nextCursor} permissions={session.permissions} currentUid={session.uid}/></main>}
