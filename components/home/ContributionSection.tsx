import Link from "next/link";
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
        <p>Préparer une contribution utile :</p>
        <ul>
          {contributionTypes.map((type) => (
            <li key={type.label}>{type.label}</li>
          ))}
        </ul>
        <p>Les dépôts ne sont pas encore ouverts. La page dédiée explique les droits, le consentement et les informations à réunir en amont.</p>
        <Link className="text-link" href="/contribuer">
          Découvrir les modalités de contribution <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
