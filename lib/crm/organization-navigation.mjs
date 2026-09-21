export function organizationListQuery(filters={}) {return {cursor:filters.cursor,limit:filters.limit};}
export function filterOrganizationPage(organizations,filters={}) {
  return organizations.filter(org=>(!filters.type||org.type===filters.type)&&(!filters.status||org.status===filters.status)&&(!filters.verification||org.verificationStatus===filters.verification));
}
export function organizationPageHref(cursor,filters={}) {
  const params=new URLSearchParams({cursor});
  for(const name of ["type","status","verification"])if(filters[name])params.set(name,filters[name]);
  return `/crm/organisations?${params}`;
}
