# Rôles et permissions

## Règles communes

Les rôles sont cumulatifs seulement si leur compatibilité est validée. Toute attribution et tout retrait sont journalisés. Un rôle global concerne la plateforme ; un rôle local concerne une seule organisation. Un administrateur n’accède pas automatiquement aux contributions restreintes. La MFA est future et obligatoire pour les rôles à risque.

## Catalogue

| Rôle | Type/portée | Finalité, attribution et droits | Interdictions, retrait et contrôle |
|---|---|---|---|
| Visiteur | Public | Consulter le contenu public | Aucun accès protégé ; traces techniques minimales |
| Membre en attente | Global personnel | Consulter sa demande et son profil minimal | Aucun accès community ; refus/annulation journalisé |
| Membre approuvé | Global personnel | Consulter le contenu communautaire | Aucun CRM ; suspension/révocation motivée |
| Contributeur | Global personnel | Créer ses brouillons et soumissions | Ne publie pas ; versions journalisées |
| Relecteur | Global, affectation | Lire et commenter les dossiers affectés | Aucun accès général ni auto-affectation |
| Responsable éditorial | Global | Affecter, décider et publier l’ordinaire | Pas de décision sensible solitaire ; MFA future |
| Référent mémoire et archives | Global, affectation | Vérifier provenance, droits et certitude | Ne publie pas seul son dépôt ; MFA future |
| Responsable communautaire | Global | Traiter accès, suspension et règles | Aucun accès automatique aux brouillons ; MFA future |
| Responsable d’association | Local | Gérer membres, contenus et événements de son organisation | Aucun accès inter-organisations ; MFA future |
| Représentant mandaté du comité | Local, mandat limité | Préparer une communication couverte par le mandat | Aucun usage « officiel » sans preuve ; expiration du rôle |
| Responsable financier futur | Local | Gérer les opérations futures de son organisation | Inactif avant validations ; double contrôle et MFA |
| Administrateur | Global | Gérer rôles autorisés et paramètres | Aucun contenu restreint par défaut ; MFA obligatoire |
| Propriétaire technique | Global exceptionnel | Sécurité, nomination des administrateurs, retrait exceptionnel | Pas d’opérations quotidiennes ; accès motivé et audité ; MFA |

Les identités sont **à déterminer**. Incompatibilités : auteur et double valideur de son contenu sensible ; initiateur et unique approbateur d’un remboursement ; usage d’un rôle local pour croiser des organisations.

## Matrice des permissions

P = personnelle, A = affectation, O = organisationnelle, G = globale ; S = validation simple, D = double.

| Permission | Bénéficiaire | Portée | Risque | Validation | Journalisation |
|---|---|---:|---|---|---|
| Créer/consulter sa demande | Membre en attente | P | Faible | — | Changements |
| Approuver/refuser/suspendre un membre | Responsable communautaire | G limitée | Élevé | S motivée | Complète |
| Consulter profils minimaux | Responsable communautaire | G limitée | Moyen | Affectation | Accès sensible |
| Créer/modifier son brouillon | Contributeur | P | Faible | — | Versions |
| Lire contribution non publiée | Auteur, relecteur affecté, éditorial habilité | P/A | Élevé | Affectation | Accès/export |
| Affecter relecteur | Responsable éditorial | G limitée | Moyen | S | Complète |
| Demander changement/rejeter | Relecteur ou éditorial habilité | A | Moyen | S motivée | Décision |
| Publier contenu ordinaire | Responsable éditorial | G/O | Élevé | S | Complète |
| Publier contenu sensible | Deux habilités distincts | A | Critique | D | Nominative |
| Corriger/dépublier | Éditorial ; association dans son espace | G/O | Élevé | S ou D si sensible | Complète |
| Retrait préventif exceptionnel | Propriétaire ou habilité sécurité | G | Critique | S urgente puis revue | Complète |
| Gérer archive/provenance | Référent archives | A | Élevé | S documentaire | Versions/décision |
| Accéder à un original futur | Habilités dédiés | A | Critique | D | Chaque accès |
| Gérer consentement/diffusion | Référent et éditorial affectés | A | Critique | D si sensible | Complète |
| Gérer témoignage | Relecteur/éditorial | A | Élevé | S, D si délicat | Complète |
| Gérer événement | Éditorial ou association | G/O | Moyen | S | Changements |
| Vérifier organisation | Administrateur habilité | G | Élevé | S avec preuve | Complète |
| Gérer membres d’organisation | Responsable d’association | O | Élevé | S | Complète |
| Communication du comité | Mandaté + éditorial | O | Critique | D si institutionnelle | Mandat/décision |
| Campagne/paiement futur | Association + financier futur | O | Critique | D | Complète |
| Initier remboursement futur | Financier futur | O | Critique | D par autre personne | Complète |
| Export personnel | Utilisateur | P | Moyen | Identité vérifiée | Complète |
| Export d’organisation limité | Responsable autorisé | O | Critique | D | Motif/destinataire |
| Export massif futur | Aucun au MVP | G/O | Critique | D + validation compétente | Complète |
| Attribuer/révoquer rôle local | Administrateur habilité | O | Élevé | S | Complète |
| Attribuer/révoquer rôle global | Administrateur habilité | G | Critique | D si rôle élevé | Complète |
| Nommer administrateur | Propriétaire technique | G | Critique | Gouvernance à valider | Complète |
| Modifier paramètres | Administrateur | G | Élevé | S/D selon impact | Complète |
| Consulter audit | Habilité audit/propriétaire en incident | G/O | Critique | Affectation | Consultation tracée |

Voir [le modèle conceptuel](03-modele-de-donnees.md) et [les circuits](04-circuits-de-validation.md).
