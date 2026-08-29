# Plan des missions Codex

## Règles communes

Chaque mission contrôle dépôt, branche, SHA, divergence et statut. Elle précise les fichiers autorisés après inspection ; aucun SHA futur n’est inventé. Toute précondition manquante, décision structurante absente, fichier hors périmètre ou test critique en échec impose l’arrêt. Les identités restent **à déterminer**.

## Missions

| Mission | Objectif/préconditions | Périmètre probable | Décisions/interdictions | Tests, acceptation et dépendances |
|---|---|---|---|---|
| 8B — Comparaison technologique | Comparer Firebase, Supabase, SQL dédié et options justifiées après 8A2 | Rapport ; fichiers autorisés à déterminer | Données, coûts, région, sécurité, exploitation ; ne pas implémenter ni décider implicitement | Matrice pondérée, risques, réversibilité, recommandation ; dépend de 8A2 |
| 8B2 — Architecture Firebase | Formaliser l’architecture Firebase retenue et son registre de décisions | Documentation technique uniquement ; fichiers autorisés limités à `docs/crm/` | Aucun code, service, projet, règle ou déploiement | Cohérence documentaire et périmètre Git contrôlés ; dépend de 8B |
| 8C — Socle Firebase local — réalisée | Émulateurs Auth, Firestore et Storage, règles fermées et gardes anti-production ; architecture 8B2 validée et commitée | Configuration locale, règles, tests et documentation | Projet `demo-aitmesbah` uniquement ; aucun accès distant ni déploiement | Refus par défaut et nettoyage validés ; commit 8C requis avant 8D |
| 8D — Authentification et cycle des comptes — réalisée | Invitation, activation, suspension, réactivation, révocation et audit local | Identité locale, profil métier, contrôles serveur et règles | Aucun libre-service, rôle implicite, compte réel ou accès distant | Transitions, refus client et audit validés |
| 8D2 — Demandes d’accès | Formulaire minimal, validation, refus, anti-abus et confidentialité | Demande et traitement CRM ; fichiers à déterminer | Champs, motifs, conservation ; aucune activation automatique | Demande/invitation, décision manuelle et absence de fuite ; dépend de la validation et du commit de 8D |
| 8E — Organisations et permissions — réalisée | Organisations, appartenances multiples, rôles globaux/locaux et cloisonnement | Modèles purs, administration locale, règles et tests | Aucun rôle implicite, mandat automatique ou accès inter-organisations | Matrice et isolation validées |
| 8F — Contributions et circuit éditorial — réalisée | Brouillons, versions, relectures, décisions, double validation, retrait et contestation | Moteur local, règles fermées, tests et documentation | Aucun dépôt public, fichier, publication réelle ou auto-validation | Workflow et conflits testés |
| 8F2 — CRM minimal | Tableau de bord, membres, demandes, navigation, audit minimal | Routes protégées/CRM ; fichiers à déterminer | Trois ou quatre responsables ; pas d’accès général aux brouillons | Parcours par rôle, accessibilité, audit, absence de fuite ; dépend de la validation et du commit de 8F |
| 8G — Fichiers privés et droits — réalisée | Originaux privés, quarantaine, formats, droits, consentements, retrait, suppression et audit | Modèle local, administration Emulator Suite, règles fermées, tests et documentation | Aucun fichier public, antivirus simulé, mineur, interface ou accès distant | Signatures, limites, transitions, isolation, suppression et non-régression |
| 8H — Journal d’audit métier — réalisée | Schéma transversal immuable, normalisation, corrélation et consultation serveur bornée | Modèle local, administration Emulator Suite, règles fermées, tests et documentation | Aucun accès client, contenu intégral, export massif, valeur probatoire ou accès distant | Catalogues, motifs, pagination, immutabilité et non-régression validés |
| 8I — Connexion, session et accès CRM — réalisée | Connexion locale, session serveur, protection des routes et autorisation CRM sur le socle validé | Routes d’authentification, garde serveur, interface minimale et tests locaux | Émulateurs et projet `demo-aitmesbah` uniquement ; aucune inscription libre, persistance client durable, interface métier ou accès distant | Session, CSRF, origine, expiration, révocation, permissions et parcours navigateur validés ; commit 8I requis avant toute interface CRM métier |
| 8J — Gestion des comptes et rôles globaux — réalisée | Liste serveur bornée, invitation locale, cycle des comptes et rôles ordinaires | `/crm/comptes`, API privée, moteur serveur, tests et documentation | Auto-élévation interdite ; administrateur et propriétaire différés ; aucun email ou accès distant | Permissions exactes, version optimiste, cohérence Auth/Firestore et audit validés |
| 8I2 — Archives et témoignages | Consultation restreinte, anonymisation et politiques de conservation sur le socle privé validé | Module restricted ; fichiers à déterminer | Cadre juridique, conservation et mineurs ; aucun original public | Accès, retrait/restauration et validation juridique ; dépend de la validation et du commit de 8I |
| 8I3 — Organisations | Espaces cloisonnés, responsables, membres, contenus, événements, rôles locaux | Module organisationnel ; fichiers à déterminer | Preuves, mandat du comité, délégation ; aucune lecture croisée | Tests adversariaux multi-organisations, expiration/révocation ; dépend de 8E–8G |
| 8K — Gestion des organisations — réalisée | Administration privée des organisations, vérification, statuts, appartenances et rôles locaux | `/crm/organisations`, API privée, moteur serveur, tests et documentation | Permissions globales calculées depuis `users/{uid}.globalRoles` ; cloisonnement strict ; aucun mandat modifiable | Création et liste globales, amorçage administrateur, gestion locale bornée, conflits de version, audit et tests A/B validés |
| 8O-C2 — Sécurité transversale locale — réalisée | Host, Origin, Fetch Metadata, CSRF, réponses privées, HMAC des curseurs et pagination exacte | Politique centrale, CSP locale, refus explicite des filtres non paginables et contrat de débit distribué | Aucun domaine réel, dépendance, index, Rules ou service externe | Routes privées harmonisées, curseurs altérés refusés et non-régression locale |
| 8P1 — Adaptateur multi-environnements — préparée, non déployée | Catalogue fermé `local`/`staging`/`production`, séparation public/serveur et validation fermée | Adaptateur local exécutable et modèles distants bloqués avant réseau | Aucun environnement Firebase distant, secret réel, dépendance ou déploiement | Gardes `demo-*`, émulateurs obligatoires, cookies et configuration testés |
| 8P2 — Contrat de préproduction — préparée, NO-GO | Contrat staging fictif, IAM, MFA, App Check observe, débit distribué et procédures futures | Documentation, politiques pures et tests locaux | Aucun projet, domaine, identité, secret, service ou accès distant | Sentinelles inexécutables, séparation staging/production et non-régression locale |
| 8L — Interface des contributions — réalisée | Gestion privée des brouillons, versions, contrôles documentaires, affectations et approbation interne ordinaire | `/crm/contributions`, API privée, moteur serveur, tests et documentation | Affectation explicite et permissions séparées ; aucun sensible approuvé, fichier ou publication | Versions immuables, cloisonnement, audit, conflits et non-régression locale validés |
| 8M — Cotisations et dons | Campagnes, paiements, webhooks, remboursements, exports, audit | Module financier isolé/prestataire ; fichiers à déterminer | Validations juridique, fiscale, comptable, bancaire ; aucun stockage bancaire complet | Double validation, rejeu, rapprochement, remboursement, cloisonnement ; dépend des modules privés retenus |
| 8N — Interface du journal d’audit | Consultation privée, bornée et minimisée du journal canonique 8H | `/crm/journal`, API GET serveur, moteur de lecture et tests | `audit.read` réservé à `administrator` ; aucune mutation, purge, recherche personnelle ou export | Permission, filtres, curseur, minimisation, refus clients et non-régression locale |
| 8O — Durcissement | MFA, sauvegarde/restauration, sécurité, supervision, accessibilité, performance, documentation, formation, exploitation | Surfaces retenues ; fichiers à déterminer | Niveaux de service, incidents, budgets ; aucun déploiement avec risque critique | Restauration, revue d’accès, sécurité, accessibilité, charge, procédures ; dépend des modules inclus |

## Gabarit obligatoire

Pour chaque mission :

1. Énoncer objectif, préconditions et dépendances.
2. Faire valider les décisions ouvertes.
3. Lister périmètre, zones probables et fichiers autorisés.
4. Lister interdictions et conditions d’arrêt.
5. Réaliser les tests fonctionnels, négatifs, sécurité, accessibilité et non-régression proportionnés.
6. Vérifier critères d’acceptation et état Git.
7. S’arrêter avant commit pour audit.
8. Après autorisation distincte, committer isolément.
9. S’arrêter avant déploiement ; un commit ne l’autorise jamais.

Les validations juridiques, comptables, fiscales, bancaires et de conservation ne peuvent être remplacées par une décision technique. Voir [le périmètre](01-perimetre-et-principes.md) et [le MVP](07-mvp-et-hors-perimetre.md).
