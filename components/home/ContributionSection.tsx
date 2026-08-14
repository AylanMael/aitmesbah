import { contributionTypes } from "@/data/home";

export default function ContributionSection() {
  return (
    <section id="contribuer" className="contribution section-pad">
      <div>
        <p className="eyebrow">Notre mémoire vous appartient</p>
        <h2>
          Vous avez une photo,
          <br />
          un document, <em>une histoire ?</em>
        </h2>
        <p>
          Contribuez à enrichir la mémoire collective d’Aït Mesbah. Chaque
          témoignage sera étudié et valorisé avec soin.
        </p>
      </div>
      <div className="contribution-info">
        <p>Vous pourrez bientôt contribuer avec :</p>
        <ul>
          {contributionTypes.map((type) => (
            <li key={type.label}>{type.label}</li>
          ))}
        </ul>
        <p>Le formulaire de contribution sera bientôt disponible.</p>
      </div>
    </section>
  );
}
