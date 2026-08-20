# Socle Firebase local

## Objectif

Ce socle permet de tester localement les règles initiales du futur CRM sans créer de fonctionnalité, compte réel, donnée distante ou déploiement. Les règles refusent tout accès jusqu’aux missions d’autorisation dédiées.

## Prérequis et dépendances

- Node.js 22.x et npm 10.x.
- Java JDK 11 ou supérieur ; Java 21 LTS est utilisé lors de la création.
- `firebase-tools` 15.11.0.
- `firebase` 12.18.0.
- `@firebase/rules-unit-testing` 5.0.2.

L’Admin SDK n’est pas installé : il contourne les Security Rules et n’est pas nécessaire pour démontrer les refus.

## Environnement strictement local

Le seul identifiant exécutable est `demo-aitmesbah`. Le préfixe `demo-` indique à Firebase CLI un projet de démonstration et empêche les interactions avec des ressources réelles. Les projets `aitmesbah-d945d` et `ccs-compta` sont explicitement interdits aux scripts et tests de cette mission.

| Service | Adresse locale |
|---|---|
| Authentication Emulator | `127.0.0.1:9099` |
| Firestore Emulator | `127.0.0.1:8080` |
| Storage Emulator | `127.0.0.1:9199` |
| Emulator UI | `127.0.0.1:4000` |

La préproduction sera un futur projet Firebase distinct. La production reste le projet existant et n’est ni sélectionnée ni modifiée. Identités, données et secrets ne sont jamais partagés entre local, préproduction et production.

## Fichiers du socle

- `.firebaserc` : aliases local et défaut vers le projet de démonstration uniquement.
- `firebase.json` : règles et ports explicites des trois émulateurs.
- `firestore.rules` et `storage.rules` : refus global.
- `firestore.indexes.json` : fichier valide sans index métier.
- `tests/firebase/` : garde anti-production et tests de refus.

## Commandes

Lancer manuellement les émulateurs :

```powershell
npm run firebase:emulators
```

Exécuter les tests avec démarrage et arrêt automatiques :

```powershell
npm run test:firebase:rules
```

Le script utilise `firebase emulators:exec`, démarre Authentication, Firestore et Storage, exécute les tests puis arrête les processus qu’il a créés.

## Règles et tests

Firestore et Storage refusent toute lecture et écriture, avec ou sans authentification. Aucun rôle, collection ou chemin CRM n’est anticipé. Les tests créent seulement des identités dans Authentication Emulator, simulent des utilisateurs authentifiés et vérifient que ces identités, de faux attributs administratifs et des métadonnées favorables ne donnent aucun accès.

La garde exige :

- l’identifiant exact `demo-aitmesbah` et son préfixe `demo-` ;
- les variables des trois émulateurs pointant sur les ports locaux ;
- l’absence des identifiants interdits dans la configuration exécutable.

Elle échoue immédiatement si les émulateurs ne sont pas détectés ou si le projet configuré diffère. Aucun repli distant n’existe.

## Limites et prochaine étape

La réussite des tests valide seulement le refus initial ; elle ne valide aucune future autorisation métier. Aucun projet de préproduction n’est créé, la production n’est pas modifiée et les règles locales ne sont pas déployées. Originaux, fichiers sensibles, antivirus, CRM, authentification applicative et rôles restent hors périmètre.

La prochaine mission pourra préparer l’authentification locale et ouvrir progressivement les seuls accès approuvés, avec tests positifs et négatifs dédiés.

## Arrêt et nettoyage

`emulators:exec` arrête automatiquement ses émulateurs. Pour un lancement manuel, utiliser `Ctrl+C` dans le terminal qui les a démarrés. Ne jamais tuer un processus préexistant. Après les tests, vérifier que les quatre ports sont libres et supprimer seulement les fichiers temporaires créés par la session. Aucun import ou export d’émulateur n’est configuré.
