# Aït Mesbah — Village & Mémoire

Site communautaire consacré au village d’Aït Mesbah, en Haute Kabylie.

## Développement local

Prérequis : Node.js 22 et npm.

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur `http://localhost:3000`.

## Vérification de production

```bash
npm run build
npm start
```

## Déploiement Firebase App Hosting

1. Ouvrir Firebase Console.
2. Aller dans **App Hosting**.
3. Créer un backend et connecter le dépôt GitHub `AylanMael/aitmesbah`.
4. Choisir la branche `main` et `/` comme dossier racine.
5. Sélectionner Node.js 22, puis lancer le déploiement.

Le fichier `apphosting.yaml` limite les instances au lancement afin de maîtriser les coûts.

## Contenus

Les photographies et les informations signalées « à compléter » doivent être remplacées uniquement par des contenus authentiques et vérifiés concernant Aït Mesbah.
