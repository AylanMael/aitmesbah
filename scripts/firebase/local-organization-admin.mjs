import { Timestamp } from "firebase-admin/firestore";
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
  return saveWithAudit(database.doc(`organizations/${organizationId}/memberships/${uid}`), result.membership, result.auditEvent);
}

async function updateMembership(organizationId, uid, transform) {
  const { database } = getLocalAdminServices();
  const reference = database.doc(`organizations/${organizationId}/memberships/${uid}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new Error("membership introuvable");
  const result = transform(snapshot.data(), Timestamp.now());
  return saveWithAudit(reference, result.membership, result.auditEvent);
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
}
