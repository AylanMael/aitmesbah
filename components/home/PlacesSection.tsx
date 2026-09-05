export default function PlacesSection() {
  return (
    <section className="places section-pad">
      <div className="section-head light-head">
        <div>
          <p className="eyebrow">Lieux et patrimoine</p>
          <h2>Un inventaire du village à construire</h2>
        </div>
        <p>
          Cette rubrique présentera progressivement les lieux, les chemins, les fontaines, les places et les paysages qui participent à l’identité d’Aït Mesbah.
        </p>
      </div>
      <div className="places-editorial">
        <article><span>01</span><h3>Les chemins</h3><p>Retrouver les passages, les sentiers et les itinéraires qui relient le village à son territoire.</p></article>
        <article><span>02</span><h3>L’eau & la pierre</h3><p>Documenter les fontaines, les places et les architectures qui portent la mémoire quotidienne.</p></article>
        <article><span>03</span><h3>Les paysages</h3><p>Préserver les noms, les usages et les récits attachés aux reliefs qui entourent Aït Mesbah.</p></article>
      </div>
      <p className="editorial-note">Inventaire en préparation · publication après vérification des sources et des droits</p>
    </section>
  );
}
