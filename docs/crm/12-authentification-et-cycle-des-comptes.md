# Authentification et cycle de vie des comptes

## Objectif et limites

La mission 8D établit localement le premier socle d’identité du CRM. Elle ne crée ni interface de connexion, inscription publique, compte réel, email, rôle opérationnel, session de production ou accès distant. Les demandes d’accès, la récupération de compte, la MFA et l’interface CRM restent différées.

## Absence d’inscription publique

Un administrateur habilité prépare chaque compte. Aucun client ne peut créer automatiquement une identité ou un profil, activer une adresse électronique ou s’attribuer un rôle. Les identités des tests utilisent exclusivement le domaine réservé `example.test`.

## Séparation Authentication et Firestore

Authentication porte l’identité technique : UID, email, nom d’affichage, indicateurs de vérification et désactivation. Firestore est la source métier du statut, des rôles, des appartenances, des auteurs de décision et de la version. Les custom claims ne décident pas du cycle du compte et un faux claim administrateur ne contourne pas les règles.

Le profil `users/{uid}` possède exactement les champs suivants :

| Champ | Règle |
|---|---|
| `uid` | Identique à l’UID Authentication et à l’identifiant du document |
| `displayName` | Espaces normalisés, de 2 à 80 caractères |
| `email` | Normalisé en minuscules, au plus 254 caractères |
| `status` | `invited`, `active`, `suspended` ou `revoked` |
| `globalRoles` | Tableau contrôlé, vide à l’invitation |
| `organizationMemberships` | Tableau contrôlé, vide à l’invitation |
| `createdAt`, `updatedAt` | Horodatages produits par la couche serveur locale |
| `createdBy`, `updatedBy` | UID de l’acteur administratif |
| `version` | Entier positif incrémenté à chaque transition |

Tout champ inconnu est refusé par la validation métier.

## États et transitions

- `invited` : identité préparée et désactivée, aucun accès.
- `active` : identité activée ; seule la lecture du profil personnel minimal est ouverte.
- `suspended` : identité désactivée, sessions révoquées et accès refusé ; réactivation motivée possible.
- `revoked` : identité désactivée, sessions révoquées et réactivation interdite.

Transitions autorisées : `invited → active`, `invited → revoked`, `active → suspended`, `active → revoked`, `suspended → active` et `suspended → revoked`. Toute autre transition, toute valeur inconnue et toute modification par le titulaire sont refusées. La création produit toujours `invited` ; la création directe en `active` n’existe pas.

## Procédures administratives locales

`prepareLocalInvitation` crée une identité désactivée dans Authentication Emulator, puis le profil `invited` et son audit. `changeLocalAccountStatus` valide la transition, synchronise la désactivation Auth, écrit le profil et l’audit, puis révoque les jetons lorsque le nouvel état n’est pas `active`. Ces fonctions exigent les variables des émulateurs et le projet exact `demo-aitmesbah`; elles s’arrêtent autrement. Aucun compte de service ou secret n’est chargé. La détection du serveur de métadonnées GCP est explicitement désactivée avant l’initialisation de l’Admin SDK ; les appels restent dirigés vers les émulateurs.

La couche locale couvre préparation, activation, suspension, réactivation après suspension et révocation. Elle démontre le comportement fonctionnel ; la stratégie transactionnelle interservices et la reprise sur incident devront être renforcées avant toute production.

## Règles de sécurité

Firestore conserve un refus global. Un visiteur et les comptes `invited`, `suspended` ou `revoked` ne lisent aucun profil. Un compte `active` peut seulement lire avec `get` son propre document ; il ne peut ni lister les utilisateurs, ni lire un tiers, ni écrire. `auditLogs` est intégralement fermé aux SDK clients. Toutes les autres collections restent fermées. Storage demeure intégralement fermé.

## Audit minimal

L’invitation produit `account.invited`. Chaque transition produit `account.status_changed` avec acteur, cible, ancien état, nouvel état, motif minimisé, date et version du profil. Les événements sont créés seulement par la couche administrative locale et sont immuables pour les clients.

## Données personnelles minimales

Le socle n’ajoute ni adresse, date de naissance, téléphone, pièce d’identité, nationalité, filiation, quartier, profession, donnée bancaire ou donnée sensible. Les rôles et appartenances restent vides tant que les missions dédiées ne les attribuent pas explicitement.

## Commandes locales

```powershell
npm run test:crm:unit
npm run test:firebase:rules
```

La seconde commande démarre Authentication, Firestore et Storage Emulator avec `demo-aitmesbah`, exécute les tests puis les arrête.

## Suite recommandée

Après validation et commit séparé de 8D, 8D2 pourra traiter les demandes d’accès et 8E les rôles et permissions. Connexion applicative, sessions, MFA, emails, récupération de compte, interfaces, organisations et données éditoriales restent hors de cette mission.
