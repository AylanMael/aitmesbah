import MotionControlClient from "./MotionControlClient";

export default function HeroSection() {
  return (
    <section id="accueil" className="hero">
      <div className="mountains">
        <i />
        <i />
        <i />
      </div>
      <div className="hero-sun" />
      <div className="grain" />
      <div className="hero-index">
        <span>Aït Douala</span>
        <i />
        <span>Tizi Ouzou · Algérie</span>
      </div>
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
          Un village, des générations, une histoire à transmettre. Bienvenue
          dans l’espace numérique de celles et ceux qui font vivre Aït Mesbah,
          ici et ailleurs.
        </p>
        <div className="hero-buttons">
          <a href="#decouvrir" className="primary">
            Découvrir le village <b aria-hidden="true">↗</b>
          </a>
          <a href="#memoire" className="ghost">
            Explorer notre mémoire
          </a>
        </div>
      </div>
      <MotionControlClient />
      <div className="hero-seal" aria-hidden="true">
        <span>ⵣ</span>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path
              id="circle"
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text>
            <textPath href="#circle">AÏT MESBAH • TERRE • MÉMOIRE • </textPath>
          </text>
        </svg>
      </div>
      <div className="hero-note">
        <span aria-hidden="true">▧</span>
        <div>
          <b>Votre image, notre paysage</b>
          <small>Vue authentique d’Aït Mesbah à intégrer</small>
        </div>
      </div>
    </section>
  );
}
