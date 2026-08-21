import { createHash } from "node:crypto";

export const CONTRIBUTION_CATEGORIES = Object.freeze(["photographs_archives", "testimonies_stories", "history_memory", "places_heritage", "events_village_life", "craft_knowhow", "diaspora", "documentary_correction"]);
export const SENSITIVITY_LEVELS = Object.freeze(["ordinary", "sensitive", "highly_sensitive"]);
export const CONTRIBUTION_STATUSES = Object.freeze(["draft", "submitted", "completeness_review", "rights_review", "editorial_review", "changes_requested", "approved", "rejected", "withdrawn", "published", "contested", "unpublished"]);
export const SOURCE_STATUSES = Object.freeze(["unknown", "declared", "verified"]);
export const RIGHTS_STATUSES = Object.freeze(["unknown", "pending", "cleared", "not_applicable"]);
export const CONSENT_STATUSES = Object.freeze(["not_required", "pending", "granted", "withdrawn"]);
export const COMPLETENESS_STATUSES = Object.freeze(["incomplete", "complete"]);

const FIELDS = ["contributionId", "title", "summary", "category", "status", "sensitivity", "authorUid", "organizationId", "organizationRepresentation", "sourceStatus", "rightsStatus", "consentStatus", "completenessStatus", "currentVersion", "assignedReviewerUids", "createdAt", "updatedAt", "submittedAt", "createdBy", "updatedBy", "version"];
const TRANSITIONS = Object.freeze({ draft: ["submitted", "withdrawn"], submitted: ["completeness_review", "withdrawn"], completeness_review: ["rights_review", "changes_requested", "rejected", "withdrawn"], rights_review: ["editorial_review", "changes_requested", "rejected", "withdrawn"], editorial_review: ["approved", "changes_requested", "rejected", "withdrawn"], changes_requested: ["submitted", "withdrawn"], approved: ["published", "withdrawn"], published: ["contested", "unpublished"], contested: ["unpublished", "changes_requested"], rejected: [], withdrawn: [], unpublished: [] });

const clean = (value, field, max = 500) => { if (typeof value !== "string" || !value.trim() || value.length > max) throw new TypeError(`${field} invalide`); return value.trim().replace(/\s+/g, " "); };
const enumCheck = (value, values, field) => { if (!values.includes(value)) throw new TypeError(`${field} inconnu`); };
const exact = (value, fields, label) => { const actual = Object.keys(value).sort(); const expected = [...fields].sort(); if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new TypeError(`champs ${label} inconnus ou manquants`); };
const audit = (action, contribution, actorUid, previousState, nextState, reason, now) => Object.freeze({ action, actorUid, targetId: contribution.contributionId, contributionId: contribution.contributionId, organizationId: contribution.organizationId, versionId: contribution.currentVersion, previousState, nextState, reason: clean(reason, "reason"), occurredAt: now, auditVersion: contribution.version });

export function assertContribution(value) {
  exact(value, FIELDS, "contribution");
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(value.contributionId)) throw new TypeError("contributionId invalide");
  clean(value.title, "title", 160); clean(value.summary, "summary", 2000); clean(value.authorUid, "authorUid", 128);
  enumCheck(value.category, CONTRIBUTION_CATEGORIES, "category"); enumCheck(value.status, CONTRIBUTION_STATUSES, "status"); enumCheck(value.sensitivity, SENSITIVITY_LEVELS, "sensitivity");
  enumCheck(value.sourceStatus, SOURCE_STATUSES, "sourceStatus"); enumCheck(value.rightsStatus, RIGHTS_STATUSES, "rightsStatus"); enumCheck(value.consentStatus, CONSENT_STATUSES, "consentStatus"); enumCheck(value.completenessStatus, COMPLETENESS_STATUSES, "completenessStatus");
  if (![null, "associated", "official"].includes(value.organizationRepresentation)) throw new TypeError("organizationRepresentation inconnu");
  if ((value.organizationId === null) !== (value.organizationRepresentation === null)) throw new Error("organisation incohérente");
  if (!Array.isArray(value.assignedReviewerUids) || new Set(value.assignedReviewerUids).size !== value.assignedReviewerUids.length) throw new TypeError("relecteurs invalides");
  if (!Number.isInteger(value.currentVersion) || value.currentVersion < 1 || !Number.isInteger(value.version) || value.version < 1 || !value.createdAt || !value.updatedAt) throw new TypeError("métadonnées invalides");
  return value;
}

export function createDraft(input) {
  if (input.authorStatus !== "active") throw new Error("auteur actif requis");
  if (input.organizationId && input.organizationStatus !== "active") throw new Error("organisation active requise");
  if (input.organizationRepresentation === "official" && !(input.organizationType === "village_committee" && input.verificationStatus === "verified" && input.mandateStatus === "valid" && input.membershipStatus === "active" && input.organizationPermissions?.includes("committee.communication.prepare"))) throw new Error("mandat valide requis");
  const contribution = { contributionId: input.contributionId, title: clean(input.title, "title", 160), summary: clean(input.summary, "summary", 2000), category: input.category, status: "draft", sensitivity: input.sensitivity, authorUid: input.authorUid, organizationId: input.organizationId ?? null, organizationRepresentation: input.organizationId ? (input.organizationRepresentation ?? "associated") : null, sourceStatus: "unknown", rightsStatus: "unknown", consentStatus: "not_required", completenessStatus: "incomplete", currentVersion: 1, assignedReviewerUids: [], createdAt: input.now, updatedAt: input.now, submittedAt: null, createdBy: input.authorUid, updatedBy: input.authorUid, version: 1 };
  return { contribution: assertContribution(contribution), auditEvent: audit("contribution.created", contribution, input.authorUid, null, "draft", "création du brouillon", input.now) };
}

export function transitionContribution(contribution, nextStatus, options) {
  assertContribution(contribution); enumCheck(nextStatus, CONTRIBUTION_STATUSES, "status");
  if (!TRANSITIONS[contribution.status].includes(nextStatus)) throw new Error("transition éditoriale interdite");
  if (nextStatus === "rights_review" && contribution.completenessStatus !== "complete") throw new Error("contrôle de complétude incomplet");
  if (["editorial_review", "approved", "published"].includes(nextStatus) && (contribution.completenessStatus !== "complete" || contribution.sourceStatus !== "verified" || !["cleared", "not_applicable"].includes(contribution.rightsStatus) || !["granted", "not_required"].includes(contribution.consentStatus))) throw new Error("contrôles documentaires incomplets");
  const updated = { ...contribution, status: nextStatus, updatedAt: options.now, submittedAt: nextStatus === "submitted" ? options.now : contribution.submittedAt, updatedBy: options.actorUid, version: contribution.version + 1 };
  const action = ({ submitted: "contribution.submitted", changes_requested: "contribution.changes_requested", approved: "contribution.approved", rejected: "contribution.rejected", withdrawn: "contribution.withdrawn", contested: "contribution.contested", unpublished: "contribution.unpublished" })[nextStatus] ?? "contribution.status_changed";
  return { contribution: assertContribution(updated), auditEvent: audit(action, updated, options.actorUid, contribution.status, nextStatus, options.reason, options.now) };
}

export function updateDocumentaryChecks(contribution, checks, options) {
  assertContribution(contribution);
  const updated = { ...contribution, ...checks, updatedAt: options.now, updatedBy: options.actorUid, version: contribution.version + 1 };
  return { contribution: assertContribution(updated), auditEvent: audit("contribution.updated", updated, options.actorUid, contribution.status, contribution.status, options.reason, options.now) };
}

export function createContributionVersion(contribution, { body, authorUid, reason, now }) {
  assertContribution(contribution); const content = clean(body, "body", 20000); const number = contribution.currentVersion + 1;
  const version = Object.freeze({ versionId: `v${number}`, number, contributionId: contribution.contributionId, body: content, authorUid, reason: clean(reason, "reason"), createdAt: now, integrity: createHash("sha256").update(content).digest("hex") });
  const updated = { ...contribution, currentVersion: number, status: contribution.status === "changes_requested" ? "draft" : contribution.status, updatedAt: now, updatedBy: authorUid, version: contribution.version + 1 };
  return { contribution: assertContribution(updated), version, auditEvent: audit("contribution.version_created", updated, authorUid, contribution.currentVersion, number, reason, now) };
}

export function assignReviewer(contribution, { reviewerUid, reviewerStatus, reviewerPermissions, actorUid, now }) {
  assertContribution(contribution); if (reviewerStatus !== "active" || !reviewerPermissions.includes("review.assigned.read") || reviewerUid === contribution.authorUid) throw new Error("relecteur non autorisé");
  const updated = { ...contribution, assignedReviewerUids: [...new Set([...contribution.assignedReviewerUids, reviewerUid])], updatedAt: now, updatedBy: actorUid, version: contribution.version + 1 };
  return { contribution: updated, auditEvent: audit("review.assigned", updated, actorUid, null, reviewerUid, "attribution éditoriale", now) };
}

export function recordDecision(contribution, existingDecisions, input) {
  assertContribution(contribution);
  if (input.reviewerUid === contribution.authorUid || input.reviewerStatus !== "active" || !input.permissions.includes("review.assigned.comment") || !contribution.assignedReviewerUids.includes(input.reviewerUid)) throw new Error("conflit ou permission insuffisante");
  if (input.versionNumber !== contribution.currentVersion) throw new Error("version obsolète");
  if (existingDecisions.some((decision) => decision.reviewerUid === input.reviewerUid && decision.versionNumber === input.versionNumber)) throw new Error("décision déjà rendue");
  if (!["approve", "changes_requested", "reject"].includes(input.result)) throw new TypeError("résultat inconnu");
  return Object.freeze({ decisionId: input.decisionId, contributionId: contribution.contributionId, versionNumber: input.versionNumber, reviewerUid: input.reviewerUid, result: input.result, comment: input.comment?.trim() || null, roleUsed: input.roleUsed, organizationId: contribution.organizationId, createdAt: input.now });
}

export function canApprove(contribution, decisions) {
  assertContribution(contribution); const current = decisions.filter((decision) => decision.versionNumber === contribution.currentVersion);
  if (current.some((decision) => decision.result !== "approve" || decision.reviewerUid === contribution.authorUid)) return false;
  const distinct = new Set(current.map((decision) => decision.reviewerUid)).size;
  return distinct >= (contribution.sensitivity === "ordinary" ? 1 : 2);
}
