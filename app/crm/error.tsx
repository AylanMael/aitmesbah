"use client";

import Link from "next/link";

export default function CrmError({ reset }: { reset: () => void }) {
  return <main className="crm-shell">
    <p className="crm-kicker">Chargement interrompu</p>
    <h1>Votre espace n’a pas pu être chargé.</h1>
    <p className="crm-notice" role="alert">Nous ne pouvons pas confirmer l’état de vos dossiers pour le moment. Cela ne signifie pas que la file est vide. Vos contenus n’ont pas été modifiés par cette tentative de lecture.</p>
    <div className="crm-account-form"><button type="button" onClick={reset}>Réessayer le chargement</button></div>
    <Link className="crm-back" href="/crm">Retour au tableau de bord →</Link>
  </main>;
}
