import Link from "next/link";
import { villageLiveItems } from "@/data/village-live";

export default function VillageAliveSection() {
  return <section className="home-alive" aria-labelledby="home-alive-title">
    <header className="home-alive-head">
      <div><p className="eyebrow">Le village vivant</p><h2 id="home-alive-title">Regarder hier.<br/><em>Prendre part aujourd’hui.</em></h2></div>
      <div><p>Reconnaître un visage sur une archive, proposer une action pour un lieu commun ou raconter un apprentissage : trois façons concrètes de participer, même à distance.</p><span>Pistes de contribution · Pas d’actions annoncées comme acquises</span></div>
    </header>
    <div className="home-alive-grid">{villageLiveItems.map((item) => <article className={`home-alive-card ${item.tone}`} key={item.number}>
      <div className="home-alive-card-top"><span>{item.number}</span><small>{item.kind}</small></div><div className="home-alive-mark" aria-hidden="true">{item.tone === "archive" ? "⌁" : item.tone === "action" ? "↗" : "◉"}</div>
      <h3>{item.title}</h3><p>{item.text}</p><Link href={item.href}>{item.action}<span aria-hidden="true">→</span></Link>
    </article>)}</div>
    <footer className="home-alive-footer"><p><strong>Une place pour chacun.</strong> Habitants, familles, associations, jeunes et membres de la diaspora peuvent contribuer à leur manière.</p><div><Link href="/carte-vivante">Explorer la carte</Link><Link href="/projets">Suivre les projets</Link><Link className="primary" href="/contribuer">Faire sa part <span aria-hidden="true">↗</span></Link></div></footer>
  </section>;
}
