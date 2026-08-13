import { events } from "@/data/home";

export default function AgendaSection() {
  return (
    <section id="agenda" className="agenda section-pad">
      <div>
        <p className="eyebrow light">À vos agendas</p>
        <h2>
          Les prochains
          <br />
          <em>rendez-vous</em>
        </h2>
        <p className="agenda-intro">
          Fêtes, rencontres sportives, actions associatives et temps forts de
          la diaspora.
        </p>
        <a className="primary pale" href="#">
          Voir tout l’agenda →
        </a>
      </div>
      <div className="event-list">
        {events.map((e) => (
          <article key={e.title}>
            <div className="date">
              <b>—</b>
              <span>DATE</span>
            </div>
            <div>
              <small>{e.kind}</small>
              <h3>{e.title}</h3>
              <p>{e.meta}</p>
            </div>
            <span className="event-arrow">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}
