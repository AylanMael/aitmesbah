import type { NavigationItem } from "@/types/content";

type FooterCommunityItem = {
  label: string;
  href: string | null;
};

export const mainNavigation: NavigationItem[] = [
  { label: "Découvrir", href: "/village" },
  { label: "Histoire et mémoire", href: "/histoire-memoire" },
  { label: "Vie du village", href: "/#vivre" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Diaspora", href: "/#diaspora" },
];

export const footerDiscoverLinks: NavigationItem[] = [
  { label: "Le village", href: "/village" },
  { label: "Histoire & mémoire", href: "/histoire-memoire" },
  { label: "Actualités", href: "/#vivre" },
  { label: "Agenda", href: "/#agenda" },
];

export const footerCommunityLinks: FooterCommunityItem[] = [
  { label: "Diaspora", href: "/#diaspora" },
  { label: "Contribuer", href: "/#contribuer" },
  { label: "Associations — bientôt", href: null },
  { label: "Galerie & archives — bientôt", href: null },
];
