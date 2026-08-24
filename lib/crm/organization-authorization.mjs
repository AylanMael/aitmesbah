const ORGANIZATION_FIELDS = ["organizationId", "name", "slug", "type", "status", "verificationStatus", "mandateStatus", "declaredScope", "createdAt", "updatedAt", "createdBy", "updatedBy", "version"];
const MEMBERSHIP_FIELDS = ["organizationId", "uid", "roles", "status", "createdAt", "updatedAt", "createdBy", "updatedBy", "version"];

export const ORGANIZATION_TYPES = Object.freeze(["association", "village_committee", "informal_collective", "community_group"]);
export const ORGANIZATION_STATUSES = Object.freeze(["registered", "active", "suspended", "archived"]);
export const VERIFICATION_STATUSES = Object.freeze(["unverified", "verified"]);
export const MANDATE_STATUSES = Object.freeze(["none", "pending", "valid", "withdrawn", "expired"]);
export const MEMBERSHIP_STATUSES = Object.freeze(["invited", "active", "suspended", "revoked"]);

export const GLOBAL_ROLES = Object.freeze({
  pending_member: "Membre en attente",
  approved_member: "Membre approuvé",
  contributor: "Contributeur",
  reviewer: "Relecteur",
  editorial_manager: "Responsable éditorial",
  memory_archives_referent: "Référent mémoire et archives",
  community_manager: "Responsable communautaire",
  administrator: "Administrateur",
  technical_owner: "Propriétaire technique",
});

export const ORGANIZATION_ROLES = Object.freeze({
  association_manager: "Responsable d’association",
  mandated_committee_representative: "Représentant mandaté du comité",
  future_financial_manager: "Responsable financier futur",
});

export const PERMISSIONS = Object.freeze([
  "access_request.self.manage", "community.content.read", "draft.self.manage",
  "review.assigned.read", "review.assigned.comment", "editorial.assign",
  "editorial.completeness.review", "editorial.provenance.verify", "editorial.rights.verify", "editorial.consent.verify",
  "editorial.ordinary.approve", "editorial.ordinary.publish", "member.approve", "member.suspend",
  "profile.assigned.read", "organization.verify", "organization.member.manage",
  "organization.create", "organization.list", "organization.status.manage",
  "organization.content.manage", "organization.event.manage",
  "committee.communication.prepare", "role.local.manage", "role.global.manage",
  "administrator.nominate", "settings.manage", "security.emergency_remove",
]);

const GLOBAL_ROLE_PERMISSIONS = Object.freeze({
  pending_member: ["access_request.self.manage"],
  approved_member: ["community.content.read"],
  contributor: ["draft.self.manage"],
  reviewer: ["review.assigned.read", "review.assigned.comment"],
  editorial_manager: ["editorial.assign", "editorial.completeness.review", "editorial.provenance.verify", "editorial.rights.verify", "editorial.consent.verify", "editorial.ordinary.approve", "editorial.ordinary.publish"],
  memory_archives_referent: ["review.assigned.read", "editorial.provenance.verify", "editorial.rights.verify", "editorial.consent.verify"],
  community_manager: ["member.approve", "member.suspend", "profile.assigned.read"],
  administrator: ["organization.create", "organization.list", "organization.status.manage", "organization.verify", "organization.member.manage", "role.local.manage", "role.global.manage", "settings.manage"],
  technical_owner: ["administrator.nominate", "security.emergency_remove"],
});

const ORGANIZATION_ROLE_PERMISSIONS = Object.freeze({
  association_manager: ["organization.member.manage", "organization.content.manage", "organization.event.manage"],
  mandated_committee_representative: ["committee.communication.prepare"],
  future_financial_manager: [],
});

const ORGANIZATION_TRANSITIONS = Object.freeze({ registered: ["active", "archived"], active: ["suspended", "archived"], suspended: ["active", "archived"], archived: [] });
const MEMBERSHIP_TRANSITIONS = Object.freeze({ invited: ["active", "revoked"], active: ["suspended", "revoked"], suspended: ["active", "revoked"], revoked: [] });

function text(value, field, maximum = 160) {
  if (typeof value !== "string" || !value.trim() || value.length > maximum) throw new TypeError(`${field} invalide`);
  return value.trim().replace(/\s+/g, " ");
}

function exactFields(value, fields, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${label} invalide`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new TypeError(`champs ${label} inconnus ou manquants`);
}

function enumValue(value, values, field) {
  if (!values.includes(value)) throw new TypeError(`${field} inconnu`);
}

function audit(action, actorUid, targetId, organizationId, previousState, nextState, reason, occurredAt, version) {
  return Object.freeze({ action, actorUid, targetId, organizationId, previousState, nextState, reason: text(reason, "reason", 500), occurredAt, version });
}

export function slugifyOrganizationName(name) {
  return text(name, "name").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function assertOrganization(value) {
  exactFields(value, ORGANIZATION_FIELDS, "organization");
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(value.organizationId)) throw new TypeError("organizationId invalide");
  text(value.name, "name");
  if (slugifyOrganizationName(value.name) !== value.slug) throw new TypeError("slug invalide");
  enumValue(value.type, ORGANIZATION_TYPES, "type");
  enumValue(value.status, ORGANIZATION_STATUSES, "status");
  enumValue(value.verificationStatus, VERIFICATION_STATUSES, "verificationStatus");
  enumValue(value.mandateStatus, MANDATE_STATUSES, "mandateStatus");
  text(value.declaredScope, "declaredScope", 200);
  text(value.createdBy, "createdBy", 128); text(value.updatedBy, "updatedBy", 128);
  if (!value.createdAt || !value.updatedAt || !Number.isInteger(value.version) || value.version < 1) throw new TypeError("métadonnées organization invalides");
  if (value.mandateStatus === "valid" && (value.type !== "village_committee" || value.verificationStatus !== "verified")) throw new Error("mandat valide incohérent");
  return value;
}

export function createOrganization({ organizationId, name, type, declaredScope, actorUid, now }) {
  if (actorUid === organizationId) throw new Error("auto-attribution interdite");
  const organization = { organizationId, name: text(name, "name"), slug: slugifyOrganizationName(name), type, status: "registered", verificationStatus: "unverified", mandateStatus: "none", declaredScope: text(declaredScope, "declaredScope", 200), createdAt: now, updatedAt: now, createdBy: actorUid, updatedBy: actorUid, version: 1 };
  assertOrganization(organization);
  return { organization, auditEvent: audit("organization.created", actorUid, organizationId, organizationId, null, "registered", "création administrative locale", now, 1) };
}

export function transitionOrganization(organization, nextStatus, { actorUid, reason, now }) {
  assertOrganization(organization); enumValue(nextStatus, ORGANIZATION_STATUSES, "status");
  if (!ORGANIZATION_TRANSITIONS[organization.status].includes(nextStatus)) throw new Error("transition organization interdite");
  const updated = { ...organization, status: nextStatus, updatedAt: now, updatedBy: actorUid, version: organization.version + 1 };
  return { organization: assertOrganization(updated), auditEvent: audit("organization.status_changed", actorUid, organization.organizationId, organization.organizationId, organization.status, nextStatus, reason, now, updated.version) };
}

export function changeOrganizationVerification(organization, nextStatus, options) {
  assertOrganization(organization); enumValue(nextStatus, VERIFICATION_STATUSES, "verificationStatus");
  const updated = { ...organization, verificationStatus: nextStatus, mandateStatus: nextStatus === "verified" ? organization.mandateStatus : "none", updatedAt: options.now, updatedBy: options.actorUid, version: organization.version + 1 };
  return { organization: assertOrganization(updated), auditEvent: audit("organization.verification_changed", options.actorUid, organization.organizationId, organization.organizationId, organization.verificationStatus, nextStatus, options.reason, options.now, updated.version) };
}

export function changeOrganizationMandate(organization, nextStatus, options) {
  assertOrganization(organization); enumValue(nextStatus, MANDATE_STATUSES, "mandateStatus");
  if (nextStatus === "valid" && (organization.type !== "village_committee" || organization.verificationStatus !== "verified")) throw new Error("mandat explicite vérifié requis");
  const updated = { ...organization, mandateStatus: nextStatus, updatedAt: options.now, updatedBy: options.actorUid, version: organization.version + 1 };
  return { organization: assertOrganization(updated), auditEvent: audit("organization.mandate_changed", options.actorUid, organization.organizationId, organization.organizationId, organization.mandateStatus, nextStatus, options.reason, options.now, updated.version) };
}

export function assertMembership(value) {
  exactFields(value, MEMBERSHIP_FIELDS, "membership");
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(value.organizationId)) throw new TypeError("organizationId invalide");
  text(value.uid, "uid", 128); enumValue(value.status, MEMBERSHIP_STATUSES, "membership status");
  if (!Array.isArray(value.roles) || new Set(value.roles).size !== value.roles.length || value.roles.some((role) => !(role in ORGANIZATION_ROLES))) throw new TypeError("rôle organization inconnu");
  text(value.createdBy, "createdBy", 128); text(value.updatedBy, "updatedBy", 128);
  if (!value.createdAt || !value.updatedAt || !Number.isInteger(value.version) || value.version < 1) throw new TypeError("métadonnées membership invalides");
  return value;
}

export function inviteMembership({ organizationId, uid, roles, actorUid, now }) {
  if (uid === actorUid) throw new Error("auto-attribution interdite");
  const membership = { organizationId, uid, roles: [...roles], status: "invited", createdAt: now, updatedAt: now, createdBy: actorUid, updatedBy: actorUid, version: 1 };
  assertMembership(membership);
  return { membership, auditEvent: audit("membership.invited", actorUid, uid, organizationId, null, "invited", "invitation administrative locale", now, 1) };
}

export function transitionMembership(membership, nextStatus, options) {
  assertMembership(membership); enumValue(nextStatus, MEMBERSHIP_STATUSES, "membership status");
  if (options.actorUid === membership.uid) throw new Error("auto-attribution interdite");
  if (!MEMBERSHIP_TRANSITIONS[membership.status].includes(nextStatus)) throw new Error("transition membership interdite");
  const updated = { ...membership, status: nextStatus, updatedAt: options.now, updatedBy: options.actorUid, version: membership.version + 1 };
  return { membership: assertMembership(updated), auditEvent: audit("membership.status_changed", options.actorUid, membership.uid, membership.organizationId, membership.status, nextStatus, options.reason, options.now, updated.version) };
}

export function changeMembershipRoles(membership, roles, options) {
  assertMembership(membership);
  if (options.actorUid === membership.uid) throw new Error("auto-attribution interdite");
  const updated = { ...membership, roles: [...roles], updatedAt: options.now, updatedBy: options.actorUid, version: membership.version + 1 };
  assertMembership(updated);
  return { membership: updated, auditEvent: audit("membership.roles_changed", options.actorUid, membership.uid, membership.organizationId, membership.roles, roles, options.reason, options.now, updated.version) };
}

export function effectivePermissions({ accountStatus, globalRoles = [], organization, membership, organizationId }) {
  const result = { global: [], organization: [] };
  if (accountStatus !== "active" || globalRoles.some((role) => !(role in GLOBAL_ROLES))) return result;
  result.global = [...new Set(globalRoles.flatMap((role) => GLOBAL_ROLE_PERMISSIONS[role]))].sort();
  try { assertOrganization(organization); assertMembership(membership); } catch { return result; }
  if (organization.organizationId !== organizationId || membership.organizationId !== organizationId || membership.status !== "active" || organization.status !== "active") return result;
  const roles = membership.roles.filter((role) => role !== "mandated_committee_representative" || organization.mandateStatus === "valid");
  result.organization = [...new Set(roles.flatMap((role) => ORGANIZATION_ROLE_PERMISSIONS[role]))].sort();
  return result;
}
