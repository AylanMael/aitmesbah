import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { getFirestore } from "firebase-admin/firestore";
import { changeLocalAccountStatus, clearLocalAccountFixtures, prepareLocalInvitation } from "../../scripts/firebase/local-account-admin.mjs";
import { changeLocalMembershipRoles, changeLocalMembershipStatus, changeLocalOrganizationMandate, changeLocalOrganizationStatus, changeLocalOrganizationVerification, clearLocalOrganizationFixtures, createLocalOrganization, inviteLocalMembership } from "../../scripts/firebase/local-organization-admin.mjs";

before(async () => { await clearLocalOrganizationFixtures(); await clearLocalAccountFixtures(); });
after(async () => { await clearLocalOrganizationFixtures(); await clearLocalAccountFixtures(); });

test("cycle administratif organisationnel local complet et audité", async () => {
  const invited = await prepareLocalInvitation({ displayName: "Membre Fictif", email: "organization-member@example.test", actorUid: "local-admin" });
  await changeLocalAccountStatus({ uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "activation fictive" });
  await createLocalOrganization({ organizationId: "group-test", name: "Groupe Test", type: "association", declaredScope: "Périmètre fictif", actorUid: "local-admin" });
  await changeLocalOrganizationStatus({ organizationId: "group-test", nextStatus: "active", actorUid: "local-admin", reason: "activation fictive" });
  await changeLocalOrganizationVerification({ organizationId: "group-test", nextStatus: "verified", actorUid: "local-admin", reason: "preuve fictive" });
  await inviteLocalMembership({ organizationId: "group-test", uid: invited.uid, roles: ["association_manager"], actorUid: "local-admin" });
  await changeLocalMembershipStatus({ organizationId: "group-test", uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "activation fictive" });
  await changeLocalMembershipStatus({ organizationId: "group-test", uid: invited.uid, nextStatus: "suspended", actorUid: "local-admin", reason: "suspension fictive" });
  await changeLocalMembershipStatus({ organizationId: "group-test", uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "réactivation fictive" });
  await changeLocalMembershipRoles({ organizationId: "group-test", uid: invited.uid, roles: [], actorUid: "local-admin", reason: "retrait fictif" });
  await changeLocalMembershipStatus({ organizationId: "group-test", uid: invited.uid, nextStatus: "revoked", actorUid: "local-admin", reason: "révocation fictive" });

  await createLocalOrganization({ organizationId: "committee-test", name: "Comité Test", type: "village_committee", declaredScope: "Périmètre fictif", actorUid: "local-admin" });
  await changeLocalOrganizationVerification({ organizationId: "committee-test", nextStatus: "verified", actorUid: "local-admin", reason: "preuve fictive" });
  await changeLocalOrganizationMandate({ organizationId: "committee-test", nextStatus: "valid", actorUid: "local-admin", reason: "mandat fictif" });
  await changeLocalOrganizationMandate({ organizationId: "committee-test", nextStatus: "withdrawn", actorUid: "local-admin", reason: "retrait fictif" });

  const audit = await getFirestore().collection("auditLogs").get();
  const actions = new Set(audit.docs.map((entry) => entry.data().action));
  for (const action of ["organization.created", "organization.status_changed", "organization.verification_changed", "organization.mandate_changed", "membership.invited", "membership.status_changed", "membership.roles_changed"]) assert.ok(actions.has(action));
});
