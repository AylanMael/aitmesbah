"use client";

import { type FormEvent, useEffect, useState } from "react";
import EditorialBodyEditor from "@/components/editorial/EditorialBodyEditor";
import {useDraftWorkspace} from "./DraftWorkspace";
import "./contribution-draft.css";

type Props = {
  busy: boolean;
  categories: readonly string[];
  labels: Record<string, string>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
};

export default function ContributionDraftForm({ busy, categories, labels, onSubmit }: Props) {
  const {draft, remember, retrying} = useDraftWorkspace();
  const [dirty, setDirty] = useState(Boolean(draft));
  const fields = draft ?? {title:"", summary:"", body:"", category:categories[0] ?? "", sensitivity:"ordinary"};
  function update(field: keyof typeof fields, value: string) {
    remember({...fields, [field]:value});
    setDirty(true);
  }
  useEffect(() => {
    if (!busy) return;
    const guardLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.download || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      if (busy) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    document.addEventListener("click", guardLink, true);
    return () => {
      document.removeEventListener("click", guardLink, true);
    };
  }, [busy]);

  return <form className="crm-draft-form" onChange={() => setDirty(true)} onSubmit={async event => {if(await onSubmit(event))setDirty(false);}} aria-busy={busy}>
    <p className="crm-draft-reassurance">Votre brouillon reste privé. Sa création ne l’envoie pas en relecture et ne le publie pas.</p>
    {draft&&<p role="status">Votre saisie est conservée temporairement pendant la navigation dans le CRM. Elle n’est pas encore enregistrée sur le serveur. Ne fermez pas cet onglet.</p>}
    {retrying&&<p role="alert">La réponse de création n’est pas confirmée. Les champs restent figés pour reprendre exactement le même envoi. Après confirmation, vous pourrez modifier le brouillon dans sa fiche.</p>}
    <fieldset disabled={busy || retrying}><legend>1 · Que souhaitez-vous partager ?</legend>
      <label>Nature de la contribution<select name="category" value={fields.category} onChange={event=>update("category",event.target.value)}>{categories.map(value => <option key={value} value={value}>{labels[value]}</option>)}</select></label>
      <label>Titre<input name="title" value={fields.title} onChange={event=>update("title",event.target.value)} required maxLength={160} placeholder="Ex. Une photographie de la poterie au village" /></label>
      <label>En quelques mots<textarea name="summary" value={fields.summary} onChange={event=>update("summary",event.target.value)} required maxLength={2000} placeholder="De quoi s’agit-il ? Pourquoi ce document ou ce récit est-il intéressant ?" /></label>
    </fieldset>
    <fieldset disabled={busy || retrying}><legend>2 · Racontez ce que vous savez</legend>
      <p>Indiquez le contexte, les dates ou les lieux connus. Signalez vos incertitudes plutôt que de compléter au hasard. Pour une photo ou une archive, une description suffit pour commencer.</p>
      <div className="crm-editor-label"><p>Texte de la contribution · obligatoire</p><EditorialBodyEditor required defaultValue={fields.body} onValueChange={value=>update("body",value)} /></div>
      <p>Après création, vous pourrez ajouter vos photos et documents directement dans la fiche du brouillon, puis compléter ses informations documentaires.</p>
    </fieldset>
    <fieldset disabled={busy || retrying}><legend>3 · Signalez les précautions nécessaires</legend>
      <label>Ce contenu demande-t-il une attention particulière ?<select name="sensitivity" value={fields.sensitivity} onChange={event=>update("sensitivity",event.target.value)}>
        <option value="ordinary">Pas de sensibilité particulière identifiée</option>
        <option value="sensitive">Sensible — vie privée ou sujet délicat</option>
        <option value="highly_sensitive">Très sensible — risque important pour une personne</option>
      </select></label>
      <p>Ce choix ne vaut pas autorisation de diffusion. L’équipe devra vérifier la provenance, les droits et les consentements nécessaires.</p>
    </fieldset>
    <div className="crm-draft-save"><span role="status">{busy ? "Enregistrement du brouillon…" : retrying ? "Confirmation à récupérer" : dirty ? "Modifications non enregistrées" : "Les champs seront enregistrés lors de la création."}</span><button type="submit" disabled={busy}>{busy ? "Création en cours…" : retrying ? "Réessayer la même tentative" : "Créer mon brouillon et ouvrir sa fiche"}</button></div>
  </form>;
}
