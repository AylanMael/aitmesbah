import type { NavigationItem } from "@/types/content";

export const mainNavigation: NavigationItem[] = [
  { label: "Découvrir", href: "#decouvrir" },
  { label: "Histoire & mémoire", href: "#memoire" },
  { label: "Vie du village", href: "#vivre" },
  { label: "Agenda", href: "#agenda" },
  { label: "Diaspora", href: "#diaspora" },
];

export const footerDiscoverLinks: NavigationItem[] = [
  { label: "Le village", href: "#decouvrir" },
  { label: "Histoire & mémoire", href: "#memoire" },
  { label: "Actualités", href: "#vivre" },
  { label: "Agenda", href: "#agenda" },
];

export const footerCommunityLinks: NavigationItem[] = [
  { label: "Diaspora", href: "#diaspora" },
  { label: "Contribuer", href: "#contribuer" },
  { label: "Associations", href: "#" },
  { label: "Galerie & archives", href: "#" },
];
