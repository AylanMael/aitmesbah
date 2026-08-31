# Rate limiting staging — contrat backend-neutre et décision d'architecture

## Portée

Ce document versionne la politique `staging-8p4c-v1`, arbitrée par Amar Hachour le 29 août 2026. Elle vise exclusivement une préproduction privée, avec testeurs identifiés et données fictives. Elle ne constitue ni une politique de production, ni une autorisation de secret, dépense, provisioning ou accès distant.

Le contrat local n'est raccordé à aucune route métier. Les secrets HMAC acceptés pour ses tests sont explicitement fictifs. Le prototype Firestore publié par 8P5A a été disqualifié par 8P5A-D : il conserve les invariants de sécurité, mais ne démontre pas la capacité exigée de 500 appels simultanés et subit une contention structurelle sur les clés chaudes. Firestore est donc abandonné comme backend autoritatif de ce limiteur. Cette décision n'autorise ni implémentation Valkey, ni secret réel, ni provisioning distant.

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
| `contentUpdate` | `contentMutation` | 60 s | — | 20/— | — | 10/— | — | 2 |
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

## Contrat de clés backend-neutre

Une clé opaque est construite par namespace, profil fermé, génération HMAC, catégorie, type d'identité et bucket temporel. Le namespace local validé est `local:demo-aitmesbah:rate-limit:v1`. Il provient exclusivement de la configuration serveur, n'est ni secret ni contrôlable par le client, est validé avant toute décision et doit différer en local, staging et production.

L'entrée HMAC canonique ordonnée est `namespace`, `policyVersion`, `profileName`, `category`, `identityKind`, puis identité brute normalisée, avec séparation non ambiguë. La clé opaque est le SHA-256 ordonné du préfixe de schéma, de `namespace`, `policyVersion`, `profileName`, `category`, `generationId`, `identityKind`, pseudonyme HMAC, `windowSeconds` et `windowStartMs`. Ni l'identité brute ni le HMAC complet ne doivent être persistés ou journalisés par le limiteur.

Le futur backend devra évaluer et consommer atomiquement toutes les identités, fenêtres et générations d'une décision. La consommation des générations courante et précédente est additionnée, tandis que seule la génération courante reçoit une nouvelle consommation. Un bucket absent démarre à zéro ; un état présent mais incomplet, incohérent ou incompatible échoue fermé. Le maximum est de six compteurs logiques et douze clés évaluées pendant une rotation. Un refus n'entraîne aucune consommation partielle.

L'expiration logique égale la fin du bucket. La décision provient exclusivement du calcul de fenêtre avec l'horloge serveur et d'une consommation atomique. Le TTL ne sert qu'au nettoyage asynchrone futur et jamais à la décision.

Le contrat ne définit plus de collection Firestore, de Rules associées ou d'adaptateur Admin SDK. Le futur backend restera exclusivement serveur, inaccessible et non paramétrable par le client.

## Réponses et pannes

Un dépassement certain produit `429` avec un `Retry-After` égal au plus long délai bloquant, borné entre 1 et 300 secondes. Une panne, un timeout, une politique incohérente ou une décision impossible produit `503`. Toutes les nouvelles lectures et mutations CRM échouent fermées. Les données déjà affichées peuvent rester visibles sans actualisation automatique.

La déconnexion locale est l'unique exception : les cookies CRM et CSRF sont effacés même si le quota est dépassé ou indisponible. Une éventuelle révocation distante future devra être distinguée et ne pourra être annoncée sans preuve.

Pour l'upload, aucun parsing complet volontaire, réservation, accès Storage ou effet métier ne peut avoir lieu avant le quota dans les composants contrôlés par l'application. Cette garantie ne prétend pas empêcher le proxy ou le runtime de recevoir préalablement des octets. Aucun octet Storage n'est lu pour un téléchargement refusé.

## Rotation HMAC

Une rotation planifiée autorise deux générations pendant dix minutes. Toutes les fenêtres partagent la même origine temporelle. Le futur backend évalue la génération précédente et la génération courante, additionne leur consommation et incrémente uniquement la génération courante. Les anciennes clés expirent logiquement puis suivent leur TTL, sans suppression massive ni conservation permanente.

En révocation urgente, les admissions cessent, les décisions en cours s'achèvent ou expirent, puis les routes protégées restent fermées pendant au moins la plus longue fenêtre depuis la dernière décision potentiellement autorisée, actuellement 300 secondes. La déconnexion locale reste possible. La réouverture exige une décision humaine documentée.

## Budget, Valkey et migration

Le limiteur dispose d'une enveloppe d'alerte interne de 10 € par mois, sans autorisation de dépense ni garantie de coupure. Les seuils 5 €, 8 €, 10 € et 12 € utilisent coût réalisé, projection mensuelle et marge d'incertitude. Les modèles normal, pointe, rotation et forte cardinalité devront être mesurés avant activation.

Le critère dur de contention a été atteint et autorise uniquement l'étude puis le prototype local Valkey 8P5B. Toute migration réelle exige notamment estimation régionale, budget, réseau privé, IAM, gestion des secrets, topologie, tests, seconde validation humaine indépendante et mission distante distincte. Un seul backend peut être autoritatif à un instant donné. Une bascule ou un rollback ferme les admissions pendant au moins la plus longue fenêtre ; aucun compteur inter-backends n'est fusionné permissivement.

## Validation et conditions d'arrêt

Les tests du catalogue, fenêtres, frontières, atomicité, collisions entre namespaces et profils, rotation, panne, confidentialité, navigation, upload, coûts et rollback sont obligatoires pendant la future implémentation et avant son intégration ou activation. Le test concurrent à 500 appels conserve son objectif de 60 autorisations, 440 refus `limited`, zéro indisponibilité, zéro résultat inconnu et une consommation autoritative de 60. Certains tests supposent que le composant technique correspondant existe.

Il faut arrêter si les gardes locales, l'atomicité, le plafond de compteurs, la provenance réseau future ou l'absence d'identifiants bruts dans le sous-système ne peuvent pas être garantis. L'absence actuelle de backend autoritatif rend staging non prêt. Le NO-GO distant demeure jusqu'à une mission explicitement autorisée.
