import {createHash} from "node:crypto";

const hash = value => createHash("sha256").update(value).digest("hex");
export function draftCreationIdentity(uid, key, input) {
  if (key == null) return null; // Compatibilité avec les clients déjà déployés.
  if (typeof key !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) {
    throw Object.assign(new Error("identifiant de tentative invalide"), {http:422});
  }
  const fields = ["title","summary","body","category","sensitivity","organizationId","organizationRepresentation"];
  return {
    contributionId: `contribution-${hash(JSON.stringify([uid,key.toLowerCase()]))}`,
    fingerprint: hash(JSON.stringify(fields.map(field => [field,input[field]]))),
  };
}

// L'écriture create du document racine arbitre les appels simultanés. Le lot
// est atomique : une seule version initiale et un seul événement de journal.
export async function commitDraftOnce(database, {ref, contribution, versionRef, version, auditRef, audit, identity, uid}) {
  const value = identity ? {...contribution, creationFingerprint:identity.fingerprint} : contribution;
  const batch = database.batch();
  batch.create(ref,value);
  batch.create(versionRef,version);
  batch.create(auditRef,audit);
  try {await batch.commit(); return value;}
  catch (error) {
    if (!identity || ![6,"already-exists"].includes(error.code)) throw error;
    const existing = await ref.get();
    const record = existing.data();
    if (!existing.exists || record.authorUid !== uid || record.creationFingerprint !== identity.fingerprint) {
      throw Object.assign(new Error("Cette tentative correspond à un autre contenu."), {http:409});
    }
    return record; // Ne jamais écraser les modifications faites après création.
  }
}
