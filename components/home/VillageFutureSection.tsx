import Link from "next/link";

const futurePaths = [
  { number: "01", label: "Se souvenir", title: "Histoire et mémoire", description: "Récits, photographies, archives et repères du village.", href: "/histoire-memoire", mark: "⌁" },
  { number: "02", label: "Transmettre", title: "Culture vivante", description: "Langue, savoir-faire et liens entre les générations.", href: "/culture", mark: "◉" },
  { number: "03", label: "Prendre soin", title: "Territoire et cadre de vie", description: "Quartiers, lieux communs, patrimoine et environnement.", href: "/carte-vivante", mark: "◇" },
  { number: "04", label: "Construire", title: "Initiatives et projets", description: "Besoins, compétences et propositions pour l’avenir.", href: "/projets", mark: "↗" },
] as const;

export default function VillageFutureSection() {
  return (
    <section className="village-future village-future-premium section-pad" aria-labelledby="village-future-title">
      <header className="village-future-heading">
        <p className="eyebrow">Aït Mesbah en mouvement</p>
        <h2 id="village-future-title">
          Une mémoire vivante,
          <br />
          <em>un avenir à construire</em>
        </h2>
        <p>Le mouvement commence lorsque la mémoire éclaire le présent et que les bonnes volontés trouvent un chemin pour agir.</p>
        <Link href="/agir">Découvrir la démarche <span aria-hidden="true">↗</span></Link>
      </header>

      <div className="village-future-paths">
        {futurePaths.map((path) => (
          <Link href={path.href} key={path.number}>
            <header><span>{path.number}</span><small>{path.label}</small><i aria-hidden="true">{path.mark}</i></header>
            <h3>{path.title}</h3><p>{path.description}</p><b aria-hidden="true">Explorer&nbsp; →</b>
          </Link>
        ))}
      </div>

      <div className="village-future-note"><span>Notre cap</span><p>Préserver ce qui nous relie.<br/><em>Faire naître ce qui nous manque.</em></p><i aria-hidden="true">ⵣ</i></div>
    </section>
  );
}
