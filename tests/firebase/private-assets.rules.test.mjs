import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { initializeTestEnvironment, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { readFile } from "node:fs/promises";

let env;
before(async()=>{ env=await initializeTestEnvironment({projectId:"demo-aitmesbah",firestore:{rules:await readFile("firestore.rules","utf8"),host:"127.0.0.1",port:8080}}); });
after(async()=>env?.cleanup());
test("assets, droits et consentements restent invisibles et non modifiables côté client", async()=>{
  for (const sub of ["assets/a1","rights/r1","consents/s1"]) {
    const ref=doc(env.authenticatedContext("member_1").firestore(),`contributions/c1/${sub}`);
    await assertFails(getDoc(ref)); await assertFails(setDoc(ref,{status:"validated"})); await assertFails(updateDoc(ref,{status:"deleted"})); await assertFails(deleteDoc(ref));
  }
  assert.ok(true);
});
