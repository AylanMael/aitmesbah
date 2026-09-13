"use client";

import { useId, useState } from "react";

const url = "https://ait-mesbah.org/decouvrir";

export default function ShareDiscovery() {
  const inputId = useId();
  const [message, setMessage] = useState("");
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setManual(false);
      setMessage("Lien copié. Vous pouvez le coller dans votre message.");
    } catch {
      setManual(true);
      setMessage("La copie automatique n’est pas disponible. Sélectionnez le lien ci-dessous pour le copier.");
    }
  }

  async function share() {
    setBusy(true);
    setMessage("");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Aït Mesbah en cinq minutes", text: "Un premier regard sur notre village, sa mémoire et ses savoir-faire.", url });
      } else await copy();
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) await copy();
    } finally {
      setBusy(false);
    }
  }

  return <div className="journey-share">
    <p>À partager avec celles et ceux qui connaissent le village… ou qui ne l’ont pas encore découvert.</p>
    <div className="journey-share-actions">
      <button type="button" disabled={busy} onClick={share}>{busy ? "Ouverture…" : "Partager ce parcours"}<span aria-hidden="true">↗</span></button>
      <button type="button" disabled={busy} onClick={copy}>Copier le lien</button>
    </div>
    <p className="journey-share-status" role="status">{message}</p>
    {manual && <div className="journey-share-manual"><label htmlFor={inputId}>Lien du parcours</label><input id={inputId} readOnly value={url} onFocus={event => event.currentTarget.select()} /></div>}
  </div>;
}
