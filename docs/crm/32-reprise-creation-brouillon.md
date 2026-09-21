# Reprise de création d'un brouillon — 20 septembre 2026

## Garantie et limites

Le nouveau formulaire envoie une clé UUID v4 dans `Idempotency-Key`. La clé et le contenu envoyé sont conservés en mémoire dans le layout CRM, isolé par compte. Après une réponse incertaine, les champs sont figés et le bouton « Réessayer la même tentative » réutilise cette clé et ce contenu. Aucun nouvel envoi automatique n'est déclenché.

Le serveur revérifie session, permission et données. L'identifiant du document est dérivé du couple utilisateur/clé ; une empreinte du contenu normalisé est conservée dans le document privé, exclue de la projection publique du dossier. La création atomique inclut le dossier, sa version initiale et l'événement de journal. Deux lots concurrents ne peuvent pas créer deux dossiers avec la même identité.

Si le document existe déjà, le serveur vérifie l'auteur et l'empreinte avant de retourner le dossier courant. Il n'écrase ni ses modifications, ni son statut, ni ses décisions. Réutiliser la même clé avec un contenu différent est refusé (409).

Compatibilité : les clients sans clé conservent le comportement précédent. Ils ne bénéficient pas de cette garantie. La clé disparaît à la fermeture, au démontage du layout ou au changement de compte : une ressaisie complète constitue une nouvelle tentative. Avant de ressaisir après fermeture, consulter les dossiers existants.

## Contrôles exécutés

- Métadonnées de la base existante consultées en lecture seule : édition Standard, région europe-west4. Aucun changement distant.
- 275 tests unitaires réussis.
- TypeScript réussi ; ESLint ciblé sans erreur, avec un avertissement préexistant sur une image privée.
- Test ciblé dans Firestore demo-aitmesbah réussi : cinq créations simultanées, une version et un événement seulement ; rejeu après réponse supposée perdue ; préservation d'une modification ultérieure ; refus d'une empreinte ou d'un auteur incohérent.
- Ce test exerce le mécanisme atomique réel dans l'émulateur, pas le parcours navigateur ni la route Next.js entière. La recette interactive reste requise.

Traces locales : `tmp/qa-idempotency-unit.log`, `tmp/qa-idempotency-emulator.log`, `tmp/qa-idempotency-types.log`, `tmp/qa-idempotency-lint.log`.

Pas de déploiement, de nouvelles règles ou de nouvel index. L'ajout est un champ interne sur la contribution, couvert par les restrictions d'accès existantes.
