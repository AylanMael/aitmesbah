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
          Aït Mesbah est un village kabyle d’environ 4 000 résidents, niché au
          cœur de la Haute Kabylie.
        </p>
        <p>
          Une communauté unie par une terre, une culture et des valeurs de
          solidarité. Ce site rassemble sa mémoire et raconte son présent, pour
          les habitants, la diaspora et les générations à venir.
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
    </section>
  );
}
