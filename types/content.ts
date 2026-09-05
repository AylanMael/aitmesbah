export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  icon?: "committee" | "sport" | "judo" | "culture";
  children?: NavigationItem[];
}

export interface QuickLinkItem extends NavigationItem {
  number: string;
}

export interface VillageFact {
  value: string;
  label: string;
}

export interface MemoryItem {
  number: string;
  category: string;
  title: string;
  description: string;
}

export interface ContributionType {
  label: string;
}
