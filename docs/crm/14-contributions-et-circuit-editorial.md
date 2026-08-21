# Contributions et circuit éditorial

## Modèle et catégories

Une contribution privée contient : `contributionId`, `title`, `summary`, `category`, `status`, `sensitivity`, `authorUid`, `organizationId`, `organizationRepresentation`, `sourceStatus`, `rightsStatus`, `consentStatus`, `completenessStatus`, `currentVersion`, `assignedReviewerUids`, dates, auteurs techniques et `version`.

Les catégories harmonisées sont : photographies et archives, témoignages et récits, histoire et mémoire, lieux et patrimoine, événements et vie du village, artisanat et savoir-faire, diaspora, corrections ou compléments documentaires. Elles couvrent les formulations informatives de `/contribuer` sans modifier la page ni ouvrir la collecte.

## Contrôles documentaires

Sensibilité : `ordinary`, `sensitive`, `highly_sensitive`. Provenance : `unknown`, `declared`, `verified`. Droits : `unknown`, `pending`, `cleared`, `not_applicable`. Consentement : `not_required`, `pending`, `granted`, `withdrawn`. Complétude : `incomplete`, `complete`.

Le passage en revue éditoriale, l’approbation et la publication technique simulée exigent complétude, sources vérifiées, droits libérés ou non applicables et consentement accordé ou non requis. Fichiers justificatifs et contenus de mineurs restent différés.

## Workflow

États : `draft`, `submitted`, `completeness_review`, `rights_review`, `editorial_review`, `changes_requested`, `approved`, `rejected`, `withdrawn`, `published`, `contested`, `unpublished`.

Le chemin ordinaire suit brouillon, soumission, complétude, droits, revue éditoriale puis approbation. Chaque contrôle peut demander une correction ou refuser. Une correction crée une nouvelle version et repart en brouillon. Un contenu approuvé peut seulement être publié par une opération serveur future ; 8F ne publie rien réellement. Un contenu publié simulé peut être contesté ou dépublié. Retrait et contestation conservent versions, décisions et audit.

## Versions, attributions et décisions

Une version sous `contributions/{id}/versions/{versionId}` contient identifiant, numéro, contribution, corps figé, auteur, motif, date et empreinte SHA-256 locale. Elle est immuable et toute correction incrémente `currentVersion`, ce qui invalide les décisions antérieures.

Une attribution exige un compte actif, `review.assigned.read` et un UID différent de l’auteur. Une décision séparée contient contribution, version, relecteur, résultat, commentaire facultatif, rôle, organisation et date. Elle exige `review.assigned.comment`, la version courante et une attribution valide ; elle n’est jamais modifiée silencieusement.

Un contenu ordinaire exige une décision favorable. Un contenu sensible ou hautement sensible en exige deux, rendues par deux UID distincts, sur la même version, sans l’auteur. Une demande de correction ou un refus bloque l’approbation.

## Organisations, mandat et sécurité

Une contribution peut être individuelle ou associée à une organisation active. La représentation officielle d’un comité exige type `village_committee`, vérification, mandat `valid`, appartenance active et permission `committee.communication.prepare`. Une association ne donne aucun droit global et le cloisonnement 8E demeure.

Les collections `contributions`, versions, décisions et relectures sont totalement fermées aux SDK clients : aucune lecture, liste ou écriture. Les custom claims et la projection `organizationMemberships` ne sont pas utilisés. Storage reste fermé.

## Administration locale, audit et limites

La couche locale permet les brouillons fictifs, contrôles, soumission, attributions, corrections, versions, décisions, validation simple ou double, rejet, retrait, contestation et dépublication. Elle exige `demo-aitmesbah`, les émulateurs et uniquement des identités `example.test`.

Les événements couvrent création, mise à jour, soumission, changement d’état, version, attribution, décision, correction, approbation, rejet, retrait, contestation et dépublication. Aucun formulaire, upload, email, pièce jointe, témoignage réel, contenu réel ou publication réelle n’existe. Après validation et commit séparé de 8F, 8F2 pourra construire le CRM minimal sans modifier cette frontière par commodité.
