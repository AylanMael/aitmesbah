import type {
  ContributionType,
  MemoryItem,
  PlaceItem,
  QuickLinkItem,
  VillageFact,
} from "@/types/content";

export const quickLinks: QuickLinkItem[] = [
  { number: "01", label: "Notre histoire", href: "#memoire" },
  { number: "02", label: "En ce moment", href: "#vivre" },
  { number: "03", label: "Prochains rendez-vous", href: "#agenda" },
  { number: "04", label: "Partager une mémoire", href: "#contribuer" },
];

export const villageFacts: VillageFact[] = [
  { value: "≈ 4 000", label: "résidents" },
  { value: "Haute Kabylie", label: "Algérie" },
  { value: "Une diaspora", label: "à travers le monde" },
];

export const memoryItems: MemoryItem[] = [
  {
    number: "02",
    category: "Archives",
    title: "Les images du temps",
    description: "Photographies, documents et objets confiés par les familles.",
  },
  {
    number: "03",
    category: "Témoignages",
    title: "La voix de nos aînés",
    description: "Récits audio et vidéo pour écouter celles et ceux qui savent.",
  },
  {
    number: "04",
    category: "Chronologie",
    title: "Les dates qui nous relient",
    description: "Une frise collective, enrichie et vérifiée au fil du temps.",
  },
];

export const places: PlaceItem[] = [
  {
    category: "Lieu emblématique",
    title: "Un lieu, une histoire",
    description: "Nom et récit à documenter",
    draftLabel: "CONTENU À COMPLÉTER",
    large: true,
  },
  {
    category: "Patrimoine",
    title: "Fontaines & places",
    draftLabel: "À COMPLÉTER",
  },
  {
    category: "Paysages",
    title: "Chemins & horizons",
    draftLabel: "À COMPLÉTER",
  },
];

export const voiceCategories: string[] = [
  "Aînés",
  "Habitants",
  "Jeunesse",
  "Diaspora",
];

export const contributionTypes: ContributionType[] = [
  { label: "Une photographie" },
  { label: "Un document d’archive" },
  { label: "Un témoignage" },
  { label: "Une correction historique" },
  { label: "Une actualité ou un événement" },
];
