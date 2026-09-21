export function accountListQuery(filters={}) {
  return {cursor:filters.cursor,limit:filters.limit};
}
export function filterAccountPage(accounts,filters={}) {
  const prefix=(filters.prefix??"").trim().toLocaleLowerCase("fr");
  return accounts.filter(account=>(!filters.status||account.status===filters.status)&&(!prefix||account.displayName.toLocaleLowerCase("fr").startsWith(prefix)));
}
export function accountPageHref(cursor,filters={}) {
  const params=new URLSearchParams({cursor});
  for(const name of ["status","prefix"])if(filters[name])params.set(name,filters[name]);
  return `/crm/comptes?${params}`;
}
