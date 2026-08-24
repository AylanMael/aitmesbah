import type {Metadata} from "next";
import Link from "next/link";
import {ContributionManager} from "@/components/crm/ContributionManager";
import {listContributionRecords} from "@/lib/firebase/contribution-admin";
import {resolveCrmSession} from "@/lib/firebase/session";
export const metadata:Metadata={title:"Contributions éditoriales",robots:{index:false,follow:false}};
const useful=["draft.self.manage","review.assigned.read","review.assigned.comment","editorial.assign","editorial.completeness.review","editorial.provenance.verify","editorial.rights.verify","editorial.consent.verify","editorial.ordinary.approve"];
export default async function ContributionsPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const session=await resolveCrmSession();if(session.state!=="authorized"||!session.permissions.some(p=>useful.includes(p)))return <main className="crm-denied"><h1>Accès refusé</h1><p>Une permission éditoriale explicite est requise.</p></main>;const result=await listContributionRecords(session.uid,await searchParams);return <main className="crm-shell crm-contributions"><Link href="/crm" className="crm-back">← Administration</Link><p className="crm-kicker">Circuit privé</p><h1>Contributions éditoriales</h1><p className="crm-page-intro">Une approbation interne ne publie rien sur le site.</p><ContributionManager initial={JSON.parse(JSON.stringify(result.contributions))} nextCursor={result.nextCursor} permissions={session.permissions} uid={session.uid}/></main>}
