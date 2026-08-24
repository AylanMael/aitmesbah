# Interface des contributions et circuit éditorial

## Périmètre

La mission 8L ouvre uniquement `/crm/contributions` sur `demo-aitmesbah`. Les contributions restent privées, en texte brut, sans fichier, HTML, mineur, formulaire public ni publication. `approved` signifie exclusivement « approuvée en interne ».

## Permissions

Les permissions canoniques nouvelles sont `editorial.completeness.review`, `editorial.provenance.verify`, `editorial.rights.verify`, `editorial.consent.verify` et `editorial.ordinary.approve`. Le responsable éditorial les possède toutes. Le référent mémoire et archives possède seulement les trois vérifications documentaires. `editorial.assign` reste seule autorité d’affectation. `editorial.ordinary.publish` est conservée mais aucune route 8L ne l’utilise.

Toute opération de complétude, vérification, relecture ou approbation exige simultanément un compte actif, la permission précise, une affectation explicite, la version courante, l’autorisation organisationnelle éventuelle et un acteur différent de l’auteur. Custom claims, `organizationMemberships`, nom d’organisation et rôles locaux sont sans autorité éditoriale globale.

## Données et versions

Le document `contributions/{id}` conserve métadonnées minimales, auteur, organisation facultative, sensibilité, états documentaires, relecteurs affectés, version courante et contrôle optimiste. Le corps est uniquement dans `contributions/{id}/versions/{versionId}`. Chaque version est créée une fois, numérotée, horodatée, motivée et porte une empreinte SHA-256. Une nouvelle version remet les contrôles à leur état initial et invalide les décisions antérieures.

Les catégories et états restent ceux de 8F. Une organisation doit être active et l’auteur doit avoir une appartenance active. Une représentation officielle du comité reste impossible sans mandat valide ; 8L ne crée ni ne modifie aucun mandat.

## Circuit accessible

Le parcours ordinaire couvre brouillon, nouvelle version, soumission, complétude, contrôles distincts de provenance, droits et consentement, affectation, relecture, demande de corrections, rejet et approbation interne. Les décisions mentionnent la version. Les mutations comparent `expectedVersion` et retournent HTTP 409 en cas de conflit.

Les contenus sensibles et hautement sensibles peuvent progresser jusqu’à la revue, mais ne peuvent pas atteindre `approved`. L’interface affiche : « Double validation requise — décision finale indisponible dans cette version. » Aucun état `published`, endpoint, bouton ou document public n’est créé.

## API, cloisonnement et audit

Les routes `/api/crm/contributions/**` sont serveur uniquement et appliquent session 8I, statut actif, permission recalculée depuis Firestore, CSRF, Origin/Host, JSON borné, champs fermés, validation des identifiants et réponses `no-store`. La liste est stable, bornée à 25 par défaut et 100 maximum. Auteur, affectés et responsables d’affectation voient seulement le périmètre légitime ; une contribution organisationnelle exige l’organisation active correspondante.

Création, version, soumission, affectation/désaffectation, contrôles et décisions produisent des événements canoniques minimisés. Aucun corps, email, jeton ou preuve complète n’est audité. Firestore et Storage restent fermés aux SDK clients.

## Tests et fonctions différées

Les tests couvrent permissions, entrées fermées, texte brut, catégories, sensibilités, pagination, propriété, affectation, conflits, cloisonnement, versions, empreinte, contrôles séparés, décision ordinaire, blocage du sensible et absence de publication. Restent différés : double validation sensible, publication, fichiers, preuves binaires, mineurs, mandat, contestation publique, finance, recherche plein texte, index additionnel et exploitation distante.
