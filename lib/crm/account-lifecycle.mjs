export const ACCOUNT_STATUSES = Object.freeze([
  "invited",
  "active",
  "suspended",
  "revoked",
]);

export const PROFILE_FIELDS = Object.freeze([
  "uid",
  "displayName",
  "email",
  "status",
  "globalRoles",
  "organizationMemberships",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "version",
]);

const ALLOWED_TRANSITIONS = Object.freeze({
  invited: new Set(["active", "revoked"]),
  active: new Set(["suspended", "revoked"]),
  suspended: new Set(["active", "revoked"]),
  revoked: new Set(),
});

function requireNonEmptyString(value, field, maximum = 200) {
  if (typeof value !== "string" || value.length === 0 || value.length > maximum) {
    throw new TypeError(`${field} est invalide`);
  }
}

function validateStringArray(value, field) {
  if (!Array.isArray(value) || value.length > 20) {
    throw new TypeError(`${field} est invalide`);
  }
  const unique = new Set(value);
  if (
    unique.size !== value.length ||
    value.some((item) => typeof item !== "string" || item.length === 0 || item.length > 100)
  ) {
    throw new TypeError(`${field} est invalide`);
  }
}

export function normalizeEmail(email) {
  requireNonEmptyString(email, "email", 254);
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new TypeError("email est invalide");
  }
  return normalized;
}

export function normalizeDisplayName(displayName) {
  requireNonEmptyString(displayName, "displayName", 120);
  const normalized = displayName.trim().replace(/\s+/g, " ");
  if (normalized.length < 2 || normalized.length > 80) {
    throw new TypeError("displayName est invalide");
  }
  return normalized;
}

export function assertAccountStatus(status) {
  if (!ACCOUNT_STATUSES.includes(status)) {
    throw new TypeError("statut de compte inconnu");
  }
}

export function assertProfile(profile) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    throw new TypeError("profil invalide");
  }
  const keys = Object.keys(profile).sort();
  const expected = [...PROFILE_FIELDS].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new TypeError("champs de profil inconnus ou manquants");
  }
  requireNonEmptyString(profile.uid, "uid", 128);
  normalizeDisplayName(profile.displayName);
  if (normalizeEmail(profile.email) !== profile.email) {
    throw new TypeError("email non normalisé");
  }
  assertAccountStatus(profile.status);
  validateStringArray(profile.globalRoles, "globalRoles");
  validateStringArray(profile.organizationMemberships, "organizationMemberships");
  requireNonEmptyString(profile.createdBy, "createdBy", 128);
  requireNonEmptyString(profile.updatedBy, "updatedBy", 128);
  if (!profile.createdAt || !profile.updatedAt) {
    throw new TypeError("horodatages manquants");
  }
  validateAccountVersion(profile.version);
  return profile;
}

export function createInvitedProfile({ uid, displayName, email, actorUid, now }) {
  requireNonEmptyString(uid, "uid", 128);
  requireNonEmptyString(actorUid, "actorUid", 128);
  if (uid === actorUid) {
    throw new Error("un utilisateur ne peut pas créer son propre compte");
  }
  const profile = {
    uid,
    displayName: normalizeDisplayName(displayName),
    email: normalizeEmail(email),
    status: "invited",
    globalRoles: [],
    organizationMemberships: [],
    createdAt: now,
    updatedAt: now,
    createdBy: actorUid,
    updatedBy: actorUid,
    version: 1,
  };
  return assertProfile(profile);
}

export function transitionAccount(profile, nextStatus, { actorUid, reason, now }) {
  assertProfile(profile);
  assertAccountStatus(nextStatus);
  requireNonEmptyString(actorUid, "actorUid", 128);
  requireNonEmptyString(reason, "reason", 500);
  if (actorUid === profile.uid) {
    throw new Error("le titulaire ne peut pas modifier son propre statut");
  }
  if (!ALLOWED_TRANSITIONS[profile.status].has(nextStatus)) {
    throw new Error(`transition interdite: ${profile.status} -> ${nextStatus}`);
  }
  const updated = {
    ...profile,
    status: nextStatus,
    updatedAt: now,
    updatedBy: actorUid,
    version: nextAccountVersion(profile.version),
  };
  assertProfile(updated);
  return {
    profile: updated,
    auditEvent: Object.freeze({
      action: "account.status_changed",
      actorUid,
      targetUid: profile.uid,
      previousStatus: profile.status,
      nextStatus,
      reason: reason.trim(),
      occurredAt: now,
      profileVersion: updated.version,
    }),
  };
}
import { nextAccountVersion,validateAccountVersion } from "./account-version.mjs";
