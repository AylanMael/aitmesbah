# Gestion des organisations, appartenances et mandats

## Périmètre et gouvernance

La mission 8K ouvre localement `/crm/organisations` avec `demo-aitmesbah`. Une structure enregistrée dans le CRM ne constitue ni une reconnaissance officielle, ni une preuve d’existence juridique, ni un mandat au nom du village. Aucun nom, slug ou type ne crée un privilège. Toutes les mutations passent par l’Admin SDK serveur après session, CSRF, contrôle Origin/Host et recalcul des permissions depuis Firestore.

Les mandats restent intégralement indisponibles pendant 8K : aucune route, action d’interface ou fonction administrative ne peut créer, valider, retirer ou expirer un mandat. `mandateStatus` est seulement affiché. L’autorité compétente et la double validation seront définies par une mission ultérieure.

## Types, états et vérification

Types fermés : `association`, `village_committee`, `informal_collective`, `community_group`.

États : `registered`, `active`, `suspended`, `archived`. Transitions : `registered → active|archived`, `active → suspended|archived`, `suspended → active|archived`. `archived` est terminal.

La création impose `registered`, `unverified`, `none` et `version: 1`. L’identifiant est opaque et serveur, le slug normalisé et unique. La vérification est une décision distincte `unverified ↔ verified`, motivée, confirmée et auditée. Le retrait de vérification est refusé si un mandat historique est `valid`, car 8K ne peut modifier indirectement ce mandat.

## Matrice des permissions

| Opération | Permission | Portée et contraintes |
|---|---|---|
| Créer une organisation | `organization.create` | globale ; aucun rôle local |
| Liste administrative globale | `organization.list` | globale, 25 par défaut, 100 maximum |
| Activer, suspendre, archiver | `organization.status.manage` | globale ; motif et version |
| Vérifier ou retirer la vérification | `organization.verify` | globale ; motif, confirmation et version |
| Lister et gérer les membres | `organization.member.manage` | locale au responsable ; globale seulement pour l’administrateur explicitement habilité |
| Attribuer ou retirer un rôle local | `role.local.manage` | portée explicitement autorisée |
| Préparer une communication du comité | `committee.communication.prepare` | hors interface 8K ; exige ultérieurement mandat valide |

Les trois permissions ajoutées au catalogue canonique sont `organization.create`, `organization.list` et `organization.status.manage`. Elles sont attribuées au rôle global `administrator` dans le modèle local. Elles ne sont jamais déduites d’un custom claim, d’une projection `organizationMemberships` ou d’un rôle local.

## Rôles organisationnels

Les identifiants historiques 8E sont conservés sans migration :

- `association_manager` : gestion locale des membres, contenus et événements ; 8K ouvre seulement les membres ;
- `mandated_committee_representative` : permission effective seulement avec comité actif, vérifié et mandat valide ; aucune création de mandat en 8K ;
- `future_financial_manager` : aucune permission au MVP et aucune interface financière.

Un rôle local ne produit jamais de rôle global. `technical_owner` reste protégé par la gestion 8J et n’est ni attribuable ni révocable.

## Appartenances, projection et cloisonnement

La source d’autorité reste `organizations/{organizationId}/memberships/{uid}`. États : `invited`, `active`, `suspended`, `revoked` avec transitions 8E ; `revoked` est terminal. La cible est un compte existant non révoqué. L’interface demande un UID exact et n’expose aucune recherche générale.

Un responsable de A ne reçoit que A, ne liste pas B et ne lit aucun membre de B. Chaque permission locale est recalculée avec le profil actif, l’organisation active et l’appartenance active correspondante. Une organisation ou appartenance suspendue ne confère aucun droit.

`organizationMemberships` reste une projection minimale de navigation, recalculée côté serveur après les mutations. Elle n’est jamais consultée pour autoriser une opération et une projection falsifiée reste sans effet.

## API, données et concurrence

Les Route Handlers sont limités à `/api/crm/organizations/**`. Les corps JSON sont fermés et bornés ; les réponses sont `no-store`. Les listes utilisent un ordre stable, un curseur opaque et une limite de 100. La liste globale expose seulement identifiant, nom, slug, type, statut, vérification, mandat informatif, périmètre déclaré, dates et version. Les membres exposent UID nécessaire, nom d’usage, rôles locaux, statut, dates et version. Emails, rôles globaux, appartenances tierces, jetons, secrets et données Auth sont exclus.

Chaque mutation compare `expectedVersion`. Organisation, appartenance et événement d’audit sont écrits atomiquement lorsque autoritatifs. Un conflit ne produit aucune écriture partielle et retourne HTTP 409 avec invitation à recharger.

## Audit et règles clientes

Événements utilisés : `organization.created`, `organization.status_changed`, `organization.verification_changed`, `membership.invited`, `membership.status_changed`, `membership.roles_changed`. Ils contiennent identifiants minimaux, états, champs modifiés, motif lorsque requis, résultat, corrélation, date et version de schéma. Aucun email, nom complet, liste de membres ou corps HTTP n’est journalisé.

`firestore.rules` et `storage.rules` restent inchangés. Les listes d’organisations, toutes les écritures, les audits, contributions et fichiers restent fermés aux clients. La lecture personnelle 8E ne devient pas une liste.

## Tests et décisions différées

Les tests couvrent catalogues, permissions, création, slug, transitions, vérification, archivage terminal, rôles locaux, rôle financier inactif, pagination, filtres, conflits, audit, projection falsifiée, cloisonnement A/B et règles historiques. Les parcours navigateur vérifient interface, libellés, confirmations, conflits, focus, responsive et absence d’appel distant.

Sont différés : gouvernance et double validation des mandats, preuves de vérification, nomination d’administrateurs, MFA, contenus et événements organisationnels, recherche avancée de comptes, exports, finance, organisations réelles et exploitation distante.
