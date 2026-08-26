# Interface privée du journal d’audit

## Périmètre

La mission 8N ouvre `/crm/journal` et `GET /api/crm/audit-logs` exclusivement avec `demo-aitmesbah`. L’interface est consultative : aucune création, correction, suppression, purge, impression globale ou export n’est disponible. Les Security Rules restent fermées et le navigateur ne contacte jamais Firestore ou Storage.

## Autorisation

La permission canonique `audit.read` appartient uniquement au rôle global `administrator`. `technical_owner` seul, tous les autres rôles globaux, les rôles locaux, les custom claims, les noms d’organisation et la projection `organizationMemberships` ne la confèrent pas. Un cumul `technical_owner` et `administrator` est autorisé uniquement par le rôle `administrator`. Le serveur relit le profil actif et recalcule les permissions depuis `users/{uid}.globalRoles`.

## Consultation bornée

La limite vaut 25 par défaut et 100 au maximum. L’ordre est `occurredAt` décroissant puis `eventId` décroissant. Le curseur opaque contient uniquement la position technique et une empreinte des filtres ; toute altération ou incompatibilité est refusée. Il n’existe ni offset, ni total global, ni lecture illimitée. La couche Firestore lit un lot maximal de 101 documents et applique ensuite les filtres fermés, ce qui évite tout index supplémentaire pendant le MVP.

Filtres autorisés : catégorie, type d’événement, résultat, acteur, organisation, contribution, type et identifiant de cible, début et fin sur un intervalle maximal de 90 jours. Recherche libre, email, nom, motif, expression régulière et filtre Firestore arbitraire sont interdits.

## Minimisation et confidentialité

La réponse expose seulement les identifiants canoniques utiles, catégorie, événement, acteur minimal, cible, contexte organisationnel ou éditorial, champs modifiés, résultat, date, corrélation, version de schéma et motif déjà contrôlé. Email, nom complet, corps, contenu binaire, chemin ou URL Storage, authentification, secret, adresse IP et valeurs complètes avant/après restent exclus. Une simple consultation ne crée pas d’événement d’audit.

## Interface et erreurs

La page présente des libellés français sans transformer les valeurs stockées. Les résultats utilisent simultanément texte et couleur. Les contrôles ont des libellés, un focus visible et une hauteur minimale de 44 pixels ; les fiches se réorganisent sur petits écrans et les identifiants longs restent lisibles. Les erreurs distinguent session absente, permission insuffisante, filtre ou curseur invalide et erreur interne, sans stack trace ni chemin local.

## Décisions différées

Restent différés : export encadré, recherche personnelle, conservation définitive, purge, intégrité cryptographique renforcée, alertes, accès à un projet réel et déploiement.
