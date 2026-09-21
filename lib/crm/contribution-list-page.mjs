// Chaque requête reste limitée à son périmètre autorisé, puis les résultats
// sont fusionnés avant de calculer le curseur (un dossier peut appartenir aux deux).
export async function contributionListPage(collection, actor, input, documentId) {
  const permissions = actor.globalPermissions;
  const reviewer = permissions.some(permission => [
    "review.assigned.read", "review.assigned.comment", "editorial.completeness.review",
    "editorial.provenance.verify", "editorial.rights.verify", "editorial.consent.verify",
    "editorial.ordinary.approve",
  ].includes(permission));
  const queries = [];
  if (permissions.includes("editorial.assign")) queries.push(collection);
  else {
    if (permissions.includes("draft.self.manage")) queries.push(collection.where("authorUid", "==", actor.uid));
    if (reviewer) queries.push(collection.where("assignedReviewerUids", "array-contains", actor.uid));
  }
  if (!queries.length) throw Object.assign(new Error("permission insuffisante"), {http: 403});
  const snapshots = await Promise.all(queries.map(query => {
    let page = query.orderBy(documentId).limit(input.limit + 1);
    if (input.cursor) page = page.startAfter(input.cursor);
    return page.get();
  }));
  const documents = [...new Map(snapshots.flatMap(snapshot => snapshot.docs).map(doc => [doc.id, doc])).values()]
    .sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const docs = documents.slice(0, input.limit);
  return {docs, nextCursor: documents.length > input.limit ? docs.at(-1).id : null};
}
