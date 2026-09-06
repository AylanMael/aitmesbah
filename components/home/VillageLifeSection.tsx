import Link from "next/link";

const paths = [
  ["01", "Comité du village", "Organiser la parole collective", "/comite-village"],
  ["02", "Sport et jeunesse", "Former, transmettre, rassembler", "/vivre#vie-collective"],
  ["03", "Culture vivante", "Créer des liens entre générations", "/association-imache-amar"],
] as const;

export default function VillageLifeSection() {
  return <section className="home-life section-pad" aria-labelledby="home-life-title">
    <div className="home-life-heading">
      <p className="eyebrow">Le village au présent</p>
      <h2 id="home-life-title">Une communauté qui<br /><em>se retrouve et agit</em></h2>
      <p>La mémoire d’Aït Mesbah se prolonge chaque jour dans les rencontres, les associations, le sport, la culture et les initiatives portées ensemble.</p>
      <Link href="/vivre">Vivre au village <span aria-hidden="true">↗</span></Link>
    </div>

    <div className="home-life-paths">
      {paths.map(([number, title, description, href]) => <Link href={href} key={number}>
        <span>{number}</span>
        <div><h3>{title}</h3><p>{description}</p></div>
        <b aria-hidden="true">↗</b>
      </Link>)}
    </div>

    <div className="home-life-seal" aria-hidden="true"><span>ⵣ</span><small>ICI · ENSEMBLE · DEMAIN</small></div>
  </section>;
}
