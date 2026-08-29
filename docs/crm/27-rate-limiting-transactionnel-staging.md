# Rate limiting transactionnel staging — contrat 8P4C

## Portée

Ce document versionne la politique `staging-8p4c-v1`, arbitrée par Amar Hachour le 29 août 2026. Elle vise exclusivement une préproduction privée, avec testeurs identifiés et données fictives. Elle ne constitue ni une politique de production, ni une autorisation de secret, dépense, provisioning ou accès distant.

Le noyau 8P5A reste local, utilise `demo-aitmesbah` et les émulateurs Auth, Firestore et Storage sur loopback, et n'est raccordé à aucune route métier. Les secrets HMAC acceptés par ce noyau sont explicitement fictifs et réservés aux tests locaux.

## Catalogue fermé et matrice initiale

Chaque opération appartient à exactement une catégorie. Une route sans catégorie ou une catégorie inconnue échoue fermée ; aucune valeur permissive par défaut n'existe.

| Profil | Catégorie | Principale | Courte | UID P/C | Réseau P/C | Ressource P/C | Session P/C | Compteurs max. |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `csrfBootstrap` | `csrfBootstrap` | 60 s | — | — | 30/— | — | — | 1 |
| `sessionCreate` | `session` | 60 s | 10 s | 10/3 | 50/15 | — | — | 4 |
| `sessionLogout` | `session` | 60 s | 10 s | 30/10 | — | — | 30/10 | 4 |
| `ordinaryRead` | `ordinaryRead` | 60 s | — | 60/— | — | — | — | 1 |
| `privilegedMutation` | `privilegedMutation` | 60 s | 10 s | 20/5 | — | 10/3 | — | 4 |
| `contentCreate` | `contentMutation` | 60 s | — | 20/— | — | — | — | 1 |
| `contentMutation` | `contentMutation` | 60 s | — | 20/— | — | 10/— | — | 2 |
| `editorialDecision` | `editorialDecision` | 60 s | — | 30/— | — | 10/— | — | 2 |
| `assetMutation` | `assetMutation` | 60 s | — | 20/— | — | 10/— | — | 2 |
| `upload` | `upload` | 300 s | 30 s | 10/2 | 50/10 | 10/2 | — | 6 |
| `download` | `download` | 60 s | 10 s | 60/15 | — | 30/10 | — | 4 |
| `deletion` | `deletion` | 300 s | 30 s | 10/2 | — | 2/1 | — | 4 |
| `auditRead` | `auditRead` | 60 s | — | 30/— | — | — | — | 1 |

Les onze catégories sont `csrfBootstrap`, `session`, `ordinaryRead`, `privilegedMutation`, `contentMutation`, `editorialDecision`, `assetMutation`, `upload`, `download`, `deletion` et `auditRead`. Chaque requête consomme une unité. Le ratio réseau/UID initial est de cinq lorsque les deux dimensions existent. Les rafales inhérentes aux frontières des fenêtres fixes sont acceptées pour staging sous réserve des tests de concurrence.

## Ordre de décision et confidentialité

L'intégration future devra suivre cet ordre : extraction réseau depuis une source de confiance, normalisation, HMAC immédiat, retrait de la valeur brute du contexte du limiteur, validation structurelle, authentification, autorisation, validation de cible, construction des compteurs, transaction de quota, puis opération métier.

La restriction sur les identifiants bruts concerne les clés, documents, compteurs, journaux, métriques et erreurs du sous-système de rate limiting. Elle n'empêche pas le code métier de manipuler un UID ou un identifiant de ressource pour autoriser et exécuter l'opération demandée. Les journaux éventuels du proxy ou de l'hébergeur relèvent d'une gouvernance d'infrastructure séparée.

Une cible inexistante, interdite ou invalide ne crée aucun compteur de ressource. `K_session` ne s'applique pas à la création de session et ne remplace jamais `K_uid`. Sans provenance réseau démontrée, aucune valeur directement fournie par le client ou `X-Forwarded-For` n'est utilisable et l'ouverture staging reste bloquée.

## Modèle Firestore et atomicité

La collection serveur `rateLimitCounters` contient un document par génération HMAC, catégorie, type d'identité et bucket temporel. Son identifiant est un SHA-256 d'un HMAC et des dimensions du bucket ; ni l'identité brute ni le HMAC complet ne sont persistés. Un document contient seulement la version de schéma et de politique, la catégorie, le type d'identité, l'identifiant non secret de génération, les bornes de fenêtre, la consommation et les horodatages.

Toutes les identités, fenêtres et générations d'une décision sont lues dans une transaction Firestore unique. La décision somme les consommations des générations courante et précédente. Si tous les compteurs autorisent, la transaction écrit chaque consommation dans la génération courante ; sinon elle n'écrit rien. Le maximum est de six compteurs logiques, six écritures et, pendant une rotation, douze lectures. Tout dépassement, document incohérent, timeout ou résultat indéterminé échoue fermé.

`expiresAt` égale la fin logique du bucket. La décision provient exclusivement du calcul de fenêtre avec l'horloge serveur et de la consommation transactionnelle. Le TTL ne sert qu'au nettoyage asynchrone futur ; aucun index composite n'est requis par ce modèle.

Les Rules interdisent toute lecture ou écriture cliente de `rateLimitCounters`, indépendamment de l'authentification ou des claims. Seul l'Admin SDK local protégé par les gardes `demo-*` peut exercer les tests 8P5A.

## Réponses et pannes

Un dépassement certain produit `429` avec un `Retry-After` égal au plus long délai bloquant, borné entre 1 et 300 secondes. Une panne, un timeout, une politique incohérente ou une décision impossible produit `503`. Toutes les nouvelles lectures et mutations CRM échouent fermées. Les données déjà affichées peuvent rester visibles sans actualisation automatique.

La déconnexion locale est l'unique exception : les cookies CRM et CSRF sont effacés même si le quota est dépassé ou indisponible. Une éventuelle révocation distante future devra être distinguée et ne pourra être annoncée sans preuve.

Pour l'upload, aucun parsing complet volontaire, réservation, accès Storage ou effet métier ne peut avoir lieu avant le quota dans les composants contrôlés par l'application. Cette garantie ne prétend pas empêcher le proxy ou le runtime de recevoir préalablement des octets. Aucun octet Storage n'est lu pour un téléchargement refusé.

## Rotation HMAC

Une rotation planifiée autorise deux générations pendant dix minutes. Toutes les fenêtres partagent la même origine temporelle. Le noyau lit la génération précédente et la génération courante, additionne leur consommation et écrit uniquement la génération courante. Les anciens documents expirent logiquement puis suivent leur TTL, sans suppression massive ni conservation permanente.

En révocation urgente, les admissions cessent, les décisions en cours s'achèvent ou expirent, puis les routes protégées restent fermées pendant au moins la plus longue fenêtre depuis la dernière décision potentiellement autorisée, actuellement 300 secondes. La déconnexion locale reste possible. La réouverture exige une décision humaine documentée.

## Budget, Valkey et migration

Le limiteur dispose d'une enveloppe d'alerte interne de 10 € par mois, sans autorisation de dépense ni garantie de coupure. Les seuils 5 €, 8 €, 10 € et 12 € utilisent coût réalisé, projection mensuelle et marge d'incertitude. Les modèles normal, pointe, rotation et forte cardinalité devront être mesurés avant activation.

Un critère dur ou deux critères souples persistants pendant trois périodes représentatives prédéfinies autorisent uniquement une étude Valkey. Une migration exige notamment estimation régionale, budget, réseau privé, IAM, gestion des secrets, topologie, tests, seconde validation humaine indépendante et mission distante distincte. Firestore ou Valkey est seul autoritatif à un instant donné. Une bascule ou un rollback ferme les admissions pendant au moins la plus longue fenêtre ; aucun compteur inter-backends n'est fusionné permissivement.

## Validation et conditions d'arrêt

Les tests du catalogue, fenêtres, frontières, atomicité, concurrence jusqu'à 500 appels, rotation, Rules, panne, confidentialité, navigation, upload, coûts et rollback sont obligatoires pendant l'implémentation et avant son intégration ou activation. Certains supposent que le composant technique correspondant existe.

Il faut arrêter si les gardes `demo-*`, l'atomicité, la fermeture des Rules, le plafond de compteurs, la provenance réseau future ou l'absence d'identifiants bruts dans le sous-système ne peuvent pas être garantis. L'absence du backend rend staging non prêt. Le NO-GO distant demeure jusqu'à une mission explicitement autorisée.
