import { memoryItems } from "@/data/home";
import Link from "next/link";

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
        <article className="feature-card">
          <div className="feature-image memory-art" aria-hidden="true">
            <span className="memory-art-symbol">ⵣ</span>
            <span className="memory-art-ring" />
            <small>Paroles · gestes · visages · lieux</small>
          </div>
          <div>
            <span className="card-no">01</span>
            <h3>Récits et histoire</h3>
            <p>Des origines du village à ses transformations contemporaines, cette rubrique réunira des récits documentés, des parcours de vie et des repères historiques pour transmettre une mémoire vivante aux générations futures.</p>
            <Link className="memory-feature-link" href="/histoire-memoire">Parcourir la chronologie <span aria-hidden="true">↗</span></Link>
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
