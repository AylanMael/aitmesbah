import LegalPage from "@/components/layout/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Aït Mesbah",
  description: "Mentions légales du site communautaire Aït Mesbah.",
};

export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site ait-mesbah.com est un site communautaire non commercial
          édité par le collectif informel Aït Mesbah.
        </p>
        <ul>
          <li>Éditeur : Collectif informel Aït Mesbah</li>
          <li>
            Adresse éditoriale : Aït Mesbah, Aït Douala, wilaya de Tizi Ouzou,
            Algérie
          </li>
          <li>
            Courriel : <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>
          </li>
          <li>Directeur de publication : Aylan H.</li>
        </ul>
        <p>
          Le collectif Aït Mesbah est un collectif informel et ne constitue
          pas, à ce jour, une association déclarée ni une société.
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <ul>
          <li>Service : Firebase App Hosting</li>
          <li>Fournisseur : Google Cloud France</li>
          <li>Adresse : 8 rue de Londres, 75009 Paris, France</li>
        </ul>
        <p>
          Consultez les{" "}
          <a href="https://firebase.google.com/terms" rel="noreferrer" target="_blank">
            conditions Firebase
          </a>{" "}
          et les{" "}
          <a
            href="https://cloud.google.com/terms/google-entity"
            rel="noreferrer"
            target="_blank"
          >
            informations sur les entités contractantes Google Cloud
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Objet du site</h2>
        <p>Le site vise à :</p>
        <ul>
          <li>présenter Aït Mesbah ;</li>
          <li>transmettre sa mémoire ;</li>
          <li>valoriser son patrimoine, ses habitants et sa diaspora ;</li>
          <li>
            relayer ultérieurement des informations communautaires validées.
          </li>
        </ul>
      </section>

      <section>
        <h2>Responsabilité éditoriale</h2>
        <p>
          Les contenus historiques et communautaires ont vocation à être
          vérifiés et enrichis progressivement. Une erreur peut être signalée à{" "}
          <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>.
          Les contenus provisoires ne doivent pas être présentés comme des
          faits définitivement établis. Le site ne remplace aucune source
          administrative officielle.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, photographies, archives, illustrations et signes
          graphiques peuvent relever de titulaires différents. Les crédits
          propres à chaque contribution ou document doivent être respectés.
          Aucune licence générale de réutilisation n’est accordée en l’absence
          d’une mention explicite. Toute demande de reproduction doit être
          envoyée à{" "}
          <a href="mailto:contact@ait-mesbah.com">contact@ait-mesbah.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
