# Organisations, appartenances et permissions

## Frontières et source d’autorité

Un compte représente une identité individuelle. Une organisation représente un périmètre collectif sans reconnaissance officielle implicite. Une appartenance relie un compte à une organisation et porte uniquement des rôles locaux. Les documents `organizations/{organizationId}/memberships/{uid}` sont la source d’autorité organisationnelle.

Le tableau `organizationMemberships` de `users/{uid}` reste une projection serveur facultative destinée à la navigation. Il ne suffit jamais à autoriser une action, n’est jamais écrit par le client et devra être réconcilié depuis les appartenances autoritatives.

## Rôles

Rôles globaux : Membre en attente, Membre approuvé, Contributeur, Relecteur, Responsable éditorial, Référent mémoire et archives, Responsable communautaire, Administrateur et Propriétaire technique. Visiteur est un état public, pas un rôle attribuable.

Rôles organisationnels : Responsable d’association, Représentant mandaté du comité et Responsable financier futur. Ce dernier ne confère aucune permission au MVP. Un rôle local ne produit jamais un rôle global.

Les permissions cataloguées couvrent demande personnelle, accès communautaire, brouillon personnel, relecture affectée, décisions éditoriales ordinaires, traitement des membres, vérification d’organisation, gestion locale des membres/contenus/événements, préparation d’une communication sous mandat, gestion des rôles, paramètres, nomination administrative et retrait de sécurité. Les collections éditoriales et financières restent fermées : cataloguer ne signifie pas ouvrir un accès.

## Organisations

Le modèle contient `organizationId`, `name`, `slug`, `type`, `status`, `verificationStatus`, `mandateStatus`, `declaredScope`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy` et `version`.

Types : `association`, `village_committee`, `informal_collective`, `community_group`. Statuts : `registered`, `active`, `suspended`, `archived`. Vérification : `unverified`, `verified`. Mandat : `none`, `pending`, `valid`, `withdrawn`, `expired`.

Une création est toujours `registered`, `unverified` et sans mandat. La vérification exige une opération administrative. Un mandat valide exige à la fois le type comité et une vérification explicite. Le libellé « comité » n’accorde aucun droit. Associations, collectifs et groupes sont présentés neutralement tant que leur vérification ou leur mandat n’est pas établi.

Transitions d’organisation : `registered → active|archived`, `active → suspended|archived`, `suspended → active|archived`. `archived` est terminal.

## Appartenances et cloisonnement

Le modèle contient `organizationId`, `uid`, `roles`, `status`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy` et `version`. États : `invited`, `active`, `suspended`, `revoked`. Transitions : `invited → active|revoked`, `active → suspended|revoked`, `suspended → active|revoked`. `revoked` est terminal.

Les permissions effectives exigent simultanément un compte `active`, une organisation `active`, une appartenance `active`, un rôle local connu et une correspondance exacte de l’organisation. Le représentant du comité exige aussi un mandat `valid`. Les appartenances multiples sont calculées séparément. Toute incohérence ferme les droits.

## Règles Firestore et audit

Les clients ne lisent aucune organisation et ne peuvent lister aucune organisation ou appartenance. Un compte actif peut seulement lire avec `get` sa propre appartenance active au sein d’une organisation active. Toute écriture cliente est refusée. Les profils tiers, rôles, audits, futures collections et Storage restent fermés. Les custom claims ne sont pas consultés.

Événements serveur : `organization.created`, `organization.status_changed`, `organization.verification_changed`, `organization.mandate_changed`, `membership.invited`, `membership.status_changed`, `membership.roles_changed`. Ils enregistrent acteur, cible, organisation, états, motif, date et version sans donnée personnelle superflue.

## Administration locale et limites

La couche locale permet de créer, activer, suspendre, archiver et vérifier une organisation fictive, gérer un mandat fictif, inviter un compte `example.test`, activer, suspendre, réactiver ou révoquer son appartenance et changer ses rôles locaux. Les gardes exigent `demo-aitmesbah` et les émulateurs Auth/Firestore ; aucun compte de service ou secret n’est chargé.

Aucune organisation réelle, interface CRM, publication, contribution, fichier, finance ou communication officielle n’est créée. Identités des trois ou quatre responsables, compatibilités cumulatives fines, MFA, preuves documentaires, durées et procédures de production restent à valider. Après validation et commit séparé de 8E, 8F pourra construire le CRM minimal sur cette frontière testée.
