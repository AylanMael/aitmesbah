# Modèle conceptuel des données

## Principes

Modèle indépendant de tout moteur. Chaque objet possède identifiant non signifiant, dates, statut, niveau `public`, `community` ou `restricted` et références d’audit. Toute conservation est provisoire jusqu’à validation juridique.

## Identité et autorisations

| Entité | Objectif et champs conceptuels | Relations/statuts | Confidentialité, gestion, conservation et intégrité |
|---|---|---|---|
| Utilisateur | Connexion, état, activation/suspension | Profil, demandes, rôles ; pending/active/suspended/closed | Restricted ; activation manuelle ; suppression/pseudonymisation à valider |
| Profil | Nom d’usage, lien court, règles, région/pays et référent facultatifs | Un utilisateur ; incomplete/complete/limited | Restricted ; champs modifiables encadrés ; durée à valider |
| Demande d’accès | Origine, justification, décision/motif | Utilisateur ; draft/submitted/approved/rejected/cancelled | Restricted ; demandeur puis responsable ; trace minimale |
| Organisation | Nom, type, vérification, mandat/preuve/échéance | Adhésions, rôles locaux, contenus | Champs à niveaux séparés ; mandat expiré invalide l’attribution officielle |
| Adhésion organisationnelle | Personne, organisation, qualité, dates | Rôles locaux ; pending/active/suspended/ended | Restricted à l’organisation ; unicité personne/organisation/période |
| Rôle | Nom, type global/local, description | Permissions/attributions ; active/retired | Restricted ; retrait non réutilisé silencieusement |
| Permission | Action, ressource, portée, contraintes | Rôles ; active/retired | Restricted ; aucune permission implicite |
| Attribution de rôle | Sujet, rôle, portée, motif, début/fin | Utilisateur/organisation | Restricted ; expiration/révocation et historique minimal |

## Éditorial, mémoire et droits

| Entité | Objectif et champs conceptuels | Relations/statuts | Confidentialité, gestion, conservation et intégrité |
|---|---|---|---|
| Contribution | Auteur, titre, texte, audience | Contenu, sources, décisions ; workflow du document 04 | Restricted avant publication ; auteur/affectés ; versions traçables |
| Contenu | Titre, corps, audience, attribution | Contribution, versions, organisation | Tous niveaux ; publication liée à version approuvée |
| Version de contenu | Instantané, auteur, motif, date | Contenu/décisions ; draft/frozen/published/superseded | Jamais écrasée ; durée éditoriale à valider |
| Décision éditoriale | Type, décideur, motif, date, réserves | Contribution/version | Restricted ; immuable, rectifiée par nouvelle décision |
| Source | Référence, provenance, nature, certitude | Contributions/archives/témoignages | Niveau adapté ; distingue fait, mémoire, tradition |
| Document | Description, auteur, date, droits | Fichier/archive/source | Niveau adapté ; métadonnées selon droits/retrait |
| Fichier | Format, taille, empreinte, catégorie | Document/version de consultation | Restricted par défaut ; original différé ; retrait tracé |
| Archive | Provenance, déposant, propriétaire, datation, certitude, droits | Documents/sources/consentements/crédits | Quarantaine restricted ; double validation si sensible |
| Témoignage | Témoin, récit, tiers, sensibilité, anonymisation | Consentements/sources/versions | Restricted ; retrait facilité, diffusion bornée |
| Consentement | Personne, objet, portée, date, preuve, retrait | Témoignage/document/fichier | Restricted ; nouvelle trace à chaque évolution ; durée à valider |
| Droit de diffusion | Titulaire, fondement, audience, durée | Document/contenu | Expiration bloque la diffusion |
| Crédit | Formulation, anonymat autorisé | Contenu/document | Public seulement si autorisé ; cohérent avec droits |

## Communauté et contrôle

| Entité | Objectif et champs conceptuels | Relations/statuts | Confidentialité, gestion, conservation et intégrité |
|---|---|---|---|
| Événement | Titre, dates, lieu minimisé, organisateur, audience | Organisation/contenus ; draft/review/approved/published/updated/unpublished | Niveau adapté ; cohérence temporelle |
| Projet | Objet, organisation, période, audience | Contenus/événements ; active/closed/archived | Responsable local ; cloisonné |
| Demande de correction/retrait | Demandeur, cible, motif, urgence, décision | Contenu/décision/notifications | Restricted ; trace motivée minimale |
| Notification | Destinataire, événement, canal, état | Workflow | Restricted ; contenu minimisé, expiration à définir |
| Journal d’audit | Acteur, action, cible, portée, résultat, motif | Actions sensibles | Restricted ; accès très limité ; intégrité/durée à valider |
| Événement de sécurité | Signal, gravité, périmètre, mesures, résolution | Utilisateurs/sessions/audit | Restricted critique ; preuves protégées |

## Modules financiers différés

| Entité | Objet et statuts | Contraintes |
|---|---|---|
| Campagne | Bénéficiaire, période, objectif ; draft/approved/open/closed/cancelled | Bénéficiaire identifié, double validation |
| Cotisation | Période, catégorie, montant, état | Cadre associatif/comptable validé |
| Don | Campagne, montant, anonymat public, reçu éventuel | Cadre juridique/fiscal validé |
| Paiement | Référence externe, montant, devise, état | Aucune donnée bancaire complète ; prestataire externe |
| Remboursement | Paiement, montant, motif, initiateur/approbateur | Deux personnes distinctes, audit complet |

## Contraintes transversales

Un rôle local référence une seule organisation. Une contribution non publiée est réservée à l’auteur et aux affectés. Toute publication référence version et décision valides ; le sensible a deux approbateurs distincts. Un mandat comporte preuve, périmètre et échéance. Consentement, diffusion et crédit ne se déduisent pas mutuellement. Une suppression litigieuse est gelée pendant l’examen.

Voir [les circuits](04-circuits-de-validation.md) et [la sécurité](05-securite-et-confidentialite.md).
