const futurePaths = [
  {
    number: "01",
    title: "Histoire et mémoire",
    description: "Récits, photographies, archives et repères du village.",
  },
  {
    number: "02",
    title: "Culture et transmission",
    description: "Langue, traditions, savoir-faire et liens entre les générations.",
  },
  {
    number: "03",
    title: "Village et cadre de vie",
    description: "Environnement, lieux communs, patrimoine et initiatives locales.",
  },
  {
    number: "04",
    title: "Idées et projets",
    description: "Réflexions, compétences et propositions pour accompagner l’avenir d’Aït Mesbah.",
  },
] as const;

export default function VillageFutureSection() {
  return (
    <section className="village-future section-pad" aria-labelledby="village-future-title">
      <header className="village-future-heading">
        <p className="eyebrow">Aït Mesbah en mouvement</p>
        <h2 id="village-future-title">
          Une mémoire vivante,
          <br />
          <em>un avenir à construire</em>
        </h2>
        <p>
          Connaître notre histoire, préserver notre cadre de vie et faire
          circuler les idées qui peuvent être utiles au village.
        </p>
      </header>

      <div className="village-future-paths">
        {futurePaths.map((path) => (
          <article key={path.number}>
            <span>{path.number}</span>
            <h3>{path.title}</h3>
            <p>{path.description}</p>
          </article>
        ))}
      </div>

      <p className="village-future-note">
        Cet espace présentera progressivement les initiatives documentées et
        les projets confirmés utiles au village.
      </p>
    </section>
  );
}
