import { Fragment } from "react";
import { voiceCategories } from "@/data/home";

export default function VoicesSection() {
  return (
    <section className="voices section-pad">
      <p className="eyebrow">Paroles d’Aït Mesbah</p>
      <blockquote>
        « Notre village vit dans les souvenirs de ceux qui sont partis, dans les
        gestes de ceux qui y restent, et dans les rêves de ceux qui reviendront. »
      </blockquote>
      <p className="quote-note">
        Texte éditorial provisoire — à remplacer par un témoignage authentique
      </p>
      <div className="voice-types">
        {voiceCategories.map((category, index) => (
          <Fragment key={category}>
            <span>{category}</span>
            {index < voiceCategories.length - 1 && <i />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
