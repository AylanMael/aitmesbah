import Image from "next/image";

export default function VillageIntro() {
  return (
    <section id="decouvrir" className="intro section-pad">
      <span className="intro-index" aria-hidden="true">01</span>
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
          Découvrir l’histoire <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="intro-visual">
        <span className="intro-photo-mark" aria-hidden="true">ⵣ</span>
        <Image
          src="/ait-mesbah-village.jpg"
          alt="Vue du village d’Aït Mesbah et des montagnes de Kabylie"
          fill
          sizes="(max-width: 760px) 100vw, 48vw"
        />
        <div className="intro-caption">
          <div><span>36° 35′ N</span><small>Aït Douala · Haute Kabylie</small></div>
          <p>Entre crêtes,<br />oliviers et mémoire</p>
        </div>
      </div>
      <span className="intro-place" aria-hidden="true">TERRE · MÉMOIRE · TRANSMISSION</span>
    </section>
  );
}
