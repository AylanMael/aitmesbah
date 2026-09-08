import Link from "next/link";

const destinations = [["01", "Algérie", "Proches du village"], ["02", "France", "Une histoire ancienne"], ["03", "Canada", "De nouveaux départs"], ["04", "États-Unis", "Des liens à retrouver"]] as const;

export default function DiasporaSection() {
  return <section id="diaspora" className="diaspora diaspora-home-premium section-pad" aria-labelledby="diaspora-home-title">
    <div className="diaspora-home-map" aria-hidden="true"><div className="diaspora-home-rings"><i/><i/><i/></div><div className="diaspora-home-origin"><span>Depuis</span><strong>Aït<br/>Mesbah</strong><small>36° 35′ N</small></div>{destinations.map(([number,name], index) => <div className={`diaspora-home-node node-${index + 1}`} key={name}><span>{number}</span><strong>{name}</strong></div>)}<p>Une même origine<br/><em>plusieurs horizons</em></p></div>
    <div className="diaspora-copy diaspora-home-copy"><p className="eyebrow light">La communauté sans frontières</p><h2 id="diaspora-home-title">Partir sans jamais<br/><em>rompre le lien</em></h2><p className="diaspora-home-lead">D’une rive à l’autre, le village continue de vivre dans les familles, les souvenirs, la langue et les gestes transmis.</p><p>Aït Mesbah ne s’arrête pas à ses chemins. Cette rubrique reliera progressivement les parcours de celles et ceux qui vivent ailleurs à la mémoire et à l’avenir du village.</p><div className="diaspora-home-destinations">{destinations.map(([number,name,note]) => <div key={name}><span>{number}</span><strong>{name}</strong><small>{note}</small></div>)}</div><div className="diaspora-home-actions"><Link className="diaspora-home-primary" href="/diaspora">Explorer les parcours <span aria-hidden="true">↗</span></Link><Link href="/contribuer?category=diaspora&title=Un parcours de la diaspora#envoyer">Partager un lien</Link></div></div>
    <footer className="diaspora-home-footer"><span>Village</span><i/><p>Familles · mémoire · entraide · transmission</p><i/><span>Horizons</span></footer>
  </section>;
}
