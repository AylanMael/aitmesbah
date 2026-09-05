export default function NewsSection() {
  return (
    <section id="vivre" className="news section-pad">
      <div className="section-head light-head">
        <div>
          <p className="eyebrow">Aujourd’hui à Aït Mesbah</p>
          <h2>Actualités</h2>
        </div>
      </div>
      <div className="news-awaiting">
        <span aria-hidden="true">ⵣ</span>
        <div><p className="news-status">Le fil du village se prépare</p><p>Les informations locales, initiatives et nouvelles de la communauté seront publiées ici après validation éditoriale.</p></div>
        <a href="/contribuer">Proposer une actualité <b aria-hidden="true">↗</b></a>
      </div>
    </section>
  );
}
