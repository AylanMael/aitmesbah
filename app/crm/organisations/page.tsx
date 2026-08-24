import type {Metadata} from "next";
import Link from "next/link";
import {OrganizationManager} from "@/components/crm/OrganizationManager";
import {listOrganizations} from "@/lib/firebase/organization-admin";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Gestion des organisations",robots:{index:false,follow:false}};
export default async function OrganizationsPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.some(permission=>["organization.list","organization.member.manage","role.local.manage"].includes(permission)))return <main className="crm-denied"><h1>Accès refusé</h1><p>La consultation exige une responsabilité organisationnelle explicite.</p></main>;const result=await listOrganizations(session.uid,await searchParams);return <main className="crm-shell crm-organizations"><Link href="/crm" className="crm-back">← Administration</Link><p className="crm-kicker">Gestion privée</p><h1>Organisations et appartenances</h1><p className="crm-page-intro">L’enregistrement dans le CRM ne constitue ni une reconnaissance officielle ni un mandat au nom du village.</p><OrganizationManager initial={JSON.parse(JSON.stringify(result.organizations))} nextCursor={result.nextCursor} permissions={session.permissions}/></main>}
