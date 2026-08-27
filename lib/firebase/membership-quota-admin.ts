import "server-only";
import {FieldPath} from "firebase-admin/firestore";
import {MEMBERSHIP_DETECTION_LIMIT,OCCUPYING_MEMBERSHIP_STATUSES,assertMembershipUid,validateAuthoritativeMemberships} from "@/lib/crm/membership-quota.mjs";

function authoritativeQuery(database:FirebaseFirestore.Firestore,uid:string){
  assertMembershipUid(uid);
  return database.collectionGroup("memberships")
    .where("uid","==",uid)
    .where("status","in",[...OCCUPYING_MEMBERSHIP_STATUSES])
    .orderBy(FieldPath.documentId())
    .limit(MEMBERSHIP_DETECTION_LIMIT);
}

function entries(snapshot:FirebaseFirestore.QuerySnapshot){return snapshot.docs.map(doc=>({id:doc.id,path:doc.ref.path,data:doc.data()}));}

export async function loadAuthoritativeMemberships(database:FirebaseFirestore.Firestore,uid:string){
  const [memberships,quota]=await Promise.all([authoritativeQuery(database,uid).get(),database.doc(`membershipQuotas/${assertMembershipUid(uid)}`).get()]);
  return validateAuthoritativeMemberships(uid,entries(memberships),quota.exists?quota.data():null).map(entry=>entry.data);
}

export async function loadMembershipQuotaState(transaction:FirebaseFirestore.Transaction,database:FirebaseFirestore.Firestore,uid:string){
  const quotaRef=database.doc(`membershipQuotas/${assertMembershipUid(uid)}`);
  const memberships=await transaction.get(authoritativeQuery(database,uid));
  const quota=await transaction.get(quotaRef);
  const authoritative=validateAuthoritativeMemberships(uid,entries(memberships),quota.exists?quota.data():null);
  return {quotaRef,quota:quota.exists?quota.data()!:null,authoritative};
}
