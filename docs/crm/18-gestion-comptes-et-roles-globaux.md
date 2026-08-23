# Gestion privée des comptes et des rôles globaux

## Périmètre

La mission 8J ouvre uniquement `/crm/comptes` dans l’environnement local `demo-aitmesbah`. Elle permet une consultation serveur bornée, la préparation d’une invitation sans email, les transitions de compte et les rôles globaux ordinaires. Elle n’ouvre ni organisations, ni finance, ni lecture Firestore cliente, ni déploiement.

## Autorisations et matrice

| Opération | Permission exacte | Limite |
|---|---|---|
| Liste et fiche minimale | `profile.assigned.read` | serveur uniquement, 25 par défaut, 100 maximum |
| Préparer et activer | `member.approve` | jamais son propre compte |
| Suspendre, réactiver, révoquer | `member.suspend` | motif et version obligatoires |
| Rôles globaux ordinaires | `role.global.manage` | jamais soi-même, administrateur et propriétaire exclus |
| Nommer administrateur | `administrator.nominate` | indisponible : gouvernance humaine à valider |
| Urgence | `security.emergency_remove` | hors interface ordinaire 8J |

Un acteur doit être actif. Les custom claims et `organizationMemberships` sont ignorés. Le refus est la valeur par défaut. Un administrateur ne reçoit pas implicitement `profile.assigned.read` : les responsabilités doivent être cumulées explicitement et validées.

## Liste, pagination et données

La lecture utilise Admin SDK, un ordre stable par identifiant documentaire, un curseur opaque validé et une limite maximale de 100. Les filtres admis sont statut, rôle connu et préfixe de nom borné. Aucun abonnement, export ou filtre arbitraire n’existe.

Sont sérialisés : UID technique nécessaire aux mutations, nom d’usage, email si la permission de consultation est présente, statut, rôles, état Auth actif/désactivé, dates et version. Jetons, métadonnées Auth, appartenances et données personnelles supplémentaires sont exclus.

## Invitation et transitions

L’invitation normalise nom et email, crée une identité Auth désactivée, puis un profil `invited` sans rôle ni appartenance et `account.invited`. Si l’écriture Firestore échoue, l’identité Auth est supprimée en compensation. Aucun mot de passe ni email n’est produit.

Transitions : `invited → active|revoked`, `active → suspended|revoked`, `suspended → active|revoked`. `revoked` est terminal. Authentication est activée uniquement pour `active`; suspension et révocation désactivent l’identité et révoquent les jetons. Une compensation restaure l’état Auth antérieur si la transaction Firestore échoue.

## Rôles et protections

Les rôles ordinaires attribuables sont : membre en attente, membre approuvé, contributeur, relecteur, responsable éditorial, référent mémoire et archives, responsable communautaire. `administrator` et `technical_owner` ne sont jamais proposés ni acceptés. Le propriétaire technique ne peut être modifié. Auto-attribution, auto-activation, auto-suspension et auto-révocation sont interdites.

Chaque mutation compare `expectedVersion` dans une transaction. Un conflit retourne HTTP 409 sans écrasement. Les corps JSON sont fermés, bornés et protégés par session, permission, CSRF et correspondance Origin/Host.

## Audit

Le catalogue 8H est étendu par la décision approuvée `account.roles_changed`, catégorie `account`. Le motif est obligatoire et `changedFields` contient seulement `globalRoles`. Les transitions conservent `account.status_changed`; les invitations utilisent `account.invited`. Email, nom, corps HTTP, cookie et jetons ne sont jamais journalisés.

## Tests et limites

Les tests couvrent limites, filtres, normalisation, permissions, acteur inactif, auto-élévation, propriétaire, transitions, conflits, motifs, sérialisation, invitation Auth désactivée, pagination sans doublon, activation, suspension, réactivation, révocation terminale, rôle et audit. Firestore et Storage restent fermés par les règles historiques.

Restent différés : nomination d’administrateur, gouvernance du propriétaire, MFA, email d’invitation, récupération de mot de passe, affectations individuelles de profils, recherche avancée, exports, organisations et exploitation distante.
