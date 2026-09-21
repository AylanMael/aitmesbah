# Vers un CMS communautaire fiable

## Premier lot — navigation et états fiables

- Ne pas transformer une erreur de lecture en file vide : frontière d’erreur avec relance.
- Ouvrir les fiches par identifiant, jamais par recherche de titre.
- Séparer filtres visuels et pagination serveur. Les filtres restent limités à la page chargée et cette limite est affichée.
- Conserver les filtres au passage à la page suivante.
- Ne pas présenter une sélection bornée et ordonnée par identifiant comme les derniers dossiers ou comme un total global.

Ce lot ne modifie ni permission, ni règle Firebase, ni publication.

## Jalons suivants

1. **Parcours par rôle** : accueil du contributeur centré sur ses brouillons et corrections ; file du relecteur centrée sur ses affectations ; vue de l’éditeur sur les contrôles et publications. Tester les profils combinés : la liste serveur refuse actuellement certains mélanges auteur/relecteur. Concevoir des périmètres explicites avant toute modification.
2. **Édition confortable** : création puis ouverture directe du brouillon, avertissement de changements non enregistrés, erreurs au niveau du champ, gestion claire des conflits de version. Ne pas ajouter de sauvegarde automatique sans contrat de versionnement.
3. **Médias documentés** : envoi, état de traitement, légende, texte alternatif, provenance, droits et média principal. Distinguer fichier reçu, validé et publiable.
4. **Recherche à l’échelle de la collection** : filtres réellement exécutés côté serveur avec index, pagination et contrôles d’accès testés. La recherche locale actuelle n’est pas une recherche globale.
5. **Circuit complet** : soumission, affectation, corrections, contrôles, approbation, aperçu, publication, modification, report/annulation et dépublication. Les étapes déjà présentes doivent être validées, pas présumées absentes ni fonctionnelles.

## Critères de validation

- Scénarios de bout en bout sur émulateurs avec contributeur, relecteur, éditeur et administrateur distincts.
- Refus des actions hors rôle, des accès à un autre dossier et des décisions périmées.
- Aucune publication implicite ; conservation des URL et de l’historique éditorial.
- États chargement, vide, erreur, conflit et succès compréhensibles en français.
- Vérification clavier et mobile, puis test contrôlé en production après autorisation.
- Pas de déclaration « 100 % fonctionnel » fondée seulement sur TypeScript ou des tests de structure.

## Limite documentaire

Certains anciens documents décrivent les premières versions privées du CRM et disent que la publication n’existe pas. Le code actuel contient déjà des opérations de publication : confronter ces documents au code avant de les utiliser comme référence fonctionnelle.
