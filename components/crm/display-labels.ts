export const accountStatusLabels:Record<string,string>={
  invited:"Invité",
  active:"Actif",
  suspended:"Suspendu",
  revoked:"Révoqué",
};

export const organizationStatusLabels:Record<string,string>={
  registered:"Enregistrée",
  active:"Active",
  suspended:"Suspendue",
  archived:"Archivée",
};

export const organizationTypeLabels:Record<string,string>={
  association:"Association",
  village_committee:"Comité du village",
  informal_collective:"Collectif informel",
  community_group:"Groupe communautaire",
};

export const verificationStatusLabels:Record<string,string>={
  unverified:"Non vérifiée",
  verified:"Vérifiée",
};

export const membershipStatusLabels:Record<string,string>={
  invited:"Invité",
  active:"Actif",
  suspended:"Suspendu",
  revoked:"Révoqué",
};

export function displayLabel(labels:Record<string,string>,value:string){return labels[value]??value;}
