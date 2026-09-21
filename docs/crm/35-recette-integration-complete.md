# Recette d’intégration complète — 20 septembre 2026

## Résultat

435 tests exécutés, 435 réussis, aucun échec, aucun test ignoré ou annulé.
Durée des tests : environ 142 secondes. Sortie du processus : 0.

La commande `npm run test:firebase:rules` a démarré Authentication, Firestore
et Storage dans les émulateurs du projet fictif `demo-aitmesbah`. Les émulateurs
ont été arrêtés automatiquement à la fin. Aucune donnée de production modifiée.

## Reproduction PowerShell

Dans un terminal local dédié, sans autre instance des émulateurs :

```powershell
$env:AITMESBAH_APP_ENV='local'
$env:NEXT_PUBLIC_AITMESBAH_APP_ENV='local'
$env:NEXT_PUBLIC_FIREBASE_PROJECT_ID='demo-aitmesbah'
$env:GCLOUD_PROJECT='demo-aitmesbah'
$env:USE_EMULATORS='true'
$env:NEXT_PUBLIC_FIREBASE_USE_EMULATORS='true'
npm run test:firebase:rules
```

La CLI transmet les adresses des trois émulateurs au processus de test.
Les refus `PERMISSION_DENIED` attendus par les assertions de sécurité ne sont
pas des échecs : vérifier le bilan final du lanceur.

## Portée et prochaine étape

Ce résultat remplace le précédent bilan incomplet de la suite globale. Il inclut
les tests unitaires, les contrats vérifiés dans les sources et les tests avec
les émulateurs ; il ne signifie pas que 435 parcours navigateur ont été joués.

La recette authentifiée de l’interface reste à mener sur une instance locale
connectée aux émulateurs, avec des identités fictives :

- filtres Comptes et Organisations, effacement et pagination ;
- annuaire nominatif, chargement supplémentaire et affectation autorisée ;
- refus pour un rôle sans les permissions requises ;
- accès aux fichiers distinguant refus, chargement et absence réelle ;
- création d’un brouillon, reprise et prévention des doubles soumissions.

Le contrôle visuel isolé du menu est documenté dans le rapport 34. Aucun commit,
push ou déploiement n’a été effectué lors de cette recette.
