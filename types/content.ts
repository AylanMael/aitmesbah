export interface NavigationItem {
  label: string;
  href: string;
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

export interface PlaceItem {
  category: string;
  title: string;
  description?: string;
  draftLabel: string;
  large?: boolean;
}

export interface ContributionType {
  label: string;
}
