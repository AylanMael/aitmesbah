"use client";

import Link from "next/link";

export default function ContributionRecordError({reset}: {reset: () => void}) {
  return <main className="crm-shell" role="alert">
    <p className="crm-kicker">Fiche de contribution</p>
    <h1>La fiche n’a pas pu être chargée</h1>
    <p>Un problème technique empêche son affichage. Vous pouvez réessayer ou revenir à la liste des contributions.</p>
    <button type="button" onClick={reset}>Réessayer</button>
    <p><Link href="/crm/contributions">← Retour aux contributions</Link></p>
  </main>;
}
