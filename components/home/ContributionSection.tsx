import Link from "next/link";
import { contributionTypes } from "@/data/home";

export default function ContributionSection() {
  return (
    <section id="contribuer" className="contribution section-pad">
      <span className="contribution-symbol" aria-hidden="true">ⵣ</span>
      <div className="contribution-heading">
        <p className="eyebrow">Notre mémoire vous appartient</p>
        <h2>
          Vous avez une photo,
          <br />
          un document, <em>une histoire ?</em>
        </h2>
        <p>
          Envoyez votre document avec quelques repères : un nom, un lieu, une date même approximative et ce que vous connaissez de son origine. Vous pouvez aussi signaler une erreur. Les contributions sont relues avant publication.
        </p>
        <ul>
          {contributionTypes.map((type) => (
            <li key={type.label}>{type.label}</li>
          ))}
        </ul>
        <Link className="contribution-action" href="/contribuer">
          <span>Partager une mémoire</span><b aria-hidden="true">↗</b>
        </Link>
      </div>
    </section>
  );
}
