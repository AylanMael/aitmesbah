import { villageFacts } from "@/data/home";

export default function VillageIntro() {
  return (
    <section id="decouvrir" className="intro section-pad">
      <div className="pattern-band" />
      <div className="intro-left">
        <p className="eyebrow">Notre village</p>
        <h2>
          Là où la montagne
          <br />
          garde nos <em>racines</em>
        </h2>
        <p className="lead">
          Aït Mesbah est un village de la commune d’Aït Douala, dans la wilaya de Tizi Ouzou, en Algérie.
        </p>
        <p>
          Une communauté unie par une terre, une culture et des valeurs de solidarité. Ce site a pour vocation de recueillir, préserver et transmettre progressivement la mémoire du village.
        </p>
        <a className="text-link" href="#memoire">
          L’histoire du village →
        </a>
      </div>
      <div className="intro-visual photo-placeholder">
        <div className="photo-label">
          <b>Photographie du village</b>
          <span>À remplacer par une vue authentique</span>
        </div>
      </div>
      <div className="facts">
        {villageFacts.map((fact) => (
          <div key={fact.value}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </div>
        ))}
      </div>
      <p className="facts-note">L’estimation de population est fournie par le responsable éditorial du projet et reste à rapprocher d’une source officielle.</p>
    </section>
  );
}
