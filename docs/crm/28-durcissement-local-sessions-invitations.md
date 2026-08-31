# Durcissement local des sessions et invitations

## Périmètre

La mission 8P6B1 reste exclusivement locale avec `demo-aitmesbah`. Elle n'active ni Identity Platform, ni MFA, ni email, ni compte réel. Les comptes fictifs utilisent seulement `example.test`.

## Identité et accès

Une session CRM exige simultanément une identité Authentication active, une adresse vérifiée, une adresse normalisée identique à celle du profil autoritatif, un profil `active` et une permission CRM recalculée côté serveur. Les custom claims ne fournissent aucun rôle ou droit. `technical_owner` ne reçoit aucun accès documentaire et les rôles `contributor`, `reviewer` et `editorial_manager` ne reçoivent aucun droit technique implicite.

## Registre serveur des sessions

Après création du cookie Firebase, mais avant son envoi, le serveur calcule son SHA-256 et crée transactionnellement `crmSessions/{empreinte}` avec l'UID, la `sessionVersion` issue de la version monotone du profil, les dates de création et d'expiration et l'état `active`. Le cookie brut n'est jamais persisté ou journalisé. La création relit le profil actif et sa version dans la même transaction que l'écriture du registre ; un échec n'envoie aucun cookie et ne laisse aucun document partiel.

La transaction qui lit ensemble le profil et le registre constitue le point de linéarisation de l'autorisation. La transaction qui incrémente la version constitue celui de la révocation. Une autorisation validée avant la révocation peut terminer ; toute résolution commencée ou retentée après son commit échoue avec l'ancienne version. Cette propriété ne prétend pas annuler rétroactivement une réponse déjà autorisée. Une future mutation métier sensible devra relire cette autorisation dans la transaction de son écriture.

À chaque requête CRM, le cookie, l'UID Auth, l'UID du profil, le document de session et la version courante du profil doivent correspondre. `createdAt` ne peut être futur, `createdAt <= expiresAt`, la durée ne dépasse pas douze heures et l'heure serveur doit précéder strictement `expiresAt`. Un document absent, incomplet, révoqué, expiré ou obsolète échoue fermé ; le TTL éventuel ne servirait qu'au nettoyage.

Toute suspension, révocation ou modification sensible de rôle incrémente déjà la version du profil. Les anciens documents de session deviennent immédiatement invalides et les refresh tokens Firebase sont révoqués. Une récupération administrative future devra utiliser la même primitive. La déconnexion globale incrémente explicitement la version du profil et révoque les refresh tokens.

La version autoritative du compte est régie par un validateur CRM unique, indépendant de Firebase. Elle commence explicitement à `1`, reste un entier sûr positif borné et n'est jamais initialisée implicitement lors d'une lecture ou d'une mutation. Les transitions de statut, changements de rôles, révocations globales et scripts locaux délèguent tous à ce contrat. Un profil historique dépourvu de version échoue fermé ; une réconciliation distincte, locale puis ultérieurement autorisée en dry-run, sera obligatoire avant toute activation distante.

La déconnexion locale tente de révoquer le seul document de session, mais l'effacement des cookies CRM et CSRF reste inconditionnel. Elle ne prétend jamais avoir révoqué les autres navigateurs. La révocation globale est une opération séparée et son échec est signalé sans empêcher l'effacement local.

## Contrat d'invitation

Une invitation possède uniquement les états fermés `pending`, `used` et `revoked`. Elle contient une empreinte SHA-256 du token aléatoire de 256 bits, jamais le token brut, une expiration, un UID fictif, une adresse `example.test`, des rôles vides et une version. Les empreintes hexadécimales validées sont comparées avec `timingSafeEqual`. La consommation relit puis écrit `pending -> used` dans une transaction Firestore : deux consommateurs concurrents produisent un succès et un refus. Elle ne crée ni rôle ni profil `active`.

Les documents Firestore bruts sont validés avant toute projection. `crmSessions` possède exactement les champs `sessionId`, `uid`, `sessionVersion`, `status`, `createdAt`, `expiresAt`, `revokedAt` et `schemaVersion`. Une invitation `pending/v1` possède exactement `invitationId`, `uid`, `email`, `state`, `tokenFingerprint`, `roles`, `createdBy`, `createdAt`, `expiresAt`, `usedAt`, `revokedAt` et `version`. Après consommation, un remplacement complet écrit le schéma `used/v2` composé exactement de `invitationId`, `uid`, `email`, `state`, `createdBy`, `createdAt`, `expiresAt`, `usedAt`, `revokedAt` et `version`; l’empreinte et le tableau de rôles ne sont pas conservés.

Ces fonctions sont des contrats purs : aucun email n'est envoyé et aucune route publique d'activation n'est créée pendant 8P6B1.

## Audit préparé

Le catalogue fermé ajoute les catégories `invitation`, `authentication` et `session`, avec les événements d'invitation, connexion, vérification, récupération, création et révocation de session. Il reste interdit d'y placer un email complet, cookie, token, mot de passe, secret MFA ou valeur d'authentification.

## Limites et NO-GO

La création publique absolue, les fonctions bloquantes, la MFA TOTP, les emails et le limiteur distribué nécessitent des missions séparées. Aucune propriété locale de 8P6B1 ne constitue une autorisation de production ou d'accès distant.
