import { places } from "@/data/home";

export default function PlacesSection() {
  return (
    <section className="places section-pad">
      <div className="section-head light-head">
        <div>
          <p className="eyebrow">Chemins & patrimoine</p>
          <h2>
            Les lieux qui racontent
            <br />
            <em>Aït Mesbah</em>
          </h2>
        </div>
        <p>
          Fontaines, places, chemins et points de vue : chaque lieu porte une
          mémoire. Les noms et contenus seront ajoutés avec les habitants.
        </p>
      </div>
      <div className="place-grid">
        {places.map((place) => (
          <article
            className={`place${place.large ? " large" : ""} photo-placeholder`}
            key={place.title}
          >
            <span className="draft">{place.draftLabel}</span>
            <div>
              <small>{place.category}</small>
              <h3>{place.title}</h3>
              {place.description && <p>{place.description}</p>}
            </div>
          </article>
        ))}
      </div>
      <a className="outline-btn" href="#">
        Explorer tous les lieux →
      </a>
    </section>
  );
}
