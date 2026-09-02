import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="accueil" className="hero">
      <div className="hero-media">
          <Image
            className="hero-photo"
            src="/images/ait-mesbah-hero.webp"
            alt="Vue de Tanajelt à Aït Mesbah"
            fill
            sizes="100vw"
            preload
          />
        <div className="hero-media-shade" />
        <div className="hero-sunlight" aria-hidden="true" />
      </div>
      <div className="grain" />
      <div className="hero-content">
        <p className="eyebrow light">
          <span aria-hidden="true">ⵣ</span> &nbsp; Un village de Haute Kabylie
        </p>
        <h1>
          <span>Aït Mesbah,</span>
          <br />
          <em>une mémoire vivante</em>
        </h1>
        <p className="hero-copy">
          Entre crêtes, chemins et maisons, une communauté transmet sa mémoire
          et fait vivre son village, ici comme au-delà des montagnes.
        </p>
        <div className="hero-buttons">
          <Link href="/village" className="primary">
            Découvrir le village <b aria-hidden="true">↗</b>
          </Link>
          <Link href="/histoire-memoire" className="ghost">
            Explorer notre mémoire
          </Link>
        </div>
      </div>
      <div className="hero-seal" aria-hidden="true">
        <span>ⵣ</span>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path
              id="hero-seal-circle"
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text>
            <textPath href="#hero-seal-circle">
              AÏT MESBAH • TERRE • MÉMOIRE • RACINES •
            </textPath>
          </text>
        </svg>
      </div>
      <div className="hero-place">
        <span>Commune d’Ath Douala</span>
        <span>Wilaya de Tizi Ouzou · Algérie</span>
      </div>
    </section>
  );
}
