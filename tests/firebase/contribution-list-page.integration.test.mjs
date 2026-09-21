import test from "node:test";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {FieldPath} from "firebase-admin/firestore";
import {getLocalAdminServices} from "../../scripts/firebase/local-account-admin.mjs";
import {assertLocalEmulatorSafety} from "./test-helpers.mjs";
import {contributionListPage} from "../../lib/crm/contribution-list-page.mjs";

test("Firestore : union paginée auteur/relecteur et exclusion des dossiers étrangers",async()=>{
  assertLocalEmulatorSafety();
  const {database}=getLocalAdminServices(),uid="qa-"+randomUUID();
  const collection=database.collection("qaContributionLists").doc(uid).collection("contributions");
  const rows=[
    ["a",uid,[]],["b","other",[uid]],["c",uid,[uid]],["d","other",[]],["e",uid,[]],["f","other",[uid]],
  ];
  try {
    await Promise.all(rows.map(([id,authorUid,assignedReviewerUids])=>collection.doc(id).create({authorUid,assignedReviewerUids})));
    const actor={uid,globalPermissions:["draft.self.manage","review.assigned.read"]};
    let cursor,ids=[];
    do {
      const page=await contributionListPage(collection,actor,{limit:2,cursor},FieldPath.documentId());
      ids.push(...page.docs.map(doc=>doc.id));cursor=page.nextCursor;
    }while(cursor);
    assert.deepEqual(ids,["a","b","c","e","f"]);
  } finally {
    await Promise.all(rows.map(([id])=>collection.doc(id).delete()));
  }
});
