# Registre local d’activation CRM

## Décision 8P6B2A

`users.status` reste limité à `invited`, `active`, `suspended` et `revoked`. La progression d’activation est enregistrée côté serveur dans `crmActivations/{activationId}`. Tous les accès SDK clients à cette collection sont refusés.

Le document fermé contient exactement 17 champs : `activationId`, `invitationId`, `uid`, `email`, `approvedGlobalRoles`, `state`, `mfaRequired`, `createdAt`, `expiresAt`, `passwordCompletedAt`, `emailVerifiedAt`, `mfaCompletedAt`, `completedAt`, `cancelledAt`, `expiredAt`, `version` et `schemaVersion`. Les documents Firestore exigent de véritables `Timestamp`; le contrat pur ne manipule que leurs millisecondes entières sûres. `expiredAt` vaut `null` hors de l’état `expired`.

Les fonctions initiales sont `technical_owner`, `contributor`, `reviewer` et `editorial_manager`. Une invitation porte exactement une fonction : tous les cumuls sont incompatibles dans ce noyau initial. `administrator` est interdit. Les quatre fonctions exigent MFA.

La consommation transactionnelle copie la fonction depuis l’invitation autoritative, remplace l’invitation par son schéma `used` sans rôle ni empreinte, puis crée un unique registre. L’identifiant du registre est `SHA-256("crm-activation:v1:" + invitationId)`, calculé seulement après égalité entre le chemin et l’identifiant autoritatif. Il ne contient ni UID, email, rôle ni token. Le profil canonique doit rester `invited`, sans rôle actif, avec une version valide; l’identité Auth reste désactivée avec une adresse non vérifiée.

Les états fermés sont `password_pending`, `email_verification_pending`, `mfa_enrollment_pending`, `ready_for_activation`, `completed`, `cancelled` et `expired`. Les preuves de mot de passe et d’email ne peuvent provenir que d’un adaptateur serveur futur. Aucune API locale ne peut produire une preuve MFA : la transition depuis `mfa_enrollment_pending` et toute complétion d’un compte soumis au MFA échouent fermées jusqu’à une validation Identity Platform en staging.

Le registre ne contient jamais mot de passe, token d’invitation, code d’action, secret TOTP, code de récupération, cookie, ID token, custom claim, permissions calculées ou rôle fourni par le client.
