import { news } from "@/data/home";

export default function NewsSection() {
  return (
    <section id="vivre" className="news section-pad">
      <div className="section-head light-head">
        <div>
          <p className="eyebrow">Aujourd’hui à Aït Mesbah</p>
          <h2>
            La vie du <em>village</em>
          </h2>
        </div>
        <a className="text-link" href="#">
          Toutes les actualités →
        </a>
      </div>
      <div className="news-grid">
        {news.map((n, i) => (
          <article className="news-card" key={n.title}>
            <div className={`news-image ${n.tone}`}>
              <span>Photographie à intégrer</span>
              <b>0{i + 1}</b>
            </div>
            <div>
              <p className="meta">
                <span>{n.tag}</span> · DATE À COMPLÉTER
              </p>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
              <a href="#">Lire la suite →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
