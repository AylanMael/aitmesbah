import Link from "next/link";
import {crafts} from "@/data/crafts";
import PotteryBorder from "@/components/home/PotteryBorder";
import "@/app/artisanat/artisanat.css";

export function CraftDrawing({kind}: {kind: string}) {
  return <svg viewBox="0 0 240 210" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "poterie" ? <>
      <ellipse cx="120" cy="195" rx="49" ry="3" fill="currentColor" opacity=".07" stroke="none"/>
      <path d="M98 64C65 39 43 74 58 107c6 14 16 19 23 22M142 64c33-25 55 10 40 43-6 14-16 19-23 22" strokeWidth="7"/>
      <path d="M99 64C76 51 57 75 65 99c4 11 11 15 15 18M141 64c23-13 42 11 34 35-4 11-11 15-15 18" stroke="#f1e7d5" strokeWidth="2"/>
      <path d="M99 25c4 19 6 29-2 41-10 16-29 22-29 57 0 24 13 42 30 56l3 10h38l3-10c17-14 30-32 30-56 0-35-19-41-29-57-8-12-6-22-2-41Z" fill="#e8cdb0"/>
      <path d="M101 37h38M100 44h40M96 69q24 8 48 0M89 78q31 9 62 0M74 103q46 10 92 0M72 111q48 10 96 0M78 150q42 10 84 0M83 160q37 9 74 0M99 179h42" stroke="#98472f" strokeWidth="3"/>
      <ellipse cx="120" cy="25" rx="23" ry="5" fill="#ad7754"/><ellipse cx="120" cy="25" rx="17" ry="2" fill="currentColor" opacity=".5" stroke="none"/>
      {[87,109,131].map(x=><g key={x}><path d={`M${x} 121l8 18h-16Z`} fill="#98472f" fillOpacity=".35"/><path d={`M${x-3} 135h6M${x-1} 130h2`}/></g>)}
      <path d="M152 120l-8 18h16Z" fill="#98472f" fillOpacity=".35"/><path d="M83 90l9 6 9-6 9 6 10-6 10 6 9-6 9 6 9-6"/>
    </> : kind === "robe-kabyle" ? <>
      <path d="m100 22-35 12-25 53 24 13 20-31-3 40-19 84q58 12 116 0l-19-84-3-40 20 31 24-13-25-53-35-12c-2 22-38 22-40 0Z" fill="#eee2c7"/>
      <path d="M100 22c-1 30 41 30 40 0M95 25c-2 36 52 36 50 0M92 28c-2 40 58 40 56 0" stroke="#98472f"/>
      <path d="m47 75 22 12m-25-6 22 12m105-6 22-12m-19 18 22-12M81 103q39 8 78 0M80 111q40 8 80 0" stroke="#98472f" strokeWidth="3"/>
      <path d="M72 151q48 11 96 0M70 159q50 11 100 0M67 175q53 12 106 0M65 183q55 12 110 0" stroke="#98472f" strokeWidth="2"/>
      {[80,100,120,140,160].map(x=><path key={x} d={`M${x} 164l4 5-4 5-4-5Z`} fill="#98472f" fillOpacity=".5"/>)}
      <path d="m101 63 7 8-7 8-7-8Zm19-7 7 8-7 8-7-8Zm19 7 7 8-7 8-7-8ZM90 120l-5 25m65-25 5 25m-43-25-2 28m20-28 2 28"/>
      <path d="m122 109 10 17 7-7-17-10 20 3-3 7M132 126l5 16m2-23 10 15" stroke="#98472f"/>
    </> : <>
      <ellipse cx="120" cy="198" rx="75" ry="3" fill="currentColor" opacity=".06" stroke="none"/>
      <path d="M97 60C78 64 65 76 58 97L29 183q28 12 61 10l30-14 30 14q33 2 61-10l-29-86c-7-21-20-33-39-37Z" fill="#ece2cd"/>
      <path d="M97 62C92 43 103 18 120 10c17 8 28 33 23 52l-23 16Z" fill="#f7f0e2"/>
      <path d="M102 58c2-13 8-26 18-34 10 8 16 21 18 34l-18 12Z" fill="#baa78c" fillOpacity=".45"/>
      <path d="M120 10v14M102 58l18 12 18-12M98 63l9 16h26l9-16"/>
      <path d="M107 79c-1 34-6 77-17 114M133 79c1 34 6 77 17 114M103 82c-2 44-8 81-17 107M137 82c2 44 8 81 17 107" stroke="#ac9270" strokeWidth="2"/>
      <path d="M88 77c-13 33-25 72-32 107M72 101l-22 73M152 77c13 33 25 72 32 107m-16-83 22 73M34 179q22 9 51 8m70 0q29 2 51-8" opacity=".45"/>
      <path d="M110 84q10 5 20 0" strokeWidth="3"/><path d="M119 89v75" opacity=".25"/>
    </>}
  </svg>;
}

export default function CraftSection() {
  return <section className="craft-home" aria-labelledby="craft-home-title">
    <PotteryBorder/>
    <header><p className="craft-label">Les savoir-faire d’Aït Mesbah</p><h2 id="craft-home-title">La terre, le fil.<br/><em>Et les mains qui transmettent.</em></h2><p>Poterie, couture de robes kabyles, tapisserie et confection du burnous : une autre manière de découvrir le village, à travers celles et ceux qui façonnent, cousent et tissent.</p></header>
    <div className="craft-cards">{crafts.map(craft => <Link href={`/artisanat/${craft.slug}`} className={`craft-card craft-${craft.slug}`} key={craft.slug}><span className="craft-label">{craft.number} · {craft.material}</span><CraftDrawing kind={craft.slug}/><h3>{craft.name}</h3><span className="craft-card-link">Découvrir le métier <span aria-hidden="true">↗</span></span></Link>)}</div>
    <Link className="craft-link" href="/artisanat">Explorer les savoir-faire du village <span aria-hidden="true">→</span></Link>
  </section>;
}
