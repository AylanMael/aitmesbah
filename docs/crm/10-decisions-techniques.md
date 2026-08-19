# Registre des décisions techniques

Les décisions fonctionnelles des documents 01 à 08 prévalent. Les décisions provisoires, différées ou à valider ne doivent pas être interprétées comme des autorisations de production.

## DEC-001 — Firebase pour le MVP

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Firebase est la plateforme technique du MVP.
**Motif :** Continuité avec l’hébergement existant et décision du propriétaire.
**Conséquences :** Authentication, Firestore, Storage, App Check et App Hosting forment le socle.
**À réévaluer si :** l’intégrité, les requêtes ou les coûts dépassent durablement les capacités du modèle.

## DEC-002 — Firebase App Hosting et Next.js

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Conserver Firebase App Hosting et Next.js App Router.
**Motif :** Préserver le site public, son SEO et son déploiement.
**Conséquences :** Les routes privées sont isolées sans rendre le site public entièrement dynamique.
**À réévaluer si :** l’hébergement ne répond plus aux exigences de sécurité, région ou exploitation.

## DEC-003 — Authentification du MVP

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Utiliser courriel et mot de passe avec vérification obligatoire ; exclure anonyme et réseaux sociaux.
**Motif :** Réduire les identités et parcours à sécuriser.
**Conséquences :** Récupération de compte et vérification sont à concevoir en 8C.
**À réévaluer si :** l’accessibilité ou l’usage justifie un autre fournisseur.

## DEC-004 — Création et activation manuelles

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Créer un compte uniquement sur invitation ou après approbation manuelle.
**Motif :** Aucun accès communautaire automatique.
**Conséquences :** L’identité est créée côté serveur ; profil actif et règles bloquent toute identité non approuvée.
**À réévaluer si :** le modèle de gouvernance des accès change.

## DEC-005 — Session CRM de douze heures

**Statut :** Provisoire
**Date :** 2026-08-19
**Décision :** Utiliser un cookie serveur sécurisé avec durée initiale de 12 heures.
**Motif :** Équilibre initial entre sécurité et usage.
**Conséquences :** Cookie HttpOnly, Secure, SameSite, CSRF et révocation obligatoire.
**À réévaluer si :** l’analyse de risque ou les usages imposent une durée différente.

## DEC-006 — MFA des rôles élevés

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** MFA obligatoire pour propriétaire et administrateurs, recommandée aux éditeurs publiants.
**Motif :** Réduire le risque de compromission des comptes privilégiés.
**Conséquences :** Capacité et coût Firebase Identity Platform à confirmer en 8C.
**À réévaluer si :** la validation technique exige MFA pour davantage de rôles.

## DEC-007 — Autorisation à trois niveaux

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Combiner contrôle serveur, Security Rules et interface non autoritative.
**Motif :** Défense en profondeur.
**Conséquences :** Toute mutation sensible est contrôlée par le serveur ; règles en refus par défaut.
**À réévaluer si :** une ressource n’est jamais accessible par SDK client.

## DEC-008 — Firestore source des droits métier

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Stocker rôles, appartenances, mandats et affectations dans Firestore.
**Motif :** Les droits locaux sont dynamiques et révocables.
**Conséquences :** Relecture lors des opérations sensibles.
**À réévaluer si :** les performances exigent un cache prouvé sans affaiblir la révocation.

## DEC-009 — Custom claims limitées

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Réserver les claims aux privilèges globaux très stables.
**Motif :** Leur propagation n’est pas adaptée aux appartenances fines.
**Conséquences :** Aucune liste d’organisations ni affectation éditoriale dans les jetons.
**À réévaluer si :** un besoin global stable et testé apparaît.

## DEC-010 — Cloisonnement par organisation

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Imposer un organizationId immuable et une appartenance active.
**Motif :** Empêcher les fuites horizontales.
**Conséquences :** Tests négatifs avec au moins deux organisations.
**À réévaluer si :** jamais pour supprimer le cloisonnement ; seulement pour le renforcer.

## DEC-011 — Mutations sensibles côté serveur

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Interdire les transitions métier sensibles directes depuis le client.
**Motif :** L’Admin SDK contourne les règles et exige un contrôle explicite.
**Conséquences :** Couche serveur centralisée, transactions et audit.
**À réévaluer si :** une mutation est démontrée sans risque et couverte par des règles testées.

## DEC-012 — Stockage privé par défaut

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Séparer public, privé, quarantaine, retiré et archivé ; interdire les URL sensibles durables.
**Motif :** Prévenir l’exposition accidentelle.
**Conséquences :** Accès temporaire après contrôle serveur et métadonnées Firestore.
**À réévaluer si :** le module fichiers est ouvert après validation dédiée.

## DEC-013 — Workflow et double validation

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Appliquer le workflow documenté et deux validateurs distincts pour le sensible.
**Motif :** Séparation des responsabilités.
**Conséquences :** États, décision et audit écrits transactionnellement.
**À réévaluer si :** la qualification des contenus sensibles évolue.

## DEC-014 — Audit métier serveur

**Statut :** Approuvée
**Date :** 2026-08-19
**Décision :** Écrire un audit minimisé, côté serveur et append-only autant que possible.
**Motif :** Traçabilité des actions et décisions.
**Conséquences :** Aucun secret ni contenu intégral inutile ; les comptes IAM puissants restent un risque.
**À réévaluer si :** une conservation ou protection renforcée est validée.

## DEC-015 — App Check, région et surveillance

**Statut :** Provisoire
**Date :** 2026-08-19
**Décision :** Déployer App Check progressivement ; recommander Firestore europe-west4 et un budget de surveillance de 30 € par mois.
**Motif :** Réduire les abus, colocaliser les services et surveiller le coût.
**Conséquences :** Région App Hosting et cadre juridique à confirmer ; les alertes ne plafonnent pas la facture.
**À réévaluer si :** eur3 devient prioritaire, la région existante diffère ou les coûts observés changent.

## DEC-016 — Finances exclues

**Statut :** Différée
**Date :** 2026-08-19
**Décision :** Cotisations, dons, paiements et remboursements sont exclus du MVP.
**Motif :** Réévaluation fonctionnelle, juridique, fiscale et comptable obligatoire.
**Conséquences :** Aucun prestataire, collection ou flux financier n’est créé.
**À réévaluer si :** bénéficiaires, responsabilités et validations compétentes sont établis.

## DEC-017 — Mineurs

**Statut :** Différée
**Date :** 2026-08-19
**Décision :** Aucun compte autonome de mineur au MVP et aucun contenu sensible le concernant sans cadre validé.
**Motif :** Protection renforcée et validation juridique nécessaires.
**Conséquences :** Parcours et données correspondants absents du MVP.
**À réévaluer si :** le cadre juridique, le consentement, l’audience et le retrait sont validés.

## DEC-018 — Sauvegarde

**Statut :** Provisoire
**Date :** 2026-08-19
**Décision :** Proposer un RPO de 24 heures et un RTO de 8 heures ; décision définitive différée.
**Motif :** Fournir une cible initiale avant mesure des besoins et coûts.
**Conséquences :** Sauvegardes, exports et restauration isolée devront être testés.
**À réévaluer si :** criticité, volumes, finances ou obligations imposent des objectifs plus stricts.

Voir [l’architecture Firebase](09-architecture-technique-firebase.md) et le [plan des missions](08-plan-des-missions-codex.md).
