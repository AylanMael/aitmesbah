import type { NavigationItem } from "@/types/content";

type FooterCommunityItem = {
  label: string;
  href: string | null;
};

export const mainNavigation: NavigationItem[] = [
  { label: "Découvrir", href: "/village" },
  { label: "Histoire et mémoire", href: "/histoire-memoire" },
  {
    label: "Vivre au village",
    href: "/vivre",
    children: [
      { label: "Comité du village", href: "/comite-village", description: "Dialogue et initiatives collectives", icon: "committee" },
      { label: "Association sportive ASAM", href: "/asam", description: "Football, jeunesse et palmarès", icon: "sport" },
      { label: "Club de judo JCAM", href: "/jcam", description: "Judo, formation et champions", icon: "judo" },
      { label: "Association culturelle Imache Amar", href: "/association-imache-amar", description: "Culture, jeunesse et mémoire", icon: "culture" },
    ],
  },
  { label: "Agenda", href: "/agenda" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Agir ensemble", href: "/agir" },
];

export const footerDiscoverLinks: NavigationItem[] = [
  { label: "Le village", href: "/village" },
  { label: "Histoire & mémoire", href: "/histoire-memoire" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Vivre au village", href: "/vivre" },
  { label: "Agenda", href: "/agenda" },
  { label: "Contribuer", href: "/contribuer" },
];

export const footerCommunityLinks: FooterCommunityItem[] = [
  { label: "Agir ensemble", href: "/agir" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Contribuer", href: "/contribuer" },
  { label: "Galerie & archives — bientôt", href: null },
];
