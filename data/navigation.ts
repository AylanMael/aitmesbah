import type { NavigationItem } from "@/types/content";

type FooterCommunityItem = {
  label: string;
  href: string | null;
};

export const mainNavigation: NavigationItem[] = [
  { label: "Découvrir", href: "/village" },
  { label: "Histoire et mémoire", href: "/histoire-memoire" },
  { label: "Diaspora", href: "/diaspora" },
];

export const footerDiscoverLinks: NavigationItem[] = [
  { label: "Le village", href: "/village" },
  { label: "Histoire & mémoire", href: "/histoire-memoire" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Contribuer", href: "/contribuer" },
];

export const footerCommunityLinks: FooterCommunityItem[] = [
  { label: "Diaspora", href: "/diaspora" },
  { label: "Contribuer", href: "/contribuer" },
];
