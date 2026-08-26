# Interface des fichiers privés, droits et consentements

## Périmètre

La mission 8M ouvre `/crm/fichiers` uniquement avec `demo-aitmesbah`. Le navigateur transmet un multipart à une route serveur ; il ne reçoit jamais de droit Storage ni d’URL d’original. JPEG, PNG et WebP restent limités à 15 Mio, PDF à 25 Mio, et l’enveloppe HTTP totale à 26 Mio. La route lit le flux par blocs, interrompt au-delà de la limite puis décode le formulaire en mémoire sans fichier temporaire persistant.

## Autorisations

`asset.self.manage` appartient au contributeur et reste limité aux fichiers de ses contributions. `asset.assigned.read` appartient aux relecteurs, référents mémoire et responsables éditoriaux affectés. `asset.assigned.review` appartient aux référents mémoire et responsables éditoriaux affectés. `asset.deletion.manage` appartient uniquement à l’administrateur. Le propriétaire technique ne reçoit aucun pouvoir métier implicite.

Les vérifications documentaires exigent en plus `editorial.provenance.verify`, `editorial.rights.verify` ou `editorial.consent.verify`. Les affectations viennent exclusivement de `assignedReviewerUids`. L’organisation est héritée de la contribution et ne peut être choisie ou modifiée par le client.

## Cycle et sécurité

Extension, MIME, signature, taille et SHA-256 sont contrôlés côté serveur. Le doublon est limité à une contribution. Tout original reste sous `private/contributions/{contributionId}/{assetId}/original`, en quarantaine et avec `scanStatus: unavailable`. Validation humaine, rejet, retrait, demande de suppression, séparation demandeur/exécutant, absence de référence et suppression physique sont audités. Firestore et Storage restent fermés aux SDK clients. Aucun mineur, antivirus externe, publication, fichier réel, accès distant ou déploiement n’est introduit.

## Téléchargement et contrôles documentaires

Le téléchargement passe exclusivement par une route serveur authentifiée. Le serveur relit le compte, la contribution, l’affectation, l’organisation et la métadonnée du fichier, puis diffuse les octets depuis Storage Emulator sans URL publique, signée ou durable. La réponse impose un nom nettoyé, `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff` et `Cache-Control: private, no-store, max-age=0`. Les fichiers retirés, rejetés, supprimés ou incohérents ne sont jamais diffusés.

La provenance utilise uniquement le statut canonique `unknown`, `declared` ou `verified` défini par 8F. Aucun champ textuel libre ni preuve personnelle n’est ajouté. Le statut est persisté avec la fiche du fichier, relu après rechargement et ne devient `verified` qu’avec `editorial.provenance.verify`. Droits, consentement et provenance restent trois décisions distinctes et auditées.

## Cohérence Firestore et Storage

Le téléversement est une saga compensée, pas une transaction atomique entre services. Une réservation Firestore précède l’écriture des octets. La quarantaine et son audit ne sont finalisés qu’après réussite de Storage. Si Storage échoue, la réservation est retirée. Si la finalisation Firestore échoue, le serveur tente immédiatement de supprimer les octets ; un échec de cette compensation laisse un état explicite `compensation_failed` et ne produit jamais de réponse positive.

La suppression physique est également une saga. Une transaction Firestore contrôle la version, la séparation entre demandeur et exécutant, l’état et l’absence de référence, puis réserve l’exécution avant tout effacement. L’échec Storage laisse `failed`. Une finalisation Firestore impossible après effacement laisse `reconciliation_required`. La reprise est bornée au même identifiant opaque et la suppression Storage tolère l’absence préalable de l’objet ; aucun autre chemin ne peut être visé.

## File administrative et avertissement

La file des demandes de suppression est réservée à `asset.deletion.manage`, ordonnée de façon stable, limitée à 25 résultats par défaut et 100 au maximum, avec curseur opaque. Elle expose seulement les métadonnées administratives minimales, jamais le chemin Storage, le contenu de la contribution ou des données personnelles inutiles.

L’état antivirus demeure exactement `unavailable`. L’interface affiche après téléversement, dans chaque fiche et avant validation : « Analyse antivirus indisponible — ce fichier n’est pas déclaré exempt de logiciel malveillant. » Aucune formulation ne présente un fichier comme sûr, propre, sécurisé, sans virus ou analysé avec succès.
