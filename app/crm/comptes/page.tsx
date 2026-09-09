import type {Metadata} from "next";
import {AccountManager} from "@/components/crm/AccountManager";
import {CrmPageHeader} from "@/components/crm/CrmPageHeader";
import {listAccounts} from "@/lib/firebase/account-admin";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Gestion des comptes",robots:{index:false,follow:false}};
export default async function AccountsPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.includes("profile.assigned.read"))return <main className="crm-denied"><h1>Accès refusé</h1><p>La consultation des comptes exige une permission dédiée.</p></main>;const result=await listAccounts({uid:session.uid,permissions:session.permissions,status:"active"},await searchParams);return <main className="crm-shell crm-accounts"><CrmPageHeader index="03" kicker="Gouvernance des accès" title="Comptes & rôles" description="Les accès sont nominatifs, limités au besoin réel et révocables. Chaque évolution de responsabilité doit être motivée et reste inscrite au journal." count={result.accounts.length} countLabel="comptes affichés"/><AccountManager initial={JSON.parse(JSON.stringify(result.accounts))} nextCursor={result.nextCursor} permissions={session.permissions} currentUid={session.uid}/></main>}
