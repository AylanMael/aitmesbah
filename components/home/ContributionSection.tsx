import ContributionFormClient from "@/components/home/ContributionFormClient";

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
      <ContributionFormClient />
    </section>
  );
}
