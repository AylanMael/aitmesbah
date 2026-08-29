# Préparation sécurisée de la préproduction Firebase

## Statut, nomenclature et décision 8P2

Ce document définit un contrat futur, sans projet ni ressource distante. `staging.aitmesbah.example` et `https://staging.aitmesbah.example` utilisent le domaine réservé `.example`. Le Project ID documentaire est `REPLACE_WITH_APPROVED_STAGING_PROJECT_ID`; cette sentinelle est inexécutable. La région `europe-west4` est provisoire. **Décision 8P2 : NO-GO**, car aucun provisioning n’est approuvé ou réalisé.

Le catalogue reste `local`, `staging`, `production`. `NODE_ENV` ne choisit jamais Firebase. Staging exige HTTPS et interdit localhost, les projets `demo-*`, les émulateurs, les clés JSON et toute activation distante. Les configurations publique et serveur doivent annoncer `staging`; le serveur conserve `AITMESBAH_REMOTE_ACTIVATION=disabled`. Un changement `NEXT_PUBLIC_*` ne peut rien activer.

## Contrat canonique staging

| Élément | Contrat fermé |
|---|---|
| Projet | Injecté après approbation; distinct de local et production; sentinelle et exemples refusés |
| Région | `europe-west4`, documentaire et à approuver |
| URL, Host, Origin | HTTPS et correspondance exacte au domaine `.example`; aucun wildcard/loopback |
| Cookie | `__Host-aitmesbah_session_staging`; Secure, HttpOnly, SameSite=Strict, Path=/, sans Domain, 12 h max. |
| Firebase Web | Configuration publique future; initialisation distante bloquée en 8P2 |
| Admin SDK | Identité attachée au runtime future; aucun fichier JSON, ADC de poste ou fallback local |
| HMAC | Secret distinct, ≥32 octets, gestionnaire futur, aucune valeur d’exemple |
| App Check | `observe`; aucun provider, SDK ou debug token en 8P2 |
| Débit | Backend distribué obligatoire, namespace staging séparé, aucun fallback mémoire productif |

Production refuse le Project ID et les domaines staging; staging refuse ceux de production. `demo-aitmesbah`, `aitmesbah-d945d` et `ccs-compta` sont interdits. L’activation distante reste bloquée avant Firebase Web et Admin SDK.

## Matrice canonique des variables

| Variable | Classe / secret | Obligation | Responsable et emplacement futurs | Rotation / bundle | Échec et interdictions |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_AITMESBAH_APP_ENV` | publique, non secrète | `staging` | application, build approuvé | contrôlée; oui | conflit serveur: refus |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | publique, non secrète | obligatoire | opérateur, build | avec projet; oui | sentinelle/demo/production: refus |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | publique, non secrète | future obligatoire | opérateur, build | politique Firebase; oui | absence: refus; jamais secret serveur |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | publique, non secrète | future obligatoire | opérateur, build | avec domaine; oui | domaine non approuvé: refus |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | publique, non secrète | future si requise | opérateur, build | avec application; oui | aucune valeur inventée |
| `NEXT_PUBLIC_AITMESBAH_APP_CHECK_MODE` | publique, non secrète | future si requise | sécurité/application | approuvée; oui | différent de `observe`: refus |
| `NEXT_PUBLIC_FIREBASE_USE_EMULATORS` | publique, non secrète | `false` | application | stable; oui | `true`: refus |
| `AITMESBAH_APP_ENV` | serveur, non secrète | `staging` | opérateur/runtime | stable; non | conflit public: refus |
| `GCLOUD_PROJECT` | serveur, non secrète | future obligatoire | runtime géré | avec projet; non | divergence: refus |
| `AITMESBAH_REGION` | serveur, non secrète | obligatoire | architecture | décision régionale; non | autre valeur: refus |
| `AITMESBAH_CANONICAL_URL` | serveur, non secrète | obligatoire | opérations | avec domaine; non | HTTP/loopback/credentials: refus |
| `AITMESBAH_ALLOWED_HOSTS` | serveur, non secrète | obligatoire | sécurité | revue domaine; non | wildcard/vide: refus |
| `AITMESBAH_ALLOWED_ORIGINS` | serveur, non secrète | obligatoire | sécurité | revue origine; non | non-HTTPS/wildcard: refus |
| `AITMESBAH_APP_CHECK` | serveur, non secrète | `observe` | sécurité | mission future; non | autre mode: refus |
| `AITMESBAH_RATE_LIMIT_BACKEND` | serveur, non secrète | obligatoire | opérations/sécurité | avec backend; non | absence/mémoire: refus |
| `AITMESBAH_REMOTE_ACTIVATION` | serveur, non secrète | `disabled` | sécurité | mission dédiée; non | activation: refus avant réseau |
| `CRM_CURSOR_HMAC_SECRET` | serveur, secrète | future obligatoire | responsable secrets, gestionnaire | rotation; jamais | absent/court/fictif: refus |
| secret du limiteur | serveur, secret | futur si démontré | responsable secrets | rotation; jamais | aucun défaut ou log |

Sont interdits : toute `NEXT_PUBLIC_*` contenant secret, clé privée, credential, token, cookie ou IAM; JSON de compte de service; mot de passe; cookie statique; jeton Firebase; credential utilisateur; debug token App Check; variable d’émulateur; secret fictif distant.

## IAM minimal et MFA

| Identité future | Accès nécessaire | Accès interdit | Durée, MFA, audit et approbation |
|---|---|---|---|
| Développeur local | émulateurs | staging/production/secrets | temporaire; MFA dépôt; audit CI |
| Opérateur staging | opérations approuvées | production/propriétaire global | nominatif; MFA; journalisé; sécurité |
| CI staging | déploiement borné futur | console/production | identité fédérée courte; audit; pipeline approuvé |
| Runtime applicatif | services d’exécution | IAM/production/clés | identité attachée; moindre privilège; logs |
| Administrateur sécurité | IAM/App Check/incidents | métier quotidien | MFA; double contrôle destructif |
| Responsable secrets | création/rotation | données métier/déploiement | MFA; ponctuel; audit et approbation |
| Lecteur journaux | lecture minimisée | mutation/secrets | attribution bornée; consultation auditée |
| Sauvegarde/restauration | opération isolée | exploitation courante | élévation temporaire; MFA; double contrôle |
| Break-glass | urgence documentée | usage quotidien | séparé, MFA, surveillé, revu après usage |

Aucun propriétaire global par commodité, clé longue durée ou JSON téléchargé. Identité fédérée ou attachée au runtime à privilégier. Staging et production ont identités, groupes, secrets et journaux séparés.

MFA est obligatoire pour administrateurs et opérateurs staging; TOTP est privilégié si retenu ultérieurement. Les récupérations restent hors dépôt. Firestore et custom claims ne prouvent jamais la MFA. La perte du facteur exige vérification nominative, double contrôle, révocation et audit. Aucun utilisateur ou fournisseur MFA n’est créé en 8P2.

## App Check en observation

Staging commence en `observe` pendant 14 jours proposés couvrant desktop, mobile, erreurs et tâches serveur. Mesures : jetons valides/absents/invalides, endpoints, versions, faux positifs et impact, sans jeton ni donnée personnelle. `enforce` exige ≥99,9 % de requêtes légitimes couvertes, aucun parcours critique bloqué, alertes et rollback testés, puis approbation sécurité/produit. Le rollback revient à `observe` sans désactiver Auth, Rules ou autorisations. Aucun debug token, SDK ou provider ajouté en 8P2.

## Limitation de débit distribuée

Interface future : `consume({namespace, category, pseudonymousKey, cost, now}) -> {allowed, retryAfterSeconds}`. La clé est `HMAC(secret, uid ou clé réseau normalisée)`; aucune IP brute n’est persistée. Catégories : session, invitations, comptes, appartenances, téléversement, téléchargement, suppression, décisions éditoriales, audit. Fenêtres et quotas sont configurables par environnement et expirent automatiquement.

Un dépassement retourne 429 avec `Retry-After` de 1 à 300 secondes et journalisation minimisée. Une panne ferme les opérations sensibles; une lecture ordinaire ne peut être dégradée que par politique approuvée. Aucun limiteur mémoire n’est productif. Namespaces, secrets et données staging/production sont séparés. Aucun service externe n’est créé ici.

## Provisioning futur

**FUTUR — NE PAS EXÉCUTER.** Chaque étape exige la précédente, un responsable nommé, une preuve, l’arrêt en cas d’écart et un rollback documenté.

| # | Étape future | Responsable / preuve | Arrêt et retour arrière |
|---:|---|---|---|
| 1 | go/no-go | comité; décision signée | NO-GO maintient tout absent |
| 2 | nom du projet | architecture; registre | conflit: nouveau choix |
| 3 | région | architecture/DPO; analyse | doute: arrêt |
| 4 | facturation | finance; approbation | budget absent: arrêt |
| 5 | budgets/alertes | opérations; test | alerte absente: bloquer |
| 6 | création projet | opérateur; identifiant | erreur: suppression approuvée |
| 7 | services minimaux | sécurité; inventaire | superflu: désactiver |
| 8 | identités | IAM; liste | injustifiée: retirer |
| 9 | IAM | sécurité; double revue | excessif: révoquer |
| 10 | secrets | responsable; rotation | fuite: rotation/révocation |
| 11 | Auth | identité; tests fictifs | fournisseur inattendu: désactiver |
| 12 | MFA | sécurité; récupération testée | contournement: fermer privilèges |
| 13 | App Check observe | sécurité; métriques | absence: retour contrôlé |
| 14 | domaines | propriétaire; preuve DNS | non maîtrisé: retirer |
| 15 | Rules/index | données; tests 291+ | régression: version précédente |
| 16 | application | CI; artefact signé | échec: version précédente |
| 17 | fumée | QA; rapport | critique: rollback |
| 18 | sécurité | sécurité; rapport | critique: NO-GO |
| 19 | sauvegardes | opérateur; restauration | impossible: NO-GO |
| 20 | ouverture | métier/technique; accord | anomalie: fermer et rollback |

## Sauvegarde, restauration et rollback

Objectifs provisoires : RPO 24 h, RTO 8 h. Le périmètre couvre Firestore et Storage autorisé; Auth, IAM, secrets, domaines et configurations exigent des inventaires séparés. Sauvegardes chiffrées, accès minimal, conservation à valider, journaux séparés et double contrôle.

Un exercice trimestriel futur restaure dans un environnement isolé, vérifie empreintes, comptages, permissions, Rules, index, liens Storage et RPO/RTO. La réussite exige rapport signé et nettoyage isolé. Le rollback réactive l’artefact précédent compatible; les migrations sont versionnées, répétées et réversibles. Si compatibilité ou intégrité est incertaine, les écritures sont arrêtées. Les responsables conservent preuves et décisions. Aucune sauvegarde n’est créée en 8P2.

## Checklist go/no-go

- [ ] projet, région et séparation production approuvés;
- [ ] propriétaires métier et technique identifiés;
- [ ] DPO/confidentialité consulté si nécessaire;
- [ ] budget et alertes approuvés/testés;
- [ ] IAM relu, moindre privilège et double contrôle;
- [ ] MFA et récupération vérifiées;
- [ ] secrets hors dépôt et rotation définie;
- [ ] App Check prêt en observation sans debug token;
- [ ] rate limiting distribué disponible;
- [ ] domaines maîtrisés, Host/Origin exacts;
- [ ] cookies `__Host-` vérifiés;
- [ ] Rules, index et migrations testés;
- [ ] sauvegarde, restauration et rollback testés;
- [ ] données staging fictives uniquement;
- [ ] aucune copie production sans procédure approuvée;
- [ ] sécurité réussie et décision signée.

Choix futur : `GO`, `GO sous conditions` ou `NO-GO`. Pour 8P2 : **NO-GO**.
