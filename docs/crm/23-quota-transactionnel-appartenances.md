# Quota transactionnel des appartenances

`membershipQuotas/{uid}` confirme uniquement l'intégrité du nombre d'appartenances occupantes. Il ne contient ni organisation, ni rôle, ni permission, et ne confère aucun accès. Les documents `organizations/{organizationId}/memberships/{uid}` restent l'unique source des permissions.

Le plafond est 50 et la limite de détection 51. `invited`, `active` et `suspended` occupent un emplacement ; `revoked` n'en occupe aucun. Les lectures d'autorisation utilisent une unique requête `collectionGroup("memberships")` filtrée par UID et par ces trois statuts, ordonnée par chemin documentaire et limitée à 51. L'index composite `uid`, `status`, `__name__` est le seul index ajouté. Les documents révoqués restent canoniques comme historique et ne sont lus que par chemin exact ou par une liste administrative séparée, paginée et non autoritative.

Les créations, réactivations et révocations lisent dans une même transaction le document ciblé, la requête occupante bornée et le quota. Le compteur est comparé au résultat avant toute écriture. Une création ou réactivation passe de 0 à 1 emplacement ; une révocation de 1 à 0 ; les autres transitions et changements de rôle ont un delta nul. Une incohérence, une limite atteinte ou 51 résultats provoque un refus fermé sans permission partielle.

La projection `users.organizationMemberships` est recalculée après la transaction canonique. Son échec n'annule pas la transaction et ne confère ni ne retire aucun droit ; une réconciliation ultérieure peut la reconstruire.

Le script `scripts/firebase/reconcile-membership-quotas.mjs` est exclusivement protégé pour `demo-aitmesbah` et l'émulateur Firestore. Sans option, il produit un plan minimal sans données personnelles. `--apply` écrit les quotas uniquement si aucune anomalie n'est détectée. Il n'est pas exposé comme script npm et ne doit jamais être utilisé contre un projet réel.

La collection `membershipQuotas` est fermée en lecture et écriture à tous les SDK clients, y compris pour les administrateurs et les faux custom claims. Seul l'Admin SDK local y accède.

Le catalogue d'audit fermé ne possède pas encore d'événement dédié au refus de quota. 8O-C1 conserve les événements canoniques d'invitation et de changement de statut et documente comme besoin futur un événement minimal `membership.quota_rejected`, sans enregistrer le compteur ni la liste des organisations.
