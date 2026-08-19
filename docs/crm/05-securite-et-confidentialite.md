# Sécurité et confidentialité

## Principes approuvés

- Comptes nominatifs, aucun compte partagé.
- Activation exclusivement manuelle, aucun accès communautaire automatique.
- Moindre privilège, contrôle d’autorisation côté serveur futur et refus par défaut.
- Cloisonnement strict des organisations et niveaux public, community et restricted.
- Sessions révocables, révocation immédiate des habilitations et journalisation sensible.
- MFA future obligatoire pour les rôles éditoriaux, communautaires, associatifs, financiers, administratifs et le propriétaire.
- Sauvegardes protégées, restauration testée, tests négatifs et revue périodique des accès à définir techniquement.

Au départ d’un responsable : suspendre l’accès, révoquer sessions et rôles, réaffecter les dossiers, vérifier les exports récents, préserver l’audit et documenter la clôture.

## Données minimales

| Donnée | Règle |
|---|---|
| Identifiant de connexion | Adresse électronique nécessaire |
| Nom d’usage | Suffisant pour les échanges internes |
| Acceptation des règles | Version et date conservées |
| Lien communautaire | Justification courte, sans enquête généalogique |
| Pays ou région | Facultatif |
| Référent | Facultatif, avec information appropriée |

Sont exclues par défaut : pièce d’identité, justificatif de domicile, photo d’identité, filiation détaillée, coordonnées familiales et données sensibles sans nécessité démontrée.

## Mineurs

Aucun compte autonome de mineur au MVP. Toute ouverture future exige cadre et consentement adaptés, audience restrictive, absence de donnée scolaire ou localisante inutile, retrait facilité et validation juridique compétente. Les contenus concernant un mineur restent différés jusque-là.

## Conservation provisoire

Ces recommandations indicatives issues de 8A sont **provisoires et à valider juridiquement avant production**.

| Catégorie | Durée indicative | Sort envisagé |
|---|---:|---|
| Demande refusée/abandonnée | 12 mois | Suppression ou anonymisation hors preuve nécessaire |
| Compte fermé/profil minimal | 12 mois après clôture | Suppression/anonymisation selon obligations |
| Consentement/droit de diffusion | Diffusion + 5 ans | Conservation probatoire minimisée à valider |
| Versions/décisions éditoriales | 5 ans après fin de publication | Tri, anonymisation ou archivage justifié |
| Notifications ordinaires | 90 jours | Suppression |
| Journaux d’accès ordinaires | 12 mois | Suppression sécurisée |
| Événements de sécurité | 3 ans après clôture | Réévaluation selon gravité/obligations |
| Opérations financières futures | Durée légale applicable | Validation juridique/comptable requise |

## Catégories de fichiers

| Catégorie | Règle |
|---|---|
| Public | Version expressément publiée |
| Communautaire | Membres approuvés uniquement |
| Restreint | Personnes affectées et habilitées |
| Consultation | Dérivé limité d’un original, droits vérifiés |
| Original | Accès exceptionnel différé, chaque consultation auditée |
| Temporaire | Quarantaine, durée courte, suppression contrôlée |
| Retiré | Non diffusé ; conservation minimale si justifiée |

## Incidents

`détection → limitation → suspension ou révocation → préservation des preuves → analyse → correction → notification appropriée → documentation → prévention`

Limiter l’exposition sans détruire les preuves. Les personnes compétentes déterminent les notifications requises. L’accès d’urgence du propriétaire est motivé, limité et audité.

## Finances futures

Aucune donnée bancaire complète ne sera stockée. Toute activation exige bénéficiaire juridiquement identifié, séparation des associations, double validation, prestataire externe et validations juridique, comptable et bancaire. Les responsabilités financières sont **à déterminer**.

Voir [les rôles](02-roles-et-permissions.md) et [le MVP](07-mvp-et-hors-perimetre.md).
