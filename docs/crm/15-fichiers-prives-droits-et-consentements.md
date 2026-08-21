# Fichiers privés, droits et consentements

## Périmètre et principe de sécurité

La mission 8G établit uniquement un socle local pour les originaux liés aux contributions. Tout fichier demeure privé, y compris après validation éditoriale. La validation technique ne publie rien et ne signifie jamais qu’un fichier est exempt de logiciel malveillant. L’accès client à Storage et aux métadonnées Firestore est refusé par défaut ; les opérations passent par l’administration locale connectée aux trois émulateurs du projet explicite `demo-aitmesbah`.

Sont exclus : collecte publique, pièces jointes dans le site, interface CRM, URL publique, téléchargement client, mineurs, reconnaissance faciale, OCR, analyse antivirus externe, déploiement et accès à un projet Firebase distant.

## Formats, limites et contrôle

Décisions provisoires à réévaluer avec le cadre juridique et l’exploitation :

| Famille | Extensions | MIME | Limite |
|---|---|---|---:|
| Images | `.jpg`, `.jpeg`, `.png`, `.webp` | `image/jpeg`, `image/png`, `image/webp` | 15 MiB |
| Document | `.pdf` | `application/pdf` | 25 MiB |

Un fichier vide, SVG, HTML, JavaScript, archive ou exécutable est refusé. Le serveur vérifie conjointement l’extension, le MIME déclaré, la signature binaire et la taille. Le nom original n’est pas conservé dans Storage : après rejet des traversées, caractères de chemin et données personnelles évidentes, un nom opaque est généré. Le chemin canonique est `private/contributions/{contributionId}/{assetId}/original`.

Le SHA-256 est calculé sur les octets reçus. Il sert à signaler un doublon uniquement dans une même contribution. Aucune déduplication ni comparaison inter-organisations n’est autorisée.

## Métadonnées et états

La fiche d’un fichier contient les identifiants opaques du fichier, de la contribution, de l’organisation éventuelle et de l’auteur du dépôt, le chemin privé, le nom sûr, les MIME déclaré et détecté, taille, SHA-256, états du fichier, de l’analyse, des droits et du consentement, dates, acteurs et version.

Cycle autorisé :

1. `reserved` réserve les identifiants et le chemin sans octets.
2. `quarantined` signifie que les contrôles de structure ont réussi et que l’original est stocké en zone privée.
3. `validated` exige des droits `cleared`, un consentement `granted` ou `not_required`, et aucune analyse en échec.
4. `rejected` conserve la décision avant une éventuelle suppression.
5. `withdrawn` retire l’usage sans effacer immédiatement la preuve de décision.
6. `pending_deletion` autorise une suppression physique future après contrôle des références.
7. `deleted` atteste la suppression des octets tout en conservant une trace minimale.

Les états d’analyse sont `not_scanned`, `pending`, `passed`, `failed` et `unavailable`. En 8G, aucun antivirus n’est exécuté : après le contrôle de signature, l’état est `unavailable`, jamais `passed`. Un fichier ainsi validé reste techniquement non déclaré sûr contre les logiciels malveillants.

## Droits

Une déclaration de droits est rattachée à la contribution et, si nécessaire, à un fichier. Elle enregistre une origine, une référence minimisée du détenteur, la base et le périmètre d’autorisation, le crédit, l’état, les acteurs, les dates de décision ou de retrait et une version. États : `unknown`, `pending`, `cleared`, `not_applicable`, `withdrawn`, `rejected`.

La validation `cleared` est une décision humaine traçable, pas une déduction technique. Le retrait rend tout nouvel usage impossible. La qualification juridique des preuves, leur conservation et les durées restent **à valider**.

## Consentements

Le consentement décrit une personne par référence opaque, la finalité, le périmètre, l’état, les acteurs, les dates et la version. États : `not_required`, `pending`, `granted`, `withdrawn`, `rejected`. Aucun compte ou contenu sensible concernant un mineur n’entre dans ce socle. La portée, la preuve et la durée de conservation restent **à valider juridiquement**.

## Retrait et suppression

Le retrait est immédiat au niveau métier et audité. La suppression physique est exclusivement administrative et serveur : elle exige `pending_deletion`, vérifie l’absence de référence bloquante, supprime l’objet Storage, puis marque la métadonnée `deleted`. La métadonnée minimale et l’audit sont conservés afin d’expliquer qui a décidé quoi, quand et pourquoi. Les règles de rétention définitives restent différées.

## Traçabilité

Les familles d’événements sont `asset.*`, `rights.*` et `consent.*`. Chaque événement possède au minimum l’acteur, la cible, la version et l’horodatage ; le motif accompagne les décisions qui l’exigent. Les données personnelles réelles et les secrets sont interdits dans les fixtures et les journaux.

## Garanties testées localement

- détection JPEG, PNG, WebP et PDF avec données synthétiques ;
- rejet du vide, des incohérences, formats actifs, archives, exécutables et dépassements ;
- chemin privé opaque, quarantaine et SHA-256 ;
- transitions et prérequis de validation ;
- doublon limité à la contribution ;
- refus client Firestore et Storage, y compris lecture, liste, création, remplacement et suppression ;
- administration locale, retrait, blocage d’une suppression référencée, suppression physique et audit ;
- non-régression des missions antérieures.

## Décisions différées

Restent différés : service antivirus, politique de conservation définitive, sauvegarde et restauration des originaux, accès CRM humain, consultation d’archives, cadre des mineurs, publication ou dérivés, chiffrement complémentaire, procédures juridiques et déploiement. La mission suivante dépend de la validation et du commit séparé de 8G.
