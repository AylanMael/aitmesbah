import { memoryItems } from "@/data/home";

export default function MemorySection() {
  return (
    <section id="memoire" className="memory dark-section section-pad">
      <div className="section-head">
        <div>
          <p className="eyebrow light">Histoire & transmission</p>
          <h2>
            Une histoire
            <br />
            à <em>transmettre</em>
          </h2>
        </div>
        <p>
          Les souvenirs racontés par nos aînés, les photographies de famille et
          les récits de chacun composent une histoire précieuse. Ensemble,
          préservons-la.
        </p>
      </div>
      <div className="memory-grid">
        <article className="feature-card">
          <div className="feature-image photo-placeholder">
            <span>
              Archive photographique
              <br />
              <small>à intégrer</small>
            </span>
          </div>
          <div>
            <span className="card-no">01</span>
            <h3>
              Aux origines
              <br />
              du village
            </h3>
            <p>
              Un récit documenté des origines et de l’évolution d’Aït Mesbah —
              contenu historique à compléter et à valider collectivement.
            </p>
            <a href="#contribuer">Découvrir le récit →</a>
          </div>
        </article>
        <div className="memory-list">
          {memoryItems.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <div>
                <small>{item.category}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <b>↗</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
