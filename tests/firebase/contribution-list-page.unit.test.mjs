import test from "node:test";
import assert from "node:assert/strict";
import {contributionListPage} from "../../lib/crm/contribution-list-page.mjs";

const records = [
  {id:"a",authorUid:"me",assignedReviewerUids:[]},
  {id:"b",authorUid:"other",assignedReviewerUids:["me"]},
  {id:"c",authorUid:"me",assignedReviewerUids:["me"]},
  {id:"d",authorUid:"other",assignedReviewerUids:[]},
  {id:"e",authorUid:"me",assignedReviewerUids:[]},
  {id:"f",authorUid:"other",assignedReviewerUids:["me"]},
];
function collection(rows=records) {
  return {
    where(field,operator,value) {return collection(rows.filter(row=>operator==="=="?row[field]===value:row[field].includes(value)));},
    orderBy() {return this;},
    limit(size) {
      return {
        get:async()=>({docs:rows.slice(0,size)}),
        startAfter:id=>({get:async()=>({docs:rows.filter(row=>row.id>id).slice(0,size)})}),
      };
    },
  };
}
const actor=permissions=>({uid:"me",globalPermissions:permissions});
test("cumul auteur/relecteur : pagination complète sans doublons ni dossiers étrangers",async()=>{
  let cursor, ids=[];
  do {
    const page=await contributionListPage(collection(),actor(["draft.self.manage","review.assigned.read"]),{limit:2,cursor},"id");
    ids.push(...page.docs.map(doc=>doc.id));cursor=page.nextCursor;
  } while(cursor);
  assert.deepEqual(ids,["a","b","c","e","f"]);
});
test("chaque rôle reste limité à son périmètre",async()=>{
  const list=async permissions=>(await contributionListPage(collection(),actor(permissions),{limit:20},"id")).docs.map(doc=>doc.id);
  assert.deepEqual(await list(["draft.self.manage"]),["a","c","e"]);
  assert.deepEqual(await list(["review.assigned.read"]),["b","c","f"]);
  assert.deepEqual(await list(["editorial.assign"]),["a","b","c","d","e","f"]);
  await assert.rejects(list([]),{http:403});
});
test("une erreur de lecture ne devient jamais une page vide",async()=>{
  const failing={where(){return this},orderBy(){return this},limit(){return this},get(){throw new Error("indisponible")}};
  await assert.rejects(contributionListPage(failing,actor(["draft.self.manage"]),{limit:2},"id"),/indisponible/);
});
