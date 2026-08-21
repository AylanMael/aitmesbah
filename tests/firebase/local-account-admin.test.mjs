import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { getFirestore } from "firebase-admin/firestore";

import {
  assertLocalAdminSafety,
  changeLocalAccountStatus,
  clearLocalAccountFixtures,
  prepareLocalInvitation,
} from "../../scripts/firebase/local-account-admin.mjs";

before(async () => {
  assertLocalAdminSafety();
  await clearLocalAccountFixtures();
});

after(async () => clearLocalAccountFixtures());

test("le cycle administratif local produit profils et audits", async () => {
  const invited = await prepareLocalInvitation({
    displayName: "Compte Local",
    email: "ACCOUNT-LIFECYCLE@EXAMPLE.TEST",
    actorUid: "local-admin",
  });
  assert.equal(invited.status, "invited");

  const active = await changeLocalAccountStatus({ uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "activation locale" });
  const suspended = await changeLocalAccountStatus({ uid: invited.uid, nextStatus: "suspended", actorUid: "local-admin", reason: "suspension locale" });
  const reactivated = await changeLocalAccountStatus({ uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "réactivation locale" });
  const revoked = await changeLocalAccountStatus({ uid: invited.uid, nextStatus: "revoked", actorUid: "local-admin", reason: "révocation locale" });
  assert.deepEqual([active.status, suspended.status, reactivated.status, revoked.status], ["active", "suspended", "active", "revoked"]);
  assert.equal(revoked.version, 5);

  const audit = await getFirestore().collection("auditLogs").where("targetUid", "==", invited.uid).get();
  assert.equal(audit.size, 5);
  assert.deepEqual(new Set(audit.docs.map((entry) => entry.data().action)), new Set(["account.invited", "account.status_changed"]));

  await assert.rejects(changeLocalAccountStatus({ uid: invited.uid, nextStatus: "active", actorUid: "local-admin", reason: "réactivation interdite" }), /interdite/);
});
