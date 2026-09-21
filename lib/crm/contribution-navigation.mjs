// Les filtres visuels portent sur la page chargée, pas sur toute la base.
// Ne jamais les transmettre comme filtres Firestore implicites.
export function contributionListQuery(filters = {}) {
  return { cursor: filters.cursor, limit: filters.limit };
}

export function contributionPageHref(cursor, filters = {}) {
  const params = new URLSearchParams({ cursor });
  for (const key of ["status", "category", "titlePrefix"]) {
    if (typeof filters[key] === "string" && filters[key]) params.set(key, filters[key]);
  }
  return `/crm/contributions?${params.toString()}`;
}
