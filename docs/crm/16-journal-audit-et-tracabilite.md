# Journal d’audit métier et traçabilité

## Objectifs et périmètre

Le journal métier transversal permet de déterminer qui a exécuté quelle opération, sur quelle ressource, quand, avec quel résultat et, lorsque nécessaire, pour quel motif. Il couvre comptes, organisations, appartenances, autorisations, contributions, édition, fichiers privés, droits, consentements et sécurité. Il reste invisible aux clients et fonctionne uniquement dans l’Emulator Suite avec `demo-aitmesbah` pendant 8H.

Il ne remplace pas les journaux techniques Firebase ou Google Cloud. Il ne constitue ni une preuve cryptographique absolue, ni une politique juridique définitive, ni une certification de conformité.

## Cartographie et normalisation de l’existant

L’audit préalable a trouvé quatre structures historiques : comptes (`action`, `targetUid`, états de statut, version de profil), organisations (`targetId`, organisation, états, version), contributions (`targetId`, contribution, version éditoriale) et fichiers (`action`, contribution, fichier, version). Les producteurs métier purs restent compatibles, mais toute nouvelle écriture persistante est convertie vers le modèle canonique. Les anciens noms dynamiques sont notamment normalisés : `asset.pending_deletion` devient `asset.deletion_requested`, les changements d’états éditoriaux non spécialisés deviennent `contribution.status_changed`, et les états dynamiques de droits ou consentements deviennent `rights.status_changed` ou `consent.status_changed`.

## Modèle canonique

Chaque document est stocké sous `auditLogs/{eventId}`. Champs toujours présents : `eventId`, `eventType`, `category`, `actorType`, `targetType`, `targetId`, `changedFields`, `result`, `occurredAt`, `correlationId`, `schemaVersion`. `eventId` égale l’identifiant Firestore.

Selon le contexte uniquement peuvent s’ajouter : `actorUid`, `organizationId`, `contributionId`, `assetId`, `previousState`, `nextState`, `reason`. Les identifiants hors contexte sont absents. `changedFields` ne contient que des noms normalisés, uniques et bornés, jamais les valeurs complètes. Le schéma refuse tout champ inconnu et l’objet logique est gelé après validation.

## Catégories fermées

`account`, `organization`, `membership`, `authorization`, `contribution`, `editorial`, `asset`, `rights`, `consent`, `security`. Les finances sont exclues du MVP.

## Catalogue fermé des événements

- Comptes : `account.invited`, `account.status_changed`.
- Organisations : `organization.created`, `organization.status_changed`, `organization.verification_changed`, `organization.mandate_changed`.
- Appartenances : `membership.invited`, `membership.status_changed`, `membership.roles_changed`.
- Contributions : `contribution.created`, `contribution.updated`, `contribution.submitted`, `contribution.status_changed`, `contribution.version_created`.
- Éditorial : `review.assigned`, `editorial.decision_recorded`, `contribution.changes_requested`, `contribution.approved`, `contribution.rejected`, `contribution.withdrawn`, `contribution.contested`, `contribution.unpublished`.
- Fichiers : `asset.reserved`, `asset.quarantined`, `asset.validated`, `asset.rejected`, `asset.withdrawn`, `asset.deletion_requested`, `asset.deleted`.
- Droits : `rights.declared`, `rights.status_changed`.
- Consentements : `consent.recorded`, `consent.status_changed`, `consent.withdrawn`.
- Autorisation et sécurité : `authorization.denied`, `security.account_suspended`, `security.account_revoked`, `security.emergency_remove`.

Un refus direct des Security Rules ne produit aucun événement métier. `authorization.denied` est réservé à une future couche serveur capable de constater le refus.

## Motifs obligatoires

Un motif nettoyé, non vide et limité à 500 caractères est requis pour suspension ou révocation de compte, suspension ou archivage d’organisation, retrait ou expiration de mandat, suspension ou révocation d’appartenance, changement de rôle, correction ou refus éditorial, retrait, contestation, dépublication, rejet ou retrait de fichier, demande de suppression, retrait ou rejet d’un droit ou consentement et suppression d’urgence. Les créations et opérations techniques ordinaires peuvent omettre le motif.

## Données exclues

Sont interdits : adresse électronique, nom complet, corps de contribution, contenu documentaire, mot de passe, jeton, secret, donnée d’authentification, clé, adresse IP, empreinte d’appareil, pièce d’identité, valeur complète avant/après et information sensible sans nécessité. Les fixtures utilisent exclusivement des identifiants fictifs.

## Immutabilité et corrélation

L’écriture utilise `create`, jamais un écrasement. Les fonctions métier ordinaires de modification et suppression échouent systématiquement. Firestore refuse toute opération cliente sur `auditLogs`. L’administration de test peut nettoyer ses fixtures après la campagne, ce qui n’est pas une fonction métier de production.

Chaque opération reçoit un `correlationId` opaque. Tous les événements d’une opération logique ou atomique doivent partager cet identifiant ; il ne contient aucune donnée personnelle. Aucune empreinte locale n’est présentée comme garantie juridique.

## Consultation serveur bornée

La consultation locale est réservée à l’Admin SDK sous gardes d’émulateurs. Limite par défaut : 25 ; maximum : 100. Ordre : `occurredAt` décroissant puis `eventId` décroissant. Le curseur est un identifiant opaque validé. Les filtres autorisés sont catégorie, événement, acteur, organisation, contribution, type et identifiant de cible, ainsi que période lorsque la couche d’exploitation sera finalisée. Tout filtre inconnu, limite invalide, recherche plein texte ou lecture illimitée est refusé. Aucune route HTTP, interface, lecture navigateur ou export massif n’existe.

## Autorisation

Les règles Firestore restent en refus total pour lecture, liste, création, modification et suppression, avec ou sans authentification, custom claim, rôle global ou appartenance organisationnelle. La consultation future devra passer par une couche serveur explicitement autorisée et auditée.

## Conservation provisoire

La durée de travail recommandée est de 24 mois. La durée des événements de sécurité, l’anonymisation, la purge, les exceptions contentieuses et la gouvernance sont **à valider juridiquement**. 8H ne crée aucune purge, suppression automatique ou export automatique.

## Tests et limites

Les tests vérifient structure, catalogues, cohérence, motifs, exclusions, horodatage, version, corrélation, immutabilité, requêtes bornées, filtres, pagination, refus clients et création Admin locale. Les suites historiques restent obligatoires. Sont différés : interface d’audit, droits humains de consultation, export, alertes, rétention automatisée, archivage légal, intégrité cryptographique renforcée et accès à un projet réel.

La mission suivante dépend de la validation puis du commit séparé de 8H.
