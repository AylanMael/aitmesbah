import type {
  ContributionType,
  MemoryItem,
  QuickLinkItem,
  VillageFact,
} from "@/types/content";

export const quickLinks: QuickLinkItem[] = [
  { number: "01", label: "Notre histoire", href: "/histoire-memoire" },
  { number: "02", label: "Notre village", href: "/village" },
  { number: "03", label: "La communauté", href: "/diaspora" },
  { number: "04", label: "Comment contribuer", href: "/contribuer" },
];

export const villageFacts: VillageFact[] = [
  { value: "Mémoire vivante", label: "des récits et des savoirs transmis" },
  { value: "Aït Douala", label: "wilaya de Tizi Ouzou · Algérie" },
  { value: "Ici et ailleurs", label: "une communauté liée au village" },
];

export const memoryItems: MemoryItem[] = [
  {
    number: "02",
    category: "Un parcours à découvrir",
    title: "Amar Imache, ses écrits et son combat",
    description: "Photographies, repères biographiques et archives de presse : entrez dans le dossier consacré à Amar Imache et à son engagement dans le mouvement national algérien.",
    href: "/amar-imache",
    action: "Ouvrir le dossier",
  },
  {
    number: "03",
    category: "Une source à lire",
    title: "« Ils nous ont trahis »",
    description: "Un article signé Amar Imache dans La Lutte ouvrière du 5 février 1937. Consultez sa notice et la reproduction du journal pour retrouver le texte dans son contexte.",
    href: "/amar-imache/archives/ils-nous-ont-trahis-1937",
    action: "Consulter l’archive",
  },
  {
    number: "04",
    category: "Chronologie",
    title: "Se repérer dans l’histoire du village",
    description: "Parcourez les grandes périodes, des récits d’origine aux migrations contemporaines. Les repères distinguent les sources documentées, la mémoire locale et la tradition orale.",
    href: "/histoire-memoire",
    action: "Parcourir la chronologie",
  },
];

export const contributionTypes: ContributionType[] = [
  { label: "Une photographie" },
  { label: "Un document d’archive" },
  { label: "Un témoignage" },
  { label: "Une correction historique" },
  { label: "Une actualité ou un événement" },
];
