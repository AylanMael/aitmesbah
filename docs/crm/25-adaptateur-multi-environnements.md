# Adaptateur multi-environnements fermé

## Statut et limites de 8P1

8P1 prépare uniquement le code. Les seuls environnements canoniques sont `local`, `staging` et `production`; `NODE_ENV` ne sélectionne jamais une cible Firebase. Seul `local` est exécutable. Les modèles distants s’arrêtent avant toute initialisation Firebase et ne désignent aucune ressource réelle.

## Frontières de configuration

`lib/config/public-config.mjs` construit la configuration navigateur à partir de `NEXT_PUBLIC_AITMESBAH_APP_ENV` et des seules valeurs publiques Firebase Web. Aucun secret, cookie, credential, token ou renseignement IAM n’est retourné. `lib/config/server-config.mjs` valide séparément l’environnement serveur, le projet, les émulateurs, les ensembles exacts de Hosts et Origins, les cookies, le secret HMAC lorsqu’il est requis, App Check et le contrat de limitation de débit. Les fonctions prennent un objet d’environnement injecté et ne valident rien à l’import.

| Environnement | Exécution 8P1 | Émulateurs | Cookie | App Check | Débit |
|---|---|---|---|---|---|
| `local` | autorisée | obligatoires, loopback exact | `aitmesbah_session_local`, HTTP, 12 h | `disabled-local` | local non productif |
| `staging` | bloquée avant réseau | interdits | `__Host-aitmesbah_session_staging`, Secure, 12 h max. | modèle `observe` | distribué obligatoire avant activation |
| `production` | bloquée avant réseau | interdits | `__Host-aitmesbah_session`, Secure, 12 h max. | futur `observe`/`enforce` | distribué obligatoire avant activation |

Tous les cookies sont `HttpOnly`, `SameSite=Strict`, `Path=/` et sans `Domain`. Le préfixe `__Host-` impose en plus `Secure`.

## Mode local et gardes

Le projet reste `demo-aitmesbah`. Auth, Firestore et Storage exigent respectivement `127.0.0.1:9099`, `127.0.0.1:8080` et `127.0.0.1:9199`; l’UI Emulator reste configurée sur `127.0.0.1:4000` et Next.js utilise les Hosts exacts `localhost:3100` et `127.0.0.1:3100`. Les Origins exactes sont les variantes HTTP correspondantes. Wildcards, suffixes trompeurs, credentials d’URL, chemins et valeurs distantes sont refusés. `aitmesbah-d945d`, `ccs-compta` et tout projet non `demo-*` restent interdits.

Firebase Web conserve une persistance mémoire et se connecte une seule fois à Auth Emulator. Firebase Admin exige les trois variables d’émulateurs et désactive la détection du serveur de métadonnées avant son initialisation. Aucun fichier JSON ni credential Google réel n’est accepté.

## Variables et erreurs

Le fichier `firebase.local.example` documente les variables locales publiques et serveur. Les futures configurations distantes devront fournir une URL HTTPS canonique, des listes fermées Host/Origin, une configuration Web complète, une identité de runtime gérée, un secret HMAC distinct d’au moins 32 octets et un backend distribué. Les placeholders futurs doivent employer `example.invalid` et `REPLACE_IN_SECRET_MANAGER`; ils ne doivent pas être exécutés pendant 8P1.

Les échecs portent un code stable (`APP_ENV_INVALID`, `APP_ENV_CONFLICT`, `PROJECT_ID_FORBIDDEN`, `LOCAL_EMULATOR_INVALID`, `HOST_INVALID`, `ORIGIN_INVALID`, `HMAC_SECRET_INVALID`, `REMOTE_CONFIG_INCOMPLETE`, `REMOTE_INITIALIZATION_BLOCKED`) et un message générique. Ni secret ni configuration complète n’est inclus dans l’erreur ou les logs.

## Procédures futures

Une mission ultérieure devra définir les domaines et projets réels, l’identité gérée Admin, App Check, le backend distribué, les secrets dans un gestionnaire, puis valider séparément staging et production. Elle devra retirer le verrou d’initialisation distante seulement après revue des Hosts, Origins, cookies, CSP, bundle client, IAM, observabilité et procédures de retour arrière. Aucun déploiement, secret, ressource distante ou activation de service n’appartient à 8P1.

Le contrat documentaire staging détaillé, toujours bloqué avant réseau, est défini dans [la préparation sécurisée de la préproduction](26-preparation-securisee-preproduction.md).
