# Authentification, session et accès au CRM

## Périmètre

La mission 8I crée uniquement la fondation privée : `/connexion`, un shell `/crm`, émission CSRF et création/suppression d’une session. Aucun écran métier, inscription, récupération de mot de passe, fournisseur tiers, accès distant ou déploiement n’est ouvert.

## Architecture et frontières

- Le composant client de connexion utilise le SDK Firebase Web modulaire, exclusivement avec Authentication Emulator sur `127.0.0.1:9099` et le projet `demo-aitmesbah`.
- La persistance est `inMemoryPersistence`. Après échange du jeton, le client appelle immédiatement `signOut`.
- Les Route Handlers valident l’enveloppe HTTP, le CSRF et l’origine avant toute opération sensible.
- Firebase Admin, Firestore, les cookies et le calcul autoritatif des permissions restent dans des modules serveur.
- Le layout serveur `/crm` est l’autorité d’accès. Aucun contrôle visuel ou custom claim ne remplace cette vérification.

Sans variables locales explicites, Firebase Web échoue proprement avant toute initialisation et ne tente aucune connexion distante. Le fichier `firebase.local.example` décrit exclusivement des valeurs de démonstration.

## Flux de connexion

1. `/connexion` présente seulement email, mot de passe et bouton.
2. Le navigateur obtient un jeton aléatoire auprès de `/api/auth/csrf`.
3. Firebase Auth Web se connecte à Authentication Emulator, sans persistance disque.
4. L’ID token est envoyé séparément avec le jeton CSRF à `/api/auth/session`.
5. Le serveur contrôle méthode, type et taille du corps, `Origin`, `Host` et CSRF.
6. Admin SDK vérifie le jeton et sa révocation ; `auth_time` doit dater de moins de cinq minutes.
7. Le serveur relit l’identité Auth et `users/{uid}`, exige un UID cohérent et le statut `active`.
8. Les permissions sont recalculées depuis les rôles globaux, appartenances actives et organisations actives au moyen du moteur 8E.
9. Si une permission CRM existe, un cookie de douze heures est créé.
10. Le client détruit immédiatement sa session Firebase Web et navigue vers `/crm`.

Les erreurs restent génériques et ne révèlent pas l’existence d’une adresse.

## Cookies

Le cookie futur est `__Host-aitmesbah_session`, `httpOnly`, `secure`, `sameSite=strict`, `path=/`, sans domaine, pendant douze heures. Le mode local, disponible uniquement avec un identifiant `demo-` et les émulateurs, utilise `aitmesbah_session_local`, `httpOnly`, non sécurisé pour HTTP local, `sameSite=strict`, `path=/`, pendant douze heures. Aucun en-tête client ne peut sélectionner le mode faible.

Le cookie CSRF local est distinct, ne contient aucune donnée personnelle et expire après dix minutes. Les réponses d’authentification utilisent `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et `Referrer-Policy: same-origin`.

## Protection CSRF

Le jeton est produit par `randomBytes(32)`, transmis dans un cookie dédié et séparément dans `X-CSRF-Token`, puis comparé en temps constant. Les opérations de session acceptent uniquement POST ou DELETE selon le Route Handler exporté, du JSON borné à 16 Kio et une origine dont l’hôte correspond exactement à `Host`.

## Profil et permissions

Les statuts `invited`, `suspended`, `revoked`, les profils absents ou incohérents et les identités Auth désactivées sont refusés. `community.content.read` seul n’ouvre pas le CRM.

Permissions fermées ouvrant le shell : `draft.self.manage`, `review.assigned.read`, `editorial.assign`, `editorial.ordinary.publish`, `member.approve`, `organization.member.manage`, `organization.content.manage`, `organization.event.manage`, `committee.communication.prepare`, `role.local.manage`, `role.global.manage`, `settings.manage`, `security.emergency_remove`.

Les custom claims et `organizationMemberships` ne sont jamais autoritatifs. Le contexte retourné contient seulement état, UID, nom d’usage et permissions effectives.

## Réponses et protection de route

Une absence ou invalidité de session mène à `/connexion`. Un compte authentifié mais sans permission reçoit une page d’accès refusé, distincte du cas non authentifié. Le layout serveur recalcule les permissions à chaque accès. Le shell n’affiche aucune donnée métier : seulement l’identité minimale, le caractère privé et six domaines futurs explicitement indisponibles.

## Déconnexion

La déconnexion est une requête DELETE avec les mêmes protections CSRF et origine. Le cookie de session et le cookie CSRF sont réémis avec `maxAge=0`, puis le navigateur retourne à `/connexion`. Aucun lien GET ne déconnecte et aucune révocation globale n’est effectuée pour une sortie ordinaire.

## Émulateurs et procédure locale

Définir les valeurs de `firebase.local.example`, lancer Auth, Firestore et Storage sur le projet `demo-aitmesbah`, puis Next.js sur le port 3100. Les gardes bloquent `aitmesbah-d945d`, `ccs-compta` et tout identifiant ne commençant pas par `demo-`. Les comptes de test sont fictifs et leurs secrets sont générés uniquement en mémoire.

## Limites, risques et fonctions différées

Les événements de connexion et déconnexion sont différés : le catalogue 8H n’est pas élargi sans décision dédiée. Sont également différés : invitation publique, activation, récupération de mot de passe, MFA, fournisseurs externes, interface métier, gestion de comptes et organisations, données d’audit, limitation de débit distribuée, App Check en production et déploiement. La politique de session de douze heures reste provisoire conformément à DEC-005.
