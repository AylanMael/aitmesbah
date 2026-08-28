# Sécurité transversale des requêtes et curseurs CRM

Toutes les routes privées appliquent la politique centrale de `request-security.mjs`. Les lectures exigent une méthode GET, un Host local exact, une session active, une permission recalculée et refusent `Sec-Fetch-Site: cross-site`. L'Origin peut être absent pour une navigation GET normale, mais doit correspondre exactement à `http://localhost:3100` ou `http://127.0.0.1:3100` lorsqu'il est présent.

Les mutations, sessions et téléversements exigent en plus une Origin locale exacte, un jeton CSRF identique comparé en temps constant, un type de corps attendu et une taille bornée. `X-Forwarded-Host` n'est accepté que lorsqu'il est strictement identique au Host local déjà approuvé, comportement nécessaire au runtime Next.js local ; toute divergence est refusée. Toute réponse privée utilise `private, no-store, max-age=0`, `nosniff`, une politique de référent, une Permissions-Policy, COOP et une CSP interdisant l'encadrement.

La CSP globale autorise uniquement les ressources nécessaires à Next.js et les connexions locales aux émulateurs. Elle ne contient ni `connect-src *`, ni `unsafe-eval`, ni domaine de production inventé. HSTS reste absent sur localhost et devra être activé uniquement sur la future terminaison HTTPS de production. Une CSP à nonce, permettant de retirer `unsafe-inline` des scripts Next.js, reste une évolution future.

Le curseur du journal est une enveloppe Base64URL versionnée signée par HMAC-SHA-256. La clé `CRM_CURSOR_HMAC_SECRET`, d'au moins 32 octets, n'est jamais stockée dans Git, retournée au navigateur ou journalisée. Son absence provoque un échec fermé. Le curseur lie sa position à l'empreinte canonique des filtres et sa signature est comparée en temps constant.

Les curseurs composés d'un identifiant Firestore strictement validé restent non signés lorsqu'ils sont systématiquement soumis à une nouvelle autorisation serveur. Le curseur de suppression transporte un chemin strict, borné, relu et réautorisé côté serveur.

Les filtres historiquement appliqués après une fenêtre Firestore sont refusés en HTTP 400 tant qu'aucun index et aucune stratégie de curseur exacte ne sont approuvés. Les listes sans filtre conservent une pagination exacte `limit + 1`. Les contributions utilisent une requête autoritative par auteur, affectation ou responsabilité globale ; le cumul auteur et relecteur est refusé tant qu'une pagination d'union exacte n'est pas définie.

La limitation de débit future exige un backend distribué. Le contrat local définit les catégories, fenêtres, plafonds, clé pseudonymisée, réponse 429 et `Retry-After`. Aucun limiteur mémoire n'est présenté comme productif et aucun service externe n'est créé.
