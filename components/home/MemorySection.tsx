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
          <p>Récits, photographies et documents prennent sens lorsqu’ils sont identifiés, contextualisés et transmis avec l’accord de leurs auteurs ou de leurs détenteurs.</p>
        </div>
      </div>
      <div className="memory-gesture" aria-label="Principes de transmission">
        <span>Identifier</span>
        <span>Contextualiser</span>
        <span>Transmettre</span>
      </div>
      <div className="memory-grid">
        <article className="feature-card memory-feature">
          <span className="card-no">01 · Récits</span>
          <h3>Récits et histoire</h3>
          <p>Les premiers repères présentent l’histoire du village avec des niveaux de certitude explicites, sans transformer la tradition orale en fait établi.</p>
          <a className="text-link light-link" href="/histoire-memoire">Lire l’histoire et la mémoire →</a>
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
