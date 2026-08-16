import LegalPage from "@/components/layout/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité — Aït Mesbah",
  description: "Informations sur la confidentialité du site Aït Mesbah.",
  alternates: {
    canonical: "/confidentialite",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Confidentialité">
      <section>
        <h2>État actuel du service</h2>
        <p>À la date du 15 août 2026 :</p>
        <ul>
          <li>aucun compte utilisateur n’est proposé ;</li>
          <li>aucun formulaire actif n’envoie de données ;</li>
          <li>aucune inscription à une newsletter n’est disponible ;</li>
          <li>aucune contribution n’est actuellement collectée depuis le site ;</li>
          <li>
            aucun outil de mesure d’audience n’est intentionnellement intégré.
          </li>
        </ul>
      </section>

      <section>
        <h2>Données techniques d’hébergement</h2>
        <p>
          L’hébergeur et les infrastructures techniques peuvent traiter des
          journaux nécessaires à la fourniture, à la sécurité et à la
          fiabilité du service. Ces traitements relèvent des services Google
          Cloud et Firebase. Davantage d’informations sont disponibles dans
          les{" "}
          <a href="https://firebase.google.com/terms" rel="noopener noreferrer" target="_blank">
            conditions Firebase<span className="sr-only"> (nouvel onglet)</span>
          </a>{" "}
          et la{" "}
          <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
            politique de confidentialité Google<span className="sr-only"> (nouvel onglet)</span>
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Cookies et traceurs</h2>
        <p>
          Aucun cookie publicitaire ni traceur de mesure d’audience n’est
          intentionnellement déposé par le site dans son état actuel. Cette
          indication n’exclut pas le traitement de données techniques par
          l’infrastructure nécessaire au fonctionnement, à la sécurité et à
          la fiabilité du service.
        </p>
      </section>

      <section>
        <h2>Évolutions futures</h2>
        <p>Cette page devra être mise à jour avant l’activation :</p>
        <ul>
          <li>d’un formulaire de contribution ;</li>
          <li>d’une newsletter ;</li>
          <li>de comptes utilisateurs ;</li>
          <li>de statistiques d’audience ;</li>
          <li>de cookies ou services tiers supplémentaires.</li>
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question relative à la confidentialité :{" "}
          <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
