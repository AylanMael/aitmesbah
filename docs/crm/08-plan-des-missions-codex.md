# Plan des missions Codex

## Règles communes

Chaque mission contrôle dépôt, branche, SHA, divergence et statut. Elle précise les fichiers autorisés après inspection ; aucun SHA futur n’est inventé. Toute précondition manquante, décision structurante absente, fichier hors périmètre ou test critique en échec impose l’arrêt. Les identités restent **à déterminer**.

## Missions

| Mission | Objectif/préconditions | Périmètre probable | Décisions/interdictions | Tests, acceptation et dépendances |
|---|---|---|---|---|
| 8B — Comparaison technologique | Comparer Firebase, Supabase, SQL dédié et options justifiées après 8A2 | Rapport ; fichiers autorisés à déterminer | Données, coûts, région, sécurité, exploitation ; ne pas implémenter ni décider implicitement | Matrice pondérée, risques, réversibilité, recommandation ; dépend de 8A2 |
| 8C — Authentification | Comptes, connexion/déconnexion, sessions, protection serveur, refus ; choix 8B validé | Authentification et contrôles serveur ; fichiers à déterminer | Fournisseur, récupération, session, MFA ; aucun rôle métier implicite | Refus par défaut, révocation, tests positifs/négatifs ; dépend de 8B |
| 8D — Demandes d’accès | Formulaire minimal, validation, refus, suspension, anti-abus, confidentialité | Demande et traitement CRM ; fichiers à déterminer | Champs, motifs, conservation ; aucune activation automatique | Demande/invitation, décision manuelle, suspension, absence de fuite ; dépend de 8C |
| 8E — Rôles et permissions | Rôles globaux/locaux, révocation, absence d’élévation, cloisonnement | Autorisations serveur/admin limitée ; fichiers à déterminer | Attributions et incompatibilités ; aucun compte partagé/droit implicite | Matrice testée, refus inter-associations ; dépend de 8C–8D |
| 8F — CRM minimal | Tableau de bord, membres, demandes, navigation, audit minimal | Routes protégées/CRM ; fichiers à déterminer | Trois ou quatre responsables ; pas d’accès général aux brouillons | Parcours par rôle, accessibilité, audit, absence de fuite ; dépend de 8E |
| 8G — Gestion éditoriale | Contenus, versions, workflow, publication, dépublication, retrait | Modèle/interfaces/publication ; fichiers à déterminer | Audiences, sensible/ordinaire, responsables ; aucune publication automatique | Transitions, double validation, concurrence, correction/retrait ; dépend de 8F |
| 8H — Archives et témoignages | Droits, consentements, fichiers privés, originaux, consultation, retrait | Module restricted ; fichiers à déterminer | Cadre juridique, conservation, mineurs, fichiers ; aucun original avant validation | Provenance, droits, anonymisation, accès, retrait/restauration ; dépend de 8G et validations |
| 8I — Organisations | Espaces cloisonnés, responsables, membres, contenus, événements, rôles locaux | Module organisationnel ; fichiers à déterminer | Preuves, mandat du comité, délégation ; aucune lecture croisée | Tests adversariaux multi-organisations, expiration/révocation ; dépend de 8E–8G |
| 8J — Cotisations et dons | Campagnes, paiements, webhooks, remboursements, exports, audit | Module financier isolé/prestataire ; fichiers à déterminer | Validations juridique, fiscale, comptable, bancaire ; aucun stockage bancaire complet | Double validation, rejeu, rapprochement, remboursement, cloisonnement ; dépend de 8I |
| 8K — Durcissement | MFA, sauvegarde/restauration, sécurité, supervision, accessibilité, performance, documentation, formation, exploitation | Surfaces retenues ; fichiers à déterminer | Niveaux de service, incidents, budgets ; aucun déploiement avec risque critique | Restauration, revue d’accès, sécurité, accessibilité, charge, procédures ; dépend des modules inclus |

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
