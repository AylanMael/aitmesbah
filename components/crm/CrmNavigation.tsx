"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/crm/LogoutButton";

const items = [
  { href:"/crm", label:"Vue d’ensemble", detail:"Tableau de bord", icon:"home" },
  { href:"/crm/contributions", label:"Contributions", detail:"Collecter et publier", icon:"document" },
  { href:"/crm/fichiers", label:"Fichiers", detail:"Archives et droits", icon:"archive" },
  { href:"/crm/comptes", label:"Comptes", detail:"Accès et rôles", icon:"people" },
  { href:"/crm/organisations", label:"Organisations", detail:"Structures du village", icon:"village" },
  { href:"/crm/journal", label:"Journal", detail:"Traçabilité", icon:"history" },
] as const;

function Icon({name}:{name:string}){
  const paths:Record<string,React.ReactNode>={
    home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9 20v-6h6v6"/></>,
    document:<><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></>,
    archive:<><path d="M4 7h16v13H4zM3 3h18v4H3zM9 11h6"/></>,
    people:<><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M15 6.5a3 3 0 0 1 0 5.8M16 14c2.7.4 4.1 2.1 4.5 5"/></>,
    village:<><path d="m3 12 5-4 4 3 4-5 5 4v10H3zM8 8V4h3v6M7 15h2M14 14h2M18 13h1"/></>,
    history:<><path d="M4.5 7V3m0 0h4m-4 0 3 3a8 8 0 1 1-2 9"/><path d="M12 8v5l3 2"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function CrmNavigation({displayName,permissions}:{displayName:string;permissions:readonly string[]}){
  const pathname=usePathname();
  const visible=items.filter(item=>item.href==="/crm"||item.href.includes("contributions")&&permissions.some(p=>p.includes("editorial")||p.includes("review")||p==="draft.self.manage")||item.href.includes("fichiers")&&permissions.some(p=>p.startsWith("asset."))||item.href.includes("comptes")&&permissions.includes("profile.assigned.read")||item.href.includes("organisations")&&permissions.some(p=>p.startsWith("organization.")||p.startsWith("role.local"))||item.href.includes("journal")&&permissions.includes("audit.read"));
  return <aside className="crm-nav" aria-label="Navigation du CRM">
    <div className="crm-nav-brand"><Link href="/">Aït Mesbah</Link><span>Mémoire & village</span></div>
    <div className="crm-nav-context"><small>Espace de gestion</small><strong>Maison des archives</strong></div>
    <nav>{visible.map(item=>{const active=item.href==="/crm"?pathname===item.href:pathname.startsWith(item.href);return <Link key={item.href} href={item.href} className={active?"is-active":""} aria-current={active?"page":undefined}><span className="crm-nav-icon"><Icon name={item.icon}/></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><i>→</i></Link>})}</nav>
    <div className="crm-nav-footer"><div className="crm-user-mark">{displayName.trim().slice(0,1).toUpperCase()}</div><div><small>Session ouverte</small><strong>{displayName}</strong></div><LogoutButton/></div>
  </aside>;
}
