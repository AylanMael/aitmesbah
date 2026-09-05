"use client";

import { FormEvent, useState } from "react";

const categories = [
  ["photographs_archives", "Photographie ou archive"], ["testimonies_stories", "Témoignage ou récit"],
  ["history_memory", "Histoire et mémoire"], ["places_heritage", "Lieu ou patrimoine"],
  ["events_village_life", "Événement ou vie du village"], ["craft_knowhow", "Savoir-faire"],
  ["diaspora", "Diaspora"], ["documentary_correction", "Correction documentaire"],
] as const;

async function csrfToken() {
  const response = await fetch("/api/auth/csrf", { cache: "no-store" });
  if (!response.ok) throw new Error("Le formulaire est momentanément indisponible.");
  return (await response.json()).csrfToken as string;
}

export default function ContributionIntakeForm() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice(""); setReference("");
    const form = event.currentTarget;
    try {
      const body = new FormData(form);
      body.set("consent", "yes");
      const response = await fetch("/api/contributions/public", { method: "POST", headers: { "X-CSRF-Token": await csrfToken() }, body });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error ?? "L’envoi n’a pas abouti.");
      form.reset(); setReference(value.reference); setNotice("Votre contribution a bien été déposée. Elle est maintenant en attente de vérification.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "L’envoi n’a pas abouti."); }
    finally { setBusy(false); }
  }

  if (reference) return <section className="contribute-live-form" id="envoyer"><div><p className="eyebrow light">Contribution reçue</p><h2>Merci pour votre confiance</h2><p>Rien ne sera publié sans vérification préalable.</p></div><div className="contribute-success" role="status"><span aria-hidden="true">✓</span><h3>Dépôt enregistré</h3><p>{notice}</p><small>Référence : {reference}</small><button type="button" onClick={() => { setReference(""); setNotice(""); }}>Envoyer une autre contribution</button></div></section>;

  return <section className="contribute-live-form" id="envoyer"><div><p className="eyebrow light">Ouvert à toutes et à tous</p><h2>Transmettre une contribution</h2><p>Vous pouvez envoyer un récit et joindre jusqu’à quatre photographies ou documents. Tous les fichiers restent privés jusqu’à leur vérification.</p></div><form onSubmit={submit} aria-busy={busy}><label>Votre nom<input name="name" required maxLength={120} autoComplete="name" /></label><label>Votre adresse électronique<input name="email" type="email" required maxLength={254} autoComplete="email" /></label><label>Nature de la contribution<select name="category" required>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Sensibilité<select name="sensitivity" required><option value="ordinary">Contenu ordinaire</option><option value="sensitive">Contenu personnel ou sensible</option><option value="highly_sensitive">Contenu très sensible</option></select></label><label>Titre<input name="title" required minLength={3} maxLength={160} placeholder="Un titre clair et précis" /></label><label>Résumé<textarea name="summary" required minLength={10} maxLength={2000} rows={3} placeholder="En quelques phrases, que souhaitez-vous partager ?" /></label><label>Votre contribution<textarea name="body" required minLength={20} maxLength={20000} rows={8} placeholder="Décrivez le contexte, les dates, les lieux, les personnes ou les sources connues…" /></label><label className="contribute-files">Photos ou documents<input name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" /><small>JPG, PNG, WebP ou PDF. Jusqu’à 4 fichiers, 15 Mo par image et 25 Mo par PDF, 26 Mo au total.</small></label><label className="contribute-honeypot" aria-hidden="true">Site internet<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label><label className="contribute-consent"><input type="checkbox" required /><span>Je confirme être autorisé à transmettre ces éléments et j’accepte qu’ils soient conservés de manière privée afin d’être examinés. Je comprends qu’aucune publication n’est automatique.</span></label>{notice && <p className="contribute-form-error" role="alert">{notice}</p>}<button className="primary" disabled={busy}>{busy ? "Transmission en cours…" : "Transmettre pour vérification"}<span aria-hidden="true">↗</span></button></form></section>;
}
