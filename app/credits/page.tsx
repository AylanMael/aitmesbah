import LegalPage from "@/components/layout/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crédits — Aït Mesbah",
  description: "Crédits éditoriaux et techniques du site Aït Mesbah.",
};

export default function CreditsPage() {
  return (
    <LegalPage title="Crédits">
      <section>
        <h2>Projet éditorial</h2>
        <ul>
          <li>Nom du projet : Aït Mesbah</li>
          <li>Nature : projet communautaire non commercial</li>
          <li>Édition : collectif informel Aït Mesbah</li>
          <li>Coordination éditoriale : Aylan H.</li>
          <li>
            Contact : <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Conception et développement</h2>
        <p>
          La conception, le développement et l’intégration du site sont
          réalisés dans le cadre du projet communautaire Aït Mesbah.
        </p>
      </section>

      <section>
        <h2>Photographies et archives</h2>
        <p>
          Les photographies et archives définitives seront créditées
          individuellement. Leur publication devra être autorisée par leurs
          auteurs, propriétaires ou ayants droit. Les éléments encore
          présentés comme emplacements provisoires ne constituent pas des
          archives publiées.
        </p>
      </section>

      <section>
        <h2>Textes et témoignages</h2>
        <p>
          Les témoignages devront être publiés avec l’accord des personnes
          concernées. Les récits historiques devront préciser leurs sources
          lorsque celles-ci sont disponibles. Toute demande de correction ou
          d’attribution peut être envoyée à{" "}
          <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>.
        </p>
      </section>

      <section>
        <h2>Technologies</h2>
        <ul>
          <li>Next.js</li>
          <li>React</li>
          <li>Firebase App Hosting</li>
          <li>Google Cloud</li>
        </ul>
      </section>
    </LegalPage>
  );
}
