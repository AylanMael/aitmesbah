import { memoryItems } from "@/data/home";

export default function MemorySection() {
  return (
    <section id="memoire" className="memory dark-section section-pad">
      <div className="section-head">
        <div>
          <p className="eyebrow light">Mémoire du village</p>
          <h2>Une mémoire à recueillir et à transmettre</h2>
        </div>
        <div className="memory-intro">
          <p>Cette rubrique est en cours de construction. Elle réunira progressivement des récits, des photographies, des documents et des repères historiques consacrés à Aït Mesbah.</p>
          <p>Chaque contribution devra être vérifiée, contextualisée et publiée avec l’accord de ses auteurs ou de ses détenteurs.</p>
        </div>
      </div>
      <div className="memory-grid">
        <article className="feature-card">
          <div className="feature-image photo-placeholder">
            <span>Archive authentique à intégrer après validation</span>
          </div>
          <div>
            <span className="card-no">01</span>
            <h3>Récits et histoire</h3>
            <p>Cette rubrique accueillera des récits documentés sur le village, ses habitants et son évolution.</p>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
