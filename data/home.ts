import type {
  ContributionType,
  EventItem,
  MemoryItem,
  NewsItem,
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

export const news: NewsItem[] = [
  {
    tag: "Vie du village",
    title: "Les nouvelles d’Aït Mesbah",
    text: "Un espace éditorial pour partager les initiatives, les projets et les informations qui rythment la vie du village.",
    tone: "olive",
  },
  {
    tag: "Mémoire",
    title: "Une photographie, une histoire",
    text: "Chaque archive confiée par une famille contribue à préserver la mémoire collective et à la transmettre.",
    tone: "clay",
  },
  {
    tag: "Diaspora",
    title: "Des liens par-delà les montagnes",
    text: "Portraits, parcours et nouvelles de celles et ceux qui font vivre Aït Mesbah à travers le monde.",
    tone: "blue",
  },
];

export const events: EventItem[] = [
  {
    kind: "Culture",
    title: "Rencontre culturelle",
    meta: "Programme et lieu à compléter",
  },
  {
    kind: "Village",
    title: "Assemblée ou initiative locale",
    meta: "Informations à venir",
  },
  {
    kind: "Diaspora",
    title: "Rencontre de la communauté",
    meta: "Ville et horaires à compléter",
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
