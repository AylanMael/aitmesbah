import test from "node:test";
import assert from "node:assert/strict";
import { preparePublicEventPublication, preparePublicEventUnpublication, preparePublicEventUpdate } from "../../lib/crm/public-event-publication.mjs";

const contribution = { contributionId: "contribution-event-abc1234", title: "Assemblée du village", summary: "Un rendez-vous confirmé pour échanger sur les projets communs.", category: "events_village_life", status: "approved", sensitivity: "ordinary", currentVersion: 2, version: 8, organizationId: null };
const version = { contributionId: contribution.contributionId, number: 2, body: "Présentation complète du rendez-vous et des informations utiles." };
const raw = { startsAt: "2027-05-02T10:00:00+01:00", endsAt: "2027-05-02T12:00:00+01:00", location: "Salle du village", organizer: "Comité du village", eventCategory: "collective", eventStatus: "scheduled", reason: "Publication après vérification finale" };
const context = { actorUid: "editor-001", actorStatus: "active", permissions: ["editorial.ordinary.publish"], now: new Date("2027-04-20T12:00:00Z") };

test("une contribution approuvée produit une projection publique minimale", () => {
  const result = preparePublicEventPublication(contribution, version, raw, context);
  assert.equal(result.contribution.status, "published");
  assert.equal(result.publication.kind, "event");
  assert.match(result.publication.slug, /^assemblee-du-village-/);
  for (const forbidden of ["authorUid", "assignedReviewerUids", "rightsStatus", "consentStatus", "updatedBy"]) assert.equal(forbidden in result.publication, false);
  assert.equal(result.auditEvent.action, "contribution.published");
});

test("la publication refuse un dossier non approuvé ou une permission absente", () => {
  assert.throws(() => preparePublicEventPublication({ ...contribution, status: "editorial_review" }, version, raw, context));
  assert.throws(() => preparePublicEventPublication(contribution, version, raw, { ...context, permissions: [] }));
  assert.throws(() => preparePublicEventPublication(contribution, version, { ...raw, eventCategory: "unknown" }, context));
});

test("la chronologie et la version doivent être cohérentes", () => {
  assert.throws(() => preparePublicEventPublication(contribution, { ...version, number: 1 }, raw, context));
  assert.throws(() => preparePublicEventPublication(contribution, version, { ...raw, endsAt: "2027-05-01T12:00:00+01:00" }, context));
});

test("le report conserve l’URL et l’origine éditoriale tout en créant une nouvelle version", () => {
  const first = preparePublicEventPublication(contribution, version, raw, context);
  const result = preparePublicEventUpdate(first.contribution, first.publication, { ...raw, startsAt: "2027-05-09T10:00:00+01:00", endsAt: "2027-05-09T12:00:00+01:00", eventStatus: "postponed", reason: "Salle indisponible" }, { ...context, now: new Date("2027-04-21T12:00:00Z") });
  assert.equal(result.publication.slug, first.publication.slug);
  assert.equal(result.publication.publishedAt, first.publication.publishedAt);
  assert.equal(result.publication.publicationVersion, 2);
  assert.equal(result.publication.eventStatus, "postponed");
  assert.deepEqual(result.auditEvent.changedFields.sort(), ["endsAt", "eventStatus", "startsAt"]);
});

test("l’annulation puis la dépublication gardent la projection comme archive éditoriale", () => {
  const first = preparePublicEventPublication(contribution, version, raw, context);
  const cancelled = preparePublicEventUpdate(first.contribution, first.publication, { ...raw, eventStatus: "cancelled", reason: "Décision du comité" }, { ...context, now: new Date("2027-04-22T12:00:00Z") });
  const result = preparePublicEventUnpublication(cancelled.contribution, cancelled.publication, { reason: "Retrait public justifié" }, { ...context, now: new Date("2027-04-23T12:00:00Z") });
  assert.equal(result.publication.status, "unpublished");
  assert.equal(result.publication.slug, first.publication.slug);
  assert.equal(result.publication.publishedAt, first.publication.publishedAt);
  assert.equal(result.publication.publicationVersion, 3);
  assert.equal(result.contribution.status, "unpublished");
  assert.equal(result.auditEvent.action, "contribution.unpublished");
});
