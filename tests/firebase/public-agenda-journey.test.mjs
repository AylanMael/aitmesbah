import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { readFile } from "node:fs/promises";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc } from "firebase/firestore";

import { changeLocalAccountStatus, clearLocalAccountFixtures, getLocalAdminServices, prepareLocalInvitation } from "../../scripts/firebase/local-account-admin.mjs";
import { approveLocalContribution, assignLocalReviewer, changeLocalContributionStatus, clearLocalContributionFixtures, createLocalContribution, createLocalContributionVersion, publishLocalContributionEvent, recordLocalDecision, setLocalDocumentaryChecks, unpublishLocalEvent, updateLocalPublishedEvent } from "../../scripts/firebase/local-contribution-admin.mjs";
import { PROJECT_ID, assertLocalEmulatorSafety } from "./test-helpers.mjs";

let environment;
const contributionId = "agenda-public-journey";

async function active(label) {
  const profile = await prepareLocalInvitation({ displayName: `Compte ${label}`, email: `${label}@example.test`, actorUid: "local-admin" });
  await changeLocalAccountStatus({ uid: profile.uid, nextStatus: "active", actorUid: "local-admin", reason: "activation fictive" });
  return profile.uid;
}

before(async () => {
  assertLocalEmulatorSafety();
  await clearLocalContributionFixtures();
  await clearLocalAccountFixtures();
  const { database } = getLocalAdminServices();
  for (const entry of (await database.collection("publicEvents").get()).docs) await entry.ref.delete();
  environment = await initializeTestEnvironment({ projectId: PROJECT_ID, firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") } });
});

after(async () => {
  await environment?.cleanup();
  const { database } = getLocalAdminServices();
  for (const entry of (await database.collection("publicEvents").get()).docs) await entry.ref.delete();
  await clearLocalContributionFixtures();
  await clearLocalAccountFixtures();
});

test("soumission, validation, approbation et publication alimentent l’agenda public sans exposer le dossier", async () => {
  const author = await active("agenda-author"), reviewer = await active("agenda-reviewer");
  await createLocalContribution({ contributionId, title: "Assemblée ouverte du village", summary: "Un temps d’échange consacré aux initiatives communes.", category: "events_village_life", sensitivity: "ordinary", authorUid: author });
  await createLocalContributionVersion({ contributionId, body: "Accueil à partir de 09 h 30. La rencontre est ouverte aux habitants.", authorUid: author, reason: "version destinée à l’agenda" });
  await setLocalDocumentaryChecks({ contributionId, checks: { completenessStatus: "complete", sourceStatus: "verified", rightsStatus: "cleared", consentStatus: "not_required" }, actorUid: "editor-test", reason: "informations vérifiées" });
  for (const status of ["submitted", "completeness_review", "rights_review", "editorial_review"]) await changeLocalContributionStatus({ contributionId, nextStatus: status, actorUid: "editor-test", reason: "étape éditoriale" });
  await assignLocalReviewer({ contributionId, reviewerUid: reviewer, actorUid: "editor-test" });
  await recordLocalDecision({ decisionId: "agenda-public-decision", contributionId, versionNumber: 2, reviewerUid: reviewer, result: "approve", roleUsed: "reviewer", comment: "publication validée" });
  await approveLocalContribution({ contributionId, actorUid: "editor-test" });
  const publication = await publishLocalContributionEvent({ contributionId, actorUid: "editor-test", publication: { startsAt: "2027-05-02T10:00:00+01:00", endsAt: "2027-05-02T12:00:00+01:00", location: "Salle du village", organizer: "Comité du village", eventCategory: "collective", eventStatus: "scheduled", reason: "publication après vérification" } });
  assert.equal(publication.title, "Assemblée ouverte du village");
  assert.equal((await getLocalAdminServices().database.doc(`contributions/${contributionId}`).get()).data().status, "published");

  const anonymous = environment.unauthenticatedContext().firestore();
  const visible = await assertSucceeds(getDoc(doc(anonymous, "publicEvents", contributionId)));
  assert.equal(visible.data().location, "Salle du village");
  await assertFails(getDoc(doc(anonymous, "contributions", contributionId)));

  const originalSlug = publication.slug, originalPublishedAt = publication.publishedAt.toMillis();
  const postponed = await updateLocalPublishedEvent({ contributionId, actorUid: "editor-test", publication: { startsAt: "2027-05-09T10:00:00+01:00", endsAt: "2027-05-09T12:00:00+01:00", location: "Salle du village", organizer: "Comité du village", eventCategory: "collective", eventStatus: "postponed", reason: "report annoncé" } });
  assert.equal(postponed.slug, originalSlug);
  assert.equal(postponed.publishedAt.toMillis(), originalPublishedAt);
  assert.equal(postponed.publicationVersion, 2);
  assert.equal((await assertSucceeds(getDoc(doc(anonymous, "publicEvents", contributionId)))).data().eventStatus, "postponed");

  const cancelled = await updateLocalPublishedEvent({ contributionId, actorUid: "editor-test", publication: { startsAt: "2027-05-09T10:00:00+01:00", endsAt: "2027-05-09T12:00:00+01:00", location: "Salle du village", organizer: "Comité du village", eventCategory: "collective", eventStatus: "cancelled", reason: "annulation annoncée" } });
  assert.equal(cancelled.slug, originalSlug);
  assert.equal(cancelled.publicationVersion, 3);
  assert.equal((await assertSucceeds(getDoc(doc(anonymous, "publicEvents", contributionId)))).data().eventStatus, "cancelled");

  const unpublished = await unpublishLocalEvent({ contributionId, actorUid: "editor-test", reason: "retrait éditorial documenté" });
  assert.equal(unpublished.slug, originalSlug);
  assert.equal(unpublished.publicationVersion, 4);
  await assertFails(getDoc(doc(anonymous, "publicEvents", contributionId)));
  const retained = (await getLocalAdminServices().database.doc(`publicEvents/${contributionId}`).get()).data();
  assert.equal(retained.status, "unpublished");
  assert.equal(retained.slug, originalSlug);
  assert.equal(retained.publishedAt.toMillis(), originalPublishedAt);
  assert.equal((await getLocalAdminServices().database.doc(`contributions/${contributionId}`).get()).data().status, "unpublished");
});
