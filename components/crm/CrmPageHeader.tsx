import Link from "next/link";

export function CrmPageHeader({index,kicker,title,description,count,countLabel}:{index:string;kicker:string;title:string;description:string;count?:number;countLabel?:string}){
  return <header className="crm-page-header">
    <div className="crm-page-heading"><Link href="/crm" className="crm-back">← Tableau de bord</Link><p className="crm-kicker">{kicker}</p><h1>{title}</h1><p className="crm-page-intro">{description}</p></div>
    <div className="crm-page-number" aria-hidden="true"><span>{index}</span>{count!==undefined&&<small><strong>{String(count).padStart(2,"0")}</strong>{countLabel}</small>}</div>
  </header>;
}
