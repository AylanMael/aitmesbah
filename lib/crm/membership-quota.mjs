import { assertMembership } from "./organization-authorization.mjs";

export const MEMBERSHIP_QUOTA_MAX = 50;
export const MEMBERSHIP_DETECTION_LIMIT = 51;
export const MEMBERSHIP_QUOTA_SCHEMA_VERSION = 1;
export const OCCUPYING_MEMBERSHIP_STATUSES = Object.freeze(["invited", "active", "suspended"]);

const UID = /^[A-Za-z0-9_-]{3,128}$/;
const QUOTA_FIELDS = ["uid", "occupiedSlots", "schemaVersion", "createdAt", "updatedAt", "version"];

export class MembershipQuotaError extends Error {
  constructor(code, message = code) { super(message); this.name = "MembershipQuotaError"; this.code = code; }
}

export function assertMembershipUid(uid) {
  if (typeof uid !== "string" || !UID.test(uid)) throw new MembershipQuotaError("membership-malformed", "uid invalide");
  return uid;
}

export function occupiesMembershipSlot(status) { return OCCUPYING_MEMBERSHIP_STATUSES.includes(status); }

export function membershipQuotaDelta(previousStatus, nextStatus) {
  return Number(occupiesMembershipSlot(nextStatus)) - Number(occupiesMembershipSlot(previousStatus));
}

export function assertMembershipQuota(value, uid) {
  assertMembershipUid(uid);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new MembershipQuotaError("quota-missing");
  const actual = Object.keys(value).sort(), expected = [...QUOTA_FIELDS].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new MembershipQuotaError("quota-inconsistent");
  if (value.uid !== uid || value.schemaVersion !== MEMBERSHIP_QUOTA_SCHEMA_VERSION || !Number.isInteger(value.version) || value.version < 1 || !value.createdAt || !value.updatedAt) throw new MembershipQuotaError("quota-inconsistent");
  if (!Number.isInteger(value.occupiedSlots) || value.occupiedSlots < 0 || value.occupiedSlots > MEMBERSHIP_QUOTA_MAX) throw new MembershipQuotaError("quota-inconsistent");
  return value;
}

export function validateAuthoritativeMemberships(uid, entries, quota) {
  assertMembershipUid(uid);
  if (!Array.isArray(entries)) throw new MembershipQuotaError("membership-malformed");
  if (entries.length >= MEMBERSHIP_DETECTION_LIMIT) throw new MembershipQuotaError("too-many-memberships");
  const organizations = new Set();
  const normalized = entries.map((entry) => {
    try { assertMembership(entry.data); } catch { throw new MembershipQuotaError("membership-malformed"); }
    if (entry.data.uid !== uid || entry.id !== uid || !occupiesMembershipSlot(entry.data.status)) throw new MembershipQuotaError("membership-malformed");
    if (organizations.has(entry.data.organizationId)) throw new MembershipQuotaError("membership-duplicate");
    organizations.add(entry.data.organizationId);
    return entry;
  }).sort((left, right) => left.path.localeCompare(right.path));
  if (quota == null) {
    if (normalized.length) throw new MembershipQuotaError("quota-missing");
    return Object.freeze([]);
  }
  const checked = assertMembershipQuota(quota, uid);
  if (checked.occupiedSlots !== normalized.length) throw new MembershipQuotaError("quota-inconsistent");
  return Object.freeze(normalized);
}

export function nextMembershipQuota(current, uid, delta, now) {
  const quota = current == null
    ? { uid: assertMembershipUid(uid), occupiedSlots: 0, schemaVersion: MEMBERSHIP_QUOTA_SCHEMA_VERSION, createdAt: now, updatedAt: now, version: 1 }
    : { ...assertMembershipQuota(current, uid) };
  const occupiedSlots = quota.occupiedSlots + delta;
  if (occupiedSlots > MEMBERSHIP_QUOTA_MAX) throw new MembershipQuotaError("quota-exceeded");
  if (occupiedSlots < 0) throw new MembershipQuotaError("quota-inconsistent");
  return Object.freeze({ ...quota, occupiedSlots, updatedAt: now, version: current == null ? 1 : quota.version + (delta === 0 ? 0 : 1) });
}
