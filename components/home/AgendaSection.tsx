import Link from "next/link";

export default function AgendaSection() {
  return (
    <section id="agenda" className="agenda section-pad">
      <div className="agenda-heading">
        <p className="eyebrow light">À vos agendas</p>
        <h2>Les prochains rendez-vous</h2>
        <p className="agenda-intro">
          Réunions, rencontres sportives, initiatives culturelles et temps
          forts de la vie collective.
        </p>
        <Link className="agenda-all-link" href="/agenda">
          Voir tout l’agenda <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="agenda-board">
        <div className="agenda-status">
          <span aria-hidden="true">—</span>
          <div>
            <small>Agenda du village</small>
            <strong>Aucun rendez-vous confirmé pour le moment</strong>
          </div>
        </div>
        <p>
          Les prochains événements seront publiés ici après confirmation de
          leur date, de leur lieu et de leur organisation.
        </p>
        <ul aria-label="Catégories de l’agenda">
          <li><span>01</span>Vie collective</li>
          <li><span>02</span>Sport</li>
          <li><span>03</span>Culture</li>
        </ul>
        <Link className="agenda-submit-link" href="/contribuer">
          Proposer un événement <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
