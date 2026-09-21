# Recette navigateur — production — 20 septembre 2026

## Périmètre

Recette réelle dans le navigateur intégré, session administrateur ouverte par l'utilisateur sur ait-mesbah.org. Navigation, consultation, filtres et contrôles responsive uniquement. Aucun contenu créé, aucune invitation envoyée, aucun rôle ou statut modifié, aucune publication. La session a été laissée ouverte sur le tableau de bord et la taille habituelle du navigateur restaurée.

Les corrections locales des lots 31 et 32 ne sont pas déployées : cette recette caractérise la production, elle ne valide pas ces corrections.

## Résultats observés

| Parcours | Résultat |
| --- | --- |
| Tableau de bord `/crm` | Affiché avec la session attendue. |
| Lien « Ouvrir » du dossier prioritaire | Erreur serveur : destination `/crm/contributions?titlePrefix=…`, référence affichée 1125581778. |
| Liste `/crm/contributions` sans paramètres | Deux dossiers affichés. |
| Recherche locale sans résultat puis effacement des filtres | Fonctionne ; retour aux deux dossiers. Le message vide « Aucun dossier à traiter » est toutefois trompeur après une recherche. |
| Fiche complète du dossier technique existant | Affichée ; progression, contenu, métadonnées et atelier présents. |
| Déplier les actions de la fiche | Fonctionne ; aucune action enregistrée. Affectation par UID brut peu utilisable. |
| Aperçu privé | Affiché par navigation directe vers l'URL du lien ; catégorie non traduite « DOCUMENTARY CORRECTION ». Le clic initial n'a pas ouvert d'onglet visible dans le navigateur intégré : ne pas conclure à une panne du lien sur tous les navigateurs. |
| Bibliothèque `/crm/fichiers` | Page affichée ; sélection du dossier technique produit « Action non autorisée », puis « Aucun original versé ». Un refus n'est pas un fonds vide. |
| Organisations et ouverture d'une fiche | Fonctionnent. Aucun membre ajouté ; formulaire nécessitant un identifiant exact peu accessible aux non-techniciens. Message vide répété deux fois. |
| Journal d'audit | Chargement terminé avec événements. Aucun filtre soumis durant cette passe. |
| Comptes sans filtre | Affichés ; compte propre non modifiable et restrictions des profils orphelins visibles. Ce constat visuel ne prouve pas la sécurité serveur. |
| Comptes : préfixe inexistant puis « Filtrer » | Erreur serveur sur `/crm/comptes?status=&prefix=qa-introuvable-20260920`, référence 2629086753. |
| Raccourci « Publications actives » | Erreur serveur sur `/crm/contributions?status=published`, référence 1125581778. |

## Affichage et accessibilité

- **390 × 844** : dans le journal, menu horizontal serré, chevauchement avec la zone du compte et dernière rubrique partiellement hors de la surface visible. Mesure DOM : lien Journal x=350, largeur=42 ; largeur du document hors barre de défilement=375. L'absence de débordement global ne garantit donc pas l'accès au menu.
- **320 × 740** : chevauchement/coupure aggravés, plusieurs rubriques ne sont plus visibles dans le bandeau.
- **768 × 1024** : tableau de bord lisible dans la capture, menu compact présent ; pas de validation exhaustive de toutes les sections à cette taille.
- **1440 × 1000** : menu latéral avec libellés visibles ; pages Comptes et tableau de bord consultées. Largeur du tableau de bord mesurée=1425 pour un viewport de 1440, sans débordement horizontal global observé.
- **Menu compact sans noms accessibles** : pour les six liens principaux, texte rendu vide et absence de `aria-label` et de `title`, confirmés par lecture DOM ; l'arbre accessible n'annonce que les URL. Ajouter un nom explicite indépendant du texte masqué.
- Libellés techniques encore exposés : `administrator`, `technical_owner`, `DOCUMENTARY CORRECTION`, « UID du relecteur », « sans permission MVP ».

## Priorités

1. **Haute** : erreurs serveur sur les raccourcis Contributions et sur les filtres Comptes.
2. **Haute** : navigation mobile accessible en entier, avec noms accessibles.
3. **Haute** : distinguer refus/échec de chargement et liste vide dans les fichiers ; vérifier pourquoi un dossier proposé n'est pas consultable, sans étendre aveuglément les permissions.
4. **Moyenne** : choix nominatif des relecteurs/membres, traduction des termes techniques et états vides contextualisés.

## Non validé

Soumission, modification, dépôt de fichier, approbation, publication, dépublication, envoi d'invitation et changement de droits n'ont pas été exécutés en production. Aucun compte contributeur/relecteur distinct n'a été utilisé. Aucune simulation réseau, mesure de performance, analyse complète des contrastes, test lecteur d'écran réel ou parcours clavier exhaustif n'est revendiqué.

La création guidée n'est pas proposée à cette session sur la liste de production ; ne pas lui attribuer des droits supplémentaires pour faciliter les tests. La suite doit employer des comptes fictifs et le code local dans les émulateurs.

Verdict : **pas de feu vert global**. Les défauts ci-dessus sont reproduits ; les causes serveur précises des erreurs de filtre nécessitent inspection des journaux/code. Certains correctifs locaux visent déjà les symptômes Contributions et fichiers, mais doivent encore être validés dans le navigateur avant déploiement.
