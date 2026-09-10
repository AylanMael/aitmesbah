"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import EditorialBodyEditor from "@/components/editorial/EditorialBodyEditor";
type Contribution = {
  contributionId: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  sensitivity: string;
  authorUid: string;
  organizationId: string | null;
  sourceStatus: string;
  rightsStatus: string;
  consentStatus: string;
  completenessStatus: string;
  currentVersion: number;
  assignedReviewerUids: string[];
  version: number;
  editorialMetadata: {
    archiveDate: string | null;
    creator: string | null;
    location: string | null;
    provenance: string | null;
    rightsCredit: string | null;
    tags: string[];
  };
};
type EditorialAsset = { assetId: string; safeFileName: string; status: string; detectedMimeType: string | null };
const categories = [
  "photographs_archives",
  "testimonies_stories",
  "history_memory",
  "places_heritage",
  "events_village_life",
  "craft_knowhow",
  "diaspora",
  "documentary_correction",
];
const categoryLabels: Record<string, string> = {
  photographs_archives: "Photographies & archives",
  testimonies_stories: "Témoignages & récits",
  history_memory: "Histoire & mémoire",
  places_heritage: "Lieux & patrimoine",
  events_village_life: "Agenda & vie du village",
  craft_knowhow: "Artisanat & savoir-faire",
  diaspora: "Diaspora",
  documentary_correction: "Correction documentaire",
};
const publicationKinds: Record<string, Array<[string, string]>> = {
  photographs_archives: [["archive", "Archive"], ["photo", "Photographie"]],
  testimonies_stories: [["article", "Récit"]], history_memory: [["article", "Article"], ["archive", "Archive"]],
  places_heritage: [["article", "Article"], ["photo", "Photographie"]], events_village_life: [["news", "Nouvelle"]],
  craft_knowhow: [["article", "Article"], ["photo", "Photographie"]], diaspora: [["article", "Article"], ["news", "Nouvelle"]],
};
const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  completeness_review: "Contrôle de complétude",
  rights_review: "Contrôle documentaire",
  editorial_review: "Relecture éditoriale",
  changes_requested: "Corrections demandées",
  approved: "Approuvé",
  rejected: "Refusé",
  withdrawn: "Retiré",
  published: "Publié",
  contested: "Contesté",
  unpublished: "Dépublié",
};
const checkLabels: Record<string, string> = {
  unknown: "À établir",
  incomplete: "Incomplet",
  pending: "En attente",
  declared: "Déclaré",
  verified: "Vérifié",
  complete: "Complet",
  cleared: "Autorisé",
  not_applicable: "Sans objet",
  granted: "Accordé",
  not_required: "Non requis",
};
async function requestJson(url: string, method = "GET", body?: unknown) {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    const response = await fetch("/api/auth/csrf", { cache: "no-store" }),
      { csrfToken } = await response.json();
    headers["Content-Type"] = "application/json";
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    }),
    value = await response.json();
  if (!response.ok) throw new Error(value.error ?? "Opération impossible.");
  return value;
}
const empty = {
  value: null,
  field: null,
  reviewerUid: null,
  versionNumber: null,
  body: null,
  title: null,
  summary: null,
};
function Check({ label, value }: { label: string; value: string }) {
  const ready = [
    "verified",
    "complete",
    "cleared",
    "not_applicable",
    "granted",
    "not_required",
  ].includes(value);
  return (
    <div className={ready ? "is-ready" : ""}>
      <span>{ready ? "✓" : "·"}</span>
      <small>{label}</small>
      <strong>{checkLabels[value] ?? value}</strong>
    </div>
  );
}
export function ContributionManager({
  initial,
  nextCursor,
  permissions,
  uid,
  mode = "list",
}: {
  initial: Contribution[];
  nextCursor: string | null;
  permissions: readonly string[];
  uid: string;
  mode?: "list" | "detail";
}) {
  const [items, setItems] = useState(initial),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [assets, setAssets] = useState<Record<string, EditorialAsset[]>>({}),
    [selectedPrimary, setSelectedPrimary] = useState<Record<string, string>>({}),
    [operations, setOperations] = useState<Record<string, string>>({});
  const canDraft = permissions.includes("draft.self.manage"),
    canAssign = permissions.includes("editorial.assign"),
    canPublish = permissions.includes("editorial.ordinary.publish");
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = event.currentTarget,
      data = new FormData(form);
    try {
      const created = await requestJson("/api/crm/contributions", "POST", {
        title: data.get("title"),
        summary: data.get("summary"),
        category: data.get("category"),
        sensitivity: data.get("sensitivity"),
        body: data.get("body"),
        organizationId: null,
        organizationRepresentation: null,
      });
      setItems((current) => [created, ...current]);
      form.reset();
      setNotice("Brouillon privé créé. Rien n’a été publié.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }
  async function act(item: Contribution, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget),
      operation = String(data.get("operation")),
      reason = String(data.get("reason") || "Décision interne motivée"),
      changesEventPublication = ["publish", "update_publication"].includes(
        operation,
      ),
      changesContentPublication = operation === "publish_content";
    try {
      const updated = await requestJson(
        `/api/crm/contributions/${item.contributionId}`,
        "PATCH",
        {
          operation,
          expectedVersion: item.version,
          reason,
          ...empty,
          value: data.get("value"),
          field: data.get("field"),
          reviewerUid: data.get("reviewerUid"),
          versionNumber: item.currentVersion,
          body: data.get("body"),
          title: null,
          summary: null,
          publication: changesEventPublication
            ? {
                startsAt: data.get("startsAt"),
                endsAt: data.get("endsAt"),
                location: data.get("location"),
                organizer: data.get("organizer"),
                eventCategory: data.get("eventCategory"),
                eventStatus: data.get("eventStatus"),
                reason,
              }
            : changesContentPublication
              ? { kind: data.get("publicationKind"), primaryAssetId: data.get("primaryAssetId"), reason }
              : null,
          metadata: operation === "editorial_metadata" ? {
            archiveDate: data.get("archiveDate"),
            creator: data.get("creator"),
            location: data.get("metadataLocation"),
            provenance: data.get("provenance"),
            rightsCredit: data.get("rightsCredit"),
            tags: data.get("tags"),
          } : null,
        },
      );
      setItems((current) =>
        current.map((value) =>
          value.contributionId === updated.contributionId ? updated : value,
        ),
      );
      setNotice(
        operation === "publish"
          ? "Événement publié dans l’agenda."
          : operation === "publish_content"
            ? "Contenu publié sur le site. Son adresse publique restera stable."
          : operation === "update_publication"
            ? "Publication mise à jour et auditée."
            : ["unpublish", "unpublish_content"].includes(operation)
              ? "Publication retirée de l’agenda sans supprimer son historique."
              : "Opération enregistrée et auditée. Aucune publication publique.",
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }
  async function loadAssets(contributionId: string) {
    try {
      const result = await requestJson(`/api/crm/contributions/${contributionId}/assets`);
      setAssets((current) => ({ ...current, [contributionId]: result.assets.filter((asset: EditorialAsset) => asset.status === "validated") }));
      setNotice("Médias validés chargés. Vous pouvez choisir l’image ou le document principal.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Impossible de charger les médias.");
    }
  }
  function chooseOperation(contributionId: string, operation: string) {
    setOperations((current) => ({ ...current, [contributionId]: operation }));
    if (operation === "publish_content" && !assets[contributionId]) void loadAssets(contributionId);
  }
  return (
    <div className={`crm-contribution-manager is-${mode}`}>
      {notice && (
        <p className="crm-notice" role="status">
          {notice}
        </p>
      )}
      {canDraft && (
        <details className="crm-create-drawer">
          <summary>
            <span>
              <small>Nouveau dossier</small>
              <strong>Créer un brouillon éditorial</strong>
            </span>
            <i>＋</i>
          </summary>
          <div className="crm-create-drawer-body">
            <p>
              Commencez avec l’essentiel. Le dossier restera privé jusqu’à une
              décision explicite de publication.
            </p>
            <form className="crm-account-form" onSubmit={create}>
              <label>
                Titre
                <input name="title" required maxLength={160} />
              </label>
              <label>
                Résumé
                <textarea name="summary" required maxLength={2000} />
              </label>
              <label>
                Catégorie
                <select name="category">
                  {categories.map((x) => (
                    <option key={x} value={x}>
                      {categoryLabels[x]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sensibilité
                <select name="sensitivity">
                  <option value="ordinary">Ordinaire</option>
                  <option value="sensitive">Sensible</option>
                  <option value="highly_sensitive">Hautement sensible</option>
                </select>
              </label>
              <label className="crm-editor-label">
                Texte de la contribution
                <EditorialBodyEditor required />
              </label>
              <button disabled={busy}>Créer le brouillon privé</button>
            </form>
          </div>
        </details>
      )}
      <section className="crm-panel crm-editorial-queue">
        <div className="crm-panel-title">
          <div>
            <p className="crm-kicker">File de travail</p>
            <h2>Dossiers autorisés</h2>
          </div>
          <span>
            {items.length} {items.length > 1 ? "dossiers" : "dossier"}
          </span>
        </div>
        {items.length === 0 ? (
          <div className="crm-empty-state">
            <span>◎</span>
            <strong>Aucun dossier à traiter</strong>
            <p>
              Les nouvelles contributions apparaîtront ici selon vos
              permissions.
            </p>
          </div>
        ) : (
          <ul className="crm-account-list">
            {items.map((item) => {
              const operation = operations[item.contributionId] ?? "editorial_metadata";
              return (
              <li key={item.contributionId} className="crm-contribution-card">
                <header>
                  <div>
                    <small>
                      {categoryLabels[item.category] ?? item.category} · Version{" "}
                      {item.currentVersion}
                    </small>
                    <strong>{item.title}</strong>
                  </div>
                  <span data-status={item.status}>
                    {statusLabels[item.status] ?? item.status}
                  </span>
                </header>
                <p className="crm-contribution-summary">{item.summary}</p>
                <div className="crm-check-grid">
                  <Check label="Complétude" value={item.completenessStatus} />
                  <Check label="Provenance" value={item.sourceStatus} />
                  <Check label="Droits" value={item.rightsStatus} />
                  <Check label="Consentement" value={item.consentStatus} />
                </div>
                {item.sensitivity !== "ordinary" && (
                  <p className="crm-warning">
                    Dossier sensible — une double validation indépendante est
                    requise.
                  </p>
                )}
                {mode === "list" && <Link className="crm-open-record" href={`/crm/contributions/${item.contributionId}`}><span>Ouvrir la fiche complète</span><b aria-hidden="true">→</b></Link>}
                <details className="crm-action-drawer">
                  <summary>
                    <span>Examiner et traiter le dossier</span>
                    <i>＋</i>
                  </summary>
                  <form
                    className="crm-account-action"
                    onSubmit={(event) => act(item, event)}
                  >
                    <label>
                      Action à effectuer
                      <select name="operation" value={operation} onChange={(event) => chooseOperation(item.contributionId, event.target.value)}>
                        <option
                          value="submit"
                          disabled={item.authorUid !== uid}
                        >
                          Soumettre à la rédaction
                        </option>
                        <option
                          value="version"
                          disabled={item.authorUid !== uid}
                        >
                          Créer une nouvelle version
                        </option>
                        <option value="assign" disabled={!canAssign}>
                          Affecter à un relecteur
                        </option>
                        <option value="unassign" disabled={!canAssign}>
                          Retirer l’affectation
                        </option>
                        <option
                          value="completeness"
                          disabled={
                            !permissions.includes(
                              "editorial.completeness.review",
                            )
                          }
                        >
                          Contrôler la complétude
                        </option>
                        <option
                          value="documentary"
                          disabled={
                            !permissions.some(
                              (p) =>
                                p.startsWith("editorial.") &&
                                p.endsWith(".verify"),
                            )
                          }
                        >
                          Effectuer un contrôle documentaire
                        </option>
                        <option
                          value="decision"
                          disabled={
                            !permissions.includes("review.assigned.comment")
                          }
                        >
                          Enregistrer une décision de relecture
                        </option>
                        <option
                          value="approve"
                          disabled={
                            !permissions.includes(
                              "editorial.ordinary.approve",
                            ) || item.sensitivity !== "ordinary"
                          }
                        >
                          Approuver en interne
                        </option>
                        <option value="editorial_metadata">
                          Enrichir la fiche documentaire
                        </option>
                        <option
                          value="publish"
                          disabled={
                            !canPublish ||
                            item.status !== "approved" ||
                            item.category !== "events_village_life"
                          }
                        >
                          Publier dans l’agenda
                        </option>
                        <option
                          value="publish_content"
                          disabled={
                            !canPublish ||
                            item.status !== "approved" ||
                            item.category === "documentary_correction"
                          }
                        >
                          Publier sur le site
                        </option>
                        <option
                          value="update_publication"
                          disabled={!canPublish || item.status !== "published"}
                        >
                          Modifier, reporter ou annuler
                        </option>
                        <option
                          value="unpublish"
                          disabled={!canPublish || item.status !== "published"}
                        >
                          Dépublier de l’agenda
                        </option>
                        <option
                          value="unpublish_content"
                          disabled={!canPublish || item.status !== "published"}
                        >
                          Dépublier du site
                        </option>
                      </select>
                    </label>
                    <p className="crm-action-context">{operation === "publish_content" ? "Préparez la forme publique et son média principal." : operation === "publish" || operation === "update_publication" ? "Renseignez les informations qui apparaîtront dans l’agenda." : operation === "editorial_metadata" ? "Décrivez la pièce pour préserver son contexte et sa provenance." : operation === "version" ? "Créez une nouvelle version structurée sans écraser la précédente." : "Cette décision sera enregistrée dans le journal d’audit."}</p>
                    <label hidden={operation !== "documentary"}>
                      Domaine contrôlé
                      <select name="field">
                        <option value="sourceStatus">Provenance</option>
                        <option value="rightsStatus">Droits</option>
                        <option value="consentStatus">Consentement</option>
                      </select>
                    </label>
                    <label hidden={!['documentary','completeness','decision'].includes(operation)}>
                      Résultat
                      <select name="value">
                        {operation === "completeness" && <><option value="complete">Complet</option><option value="incomplete">Incomplet — corrections nécessaires</option></>}
                        {operation === "decision" && <><option value="approve">Avis favorable</option><option value="changes_requested">Corrections demandées</option><option value="reject">Avis défavorable</option></>}
                        {operation === "documentary" && <><option value="verified">Vérifié</option><option value="declared">Déclaré, à vérifier</option><option value="unknown">À établir</option><option value="cleared">Diffusion autorisée</option><option value="not_applicable">Sans objet</option><option value="granted">Consentement accordé</option><option value="not_required">Consentement non requis</option><option value="pending">En attente</option><option value="withdrawn">Consentement retiré</option></>}
                      </select>
                    </label>
                    <label hidden={!['assign','unassign'].includes(operation)}>
                      UID du relecteur
                      <input name="reviewerUid" maxLength={128} />
                    </label>
                    <label className="crm-editor-label" hidden={operation !== "version"}>
                      Nouvelle version textuelle
                      <EditorialBodyEditor />
                    </label>
                    <fieldset
                      className="crm-publication-fields"
                      hidden={!['publish','update_publication'].includes(operation)}
                      disabled={
                        !canPublish ||
                        !["approved", "published"].includes(item.status) ||
                        item.category !== "events_village_life"
                      }
                    >
                      <legend>Publication dans l’agenda</legend>
                      <label>
                        Début
                        <input name="startsAt" type="datetime-local" />
                      </label>
                      <label>
                        Fin facultative
                        <input name="endsAt" type="datetime-local" />
                      </label>
                      <label>
                        Lieu
                        <input name="location" maxLength={180} />
                      </label>
                      <label>
                        Organisateur
                        <input name="organizer" maxLength={180} />
                      </label>
                      <label>
                        Univers
                        <select name="eventCategory">
                          <option value="collective">Vie collective</option>
                          <option value="culture">Culture</option>
                          <option value="sport">Sport</option>
                          <option value="solidarity">Solidarité</option>
                        </select>
                      </label>
                      <label>
                        État du rendez-vous
                        <select name="eventStatus">
                          <option value="scheduled">Programmé</option>
                          <option value="postponed">Reporté</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </label>
                    </fieldset>
                    <fieldset
                      className="crm-publication-fields"
                      hidden={operation !== "publish_content"}
                      disabled={
                        !canPublish ||
                        item.status !== "approved" ||
                        item.category === "documentary_correction"
                      }
                    >
                      <legend>Publication éditoriale</legend>
                      <div className="crm-publication-toolbar">
                        <button type="button" onClick={() => loadAssets(item.contributionId)}>
                          Charger les médias validés
                        </button>
                        <a href={`/crm/contributions/${item.contributionId}/apercu${selectedPrimary[item.contributionId] ? `?media=${encodeURIComponent(selectedPrimary[item.contributionId])}` : ""}`} target="_blank" rel="noreferrer">
                          Aperçu privé ↗
                        </a>
                      </div>
                      <label>
                        Présentation publique
                        <select name="publicationKind">
                          {(publicationKinds[item.category] ?? []).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                        </select>
                      </label>
                      <div className="crm-media-picker"><span>Média principal</span><div><label className={!selectedPrimary[item.contributionId] ? "is-selected" : ""}><input type="radio" name="primaryAssetId" value="" checked={!selectedPrimary[item.contributionId]} onChange={() => setSelectedPrimary((current) => ({ ...current, [item.contributionId]: "" }))}/><i>∅</i><strong>Sans média</strong></label>{(assets[item.contributionId] ?? []).map(asset => { const selected = selectedPrimary[item.contributionId] === asset.assetId; return <label className={selected ? "is-selected" : ""} key={asset.assetId}><input type="radio" name="primaryAssetId" value={asset.assetId} checked={selected} onChange={() => setSelectedPrimary((current) => ({ ...current, [item.contributionId]: asset.assetId }))}/>{asset.detectedMimeType?.startsWith("image/") ? <img src={`/api/crm/contributions/${item.contributionId}/assets/${asset.assetId}/download`} alt=""/> : <i>PDF</i>}<strong>{asset.safeFileName}</strong><small>{asset.detectedMimeType?.startsWith("image/") ? "Image validée" : "Document validé"}</small></label>;})}</div>{assets[item.contributionId]?.length === 0 && <p>Aucun média validé. Validez d’abord un fichier dans « Fichiers & droits ».</p>}</div>
                      <p>
                        Le titre, le résumé et la version approuvée composent la
                        page publique. Une archive ou une photographie exige un
                        fichier préalablement validé.
                      </p>
                    </fieldset>
                    <fieldset className="crm-publication-fields crm-metadata-fields" hidden={operation !== "editorial_metadata"}>
                      <legend>Fiche documentaire</legend>
                      <label>Date ou période<input name="archiveDate" defaultValue={item.editorialMetadata?.archiveDate ?? ""} maxLength={80} placeholder="1892, années 1990…" /></label>
                      <label>Auteur ou producteur<input name="creator" defaultValue={item.editorialMetadata?.creator ?? ""} maxLength={160} /></label>
                      <label>Lieu<input name="metadataLocation" defaultValue={item.editorialMetadata?.location ?? ""} maxLength={160} /></label>
                      <label>Provenance<input name="provenance" defaultValue={item.editorialMetadata?.provenance ?? ""} maxLength={300} /></label>
                      <label>Crédit et droits<input name="rightsCredit" defaultValue={item.editorialMetadata?.rightsCredit ?? ""} maxLength={300} /></label>
                      <label>Mots-clés<input name="tags" defaultValue={item.editorialMetadata?.tags?.join(", ") ?? ""} maxLength={500} placeholder="école, quartier, diaspora…" /></label>
                    </fieldset>
                    <label>
                      Motif ou commentaire
                      <textarea name="reason" required maxLength={500} />
                    </label>
                    <button disabled={busy}>Enregistrer cette action</button>
                  </form>
                </details>
              </li>
            );})}
          </ul>
        )}
        {nextCursor && (
          <a
            className="crm-next"
            href={`?cursor=${encodeURIComponent(nextCursor)}`}
          >
            Afficher la page suivante →
          </a>
        )}
      </section>
    </div>
  );
}
