export default function AgendaSection() {
  return (
    <section id="agenda" className="agenda section-pad">
      <div>
        <p className="eyebrow light">À vos agendas</p>
        <h2>Agenda</h2>
        <p className="agenda-intro">
          Fêtes, rencontres sportives, actions associatives et temps forts de
          la diaspora.
        </p>
      </div>
      <div className="section-empty light">
        <p>Aucun événement n’est actuellement annoncé.</p>
        <p>Les prochains rendez-vous du village seront publiés ici après confirmation de leur date, de leur lieu et de leur organisation.</p>
      </div>
    </section>
  );
}
