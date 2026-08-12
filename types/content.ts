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

export interface NewsItem {
  tag: string;
  title: string;
  text: string;
  tone: "olive" | "clay" | "blue";
}

export interface EventItem {
  kind: string;
  title: string;
  meta: string;
}

export interface ContributionType {
  label: string;
}
