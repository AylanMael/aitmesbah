# Corrections de la recette de production — 20 septembre 2026

## Changements locaux

- Les raccourcis Contributions étaient déjà corrigés dans le lot local précédent : liens vers les identifiants de fiches et séparation pagination/filtrage visuel.
- Comptes : les paramètres d'affichage ne sont plus transmis à la requête serveur qui les refuse. Filtrage de la page chargée, message de périmètre explicite, effacement et conservation des filtres sur la page suivante.
- Organisations : même séparation appliquée préventivement au même schéma de filtres. Pas de recherche globale prétendue.
- Menu : noms accessibles permanents, focus visible, barre supérieure sur deux rangées de trois rubriques en petit écran, six colonnes en tablette et menu latéral conservé sur bureau.
- Fichiers : les droits serveur restent inchangés. La consultation des originaux exige d'être auteur ou relecteur affecté avec la permission appropriée. Le refus est expliqué ; il ne donne plus un compteur zéro ni un état de fonds vide. Un défaut de chargement reste distingué d'une absence de fichiers.
- Affectation et invitation dans une organisation : sélection nominative paginée via l'annuaire existant, seulement si le compte possède déjà `profile.assigned.read`. Aucun nouvel accès accordé. Les rôles sans ce droit conservent la saisie d'un identifiant communiqué par un responsable, avec explication. Les comptes suspendus, orphelins et l'auteur du dossier ne sont pas proposés comme relecteurs. Le serveur reste autoritatif pour les permissions et l'appartenance organisationnelle.
- Traductions : catégorie de l'aperçu privé, administrateur, responsable technique et rôle financier non activé.
- États vides des organisations : texte explicite, sans pseudo-élément CSS dupliqué ; erreur et chargement des membres distingués du vide, réponses obsolètes ignorées.

## Vérifications

- 280 tests unitaires réussis.
- TypeScript réussi ; ESLint ciblé sans erreur, un avertissement préexistant sur les images privées.
- Menu réel rendu dans un aperçu isolé avec un compte fictif (Link et chemin Next.js simulés, pas d'authentification ni de données).
- 320 px : six rubriques visibles, mots non coupés après ajustement visuel.
- 390 px : bord droit du menu mesuré à 363,2 px pour une largeur utile de 375 px.
- 768 px : six colonnes, dernière rubrique à 736,8 px pour une largeur utile de 753 px.
- 1440 px : menu latéral de 286 px ; largeur du document 1425 px, sans dépassement global observé.
- Tabulation vers « Vue d'ensemble » : nom accessible présent et contour de focus visible.
- Aperçu temporaire arrêté, onglet de test fermé, taille du navigateur restaurée. Aucune mutation sur la production.

## Limites avant mise en ligne

L'aperçu valide le rendu du menu et ses styles, pas les routes authentifiées. Rejouer dans l'application locale : filtres avec plusieurs pages, chargement/pagination de l'annuaire, sélection/affectation, comptes non autorisés, refus d'accès aux fichiers. Les options de l'annuaire sont une présélection, pas une garantie d'affectation : le serveur contrôle notamment l'organisation du dossier.

Les changements ne sont ni commités ni déployés. Ne pas présenter les anomalies de production comme résolues en ligne avant déploiement et recontrôle.
