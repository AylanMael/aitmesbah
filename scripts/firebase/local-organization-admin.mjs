import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { normalizeLegacyAudit } from "../../lib/crm/audit-log.mjs";

import {
  changeMembershipRoles,
  changeOrganizationMandate,
  changeOrganizationVerification,
  createOrganization,
  inviteMembership,
  transitionMembership,
  transitionOrganization,
} from "../../lib/crm/organization-authorization.mjs";
import { getLocalAdminServices } from "./local-account-admin.mjs";
import { MEMBERSHIP_DETECTION_LIMIT, OCCUPYING_MEMBERSHIP_STATUSES, membershipQuotaDelta, nextMembershipQuota, validateAuthoritativeMemberships } from "../../lib/crm/membership-quota.mjs";

function quotaQuery(database, uid) {
  return database.collectionGroup("memberships").where("uid", "==", uid).where("status", "in", [...OCCUPYING_MEMBERSHIP_STATUSES]).orderBy(FieldPath.documentId()).limit(MEMBERSHIP_DETECTION_LIMIT);
}

async function quotaState(transaction, database, uid) {
  const quotaRef = database.doc(`membershipQuotas/${uid}`), memberships = await transaction.get(quotaQuery(database, uid)), quota = await transaction.get(quotaRef);
  validateAuthoritativeMemberships(uid, memberships.docs.map(doc => ({ id: doc.id, path: doc.ref.path, data: doc.data() })), quota.exists ? quota.data() : null);
  return { quotaRef, quota: quota.exists ? quota.data() : null };
}

async function saveWithAudit(reference, value, auditEvent) {
  const { database } = getLocalAdminServices();
  const batch = database.batch();
  batch.set(reference, value);
  const auditReference = database.collection("auditLogs").doc();
  batch.create(auditReference, normalizeLegacyAudit(auditEvent, { eventId: auditReference.id }));
  await batch.commit();
  return value;
}

export async function createLocalOrganization(input) {
  const { database } = getLocalAdminServices();
  const result = createOrganization({ ...input, now: Timestamp.now() });
  return saveWithAudit(database.doc(`organizations/${result.organization.organizationId}`), result.organization, result.auditEvent);
}

async function updateOrganization(organizationId, transform) {
  const { database } = getLocalAdminServices();
  const reference = database.doc(`organizations/${organizationId}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new Error("organization introuvable");
  const result = transform(snapshot.data(), Timestamp.now());
  return saveWithAudit(reference, result.organization, result.auditEvent);
}

export const changeLocalOrganizationStatus = ({ organizationId, nextStatus, actorUid, reason }) => updateOrganization(organizationId, (organization, now) => transitionOrganization(organization, nextStatus, { actorUid, reason, now }));
export const changeLocalOrganizationVerification = ({ organizationId, nextStatus, actorUid, reason }) => updateOrganization(organizationId, (organization, now) => changeOrganizationVerification(organization, nextStatus, { actorUid, reason, now }));
export const changeLocalOrganizationMandate = ({ organizationId, nextStatus, actorUid, reason }) => updateOrganization(organizationId, (organization, now) => changeOrganizationMandate(organization, nextStatus, { actorUid, reason, now }));

export async function inviteLocalMembership({ organizationId, uid, roles, actorUid }) {
  const { database } = getLocalAdminServices();
  if (!(await database.doc(`users/${uid}`).get()).exists) throw new Error("compte inexistant");
  if (!(await database.doc(`organizations/${organizationId}`).get()).exists) throw new Error("organization inexistante");
  const result = inviteMembership({ organizationId, uid, roles, actorUid, now: Timestamp.now() });
  const reference = database.doc(`organizations/${organizationId}/memberships/${uid}`), auditReference = database.collection("auditLogs").doc();
  await database.runTransaction(async transaction => {
    const existing = await transaction.get(reference); if (existing.exists) throw new Error("membership existante");
    const state = await quotaState(transaction, database, uid), quota = nextMembershipQuota(state.quota, uid, 1, Timestamp.now());
    transaction.create(reference, result.membership); transaction.set(state.quotaRef, quota); transaction.create(auditReference, normalizeLegacyAudit(result.auditEvent, { eventId: auditReference.id }));
  });
  return result.membership;
}

async function updateMembership(organizationId, uid, transform) {
  const { database } = getLocalAdminServices();
  const reference = database.doc(`organizations/${organizationId}/memberships/${uid}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new Error("membership introuvable");
  const now = Timestamp.now(), result = transform(snapshot.data(), now), auditReference = database.collection("auditLogs").doc();
  await database.runTransaction(async transaction => {
    const fresh = await transaction.get(reference); if (!fresh.exists || fresh.data().version !== snapshot.data().version) throw new Error("conflit membership");
    const state = await quotaState(transaction, database, uid), delta = membershipQuotaDelta(fresh.data().status, result.membership.status), quota = nextMembershipQuota(state.quota, uid, delta, now);
    transaction.set(reference, result.membership); if (delta !== 0) transaction.set(state.quotaRef, quota); transaction.create(auditReference, normalizeLegacyAudit(result.auditEvent, { eventId: auditReference.id }));
  });
  return result.membership;
}

export const changeLocalMembershipStatus = ({ organizationId, uid, nextStatus, actorUid, reason }) => updateMembership(organizationId, uid, (membership, now) => transitionMembership(membership, nextStatus, { actorUid, reason, now }));
export const changeLocalMembershipRoles = ({ organizationId, uid, roles, actorUid, reason }) => updateMembership(organizationId, uid, (membership, now) => changeMembershipRoles(membership, roles, { actorUid, reason, now }));

export async function clearLocalOrganizationFixtures() {
  const { database } = getLocalAdminServices();
  for (const organization of (await database.collection("organizations").get()).docs) {
    const memberships = await organization.ref.collection("memberships").get();
    const batch = database.batch();
    memberships.docs.forEach((entry) => batch.delete(entry.ref));
    batch.delete(organization.ref);
    await batch.commit();
  }
  for (const quota of (await database.collection("membershipQuotas").get()).docs) await quota.ref.delete();
}
