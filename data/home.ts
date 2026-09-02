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
    category: "Archives",
    title: "Photographies et archives",
    description: "Des photographies, documents et objets pourront être présentés après identification de leur origine et validation des droits de publication.",
  },
  {
    number: "03",
    category: "Témoignages",
    title: "Témoignages",
    description: "Des témoignages pourront être recueillis avec le consentement des personnes concernées, puis vérifiés et contextualisés avant publication.",
  },
  {
    number: "04",
    category: "Chronologie",
    title: "Repères chronologiques",
    description: "Une chronologie pourra être constituée progressivement à partir de sources identifiées et recoupées.",
  },
];

export const contributionTypes: ContributionType[] = [
  { label: "Une photographie" },
  { label: "Un document d’archive" },
  { label: "Un témoignage" },
  { label: "Une correction historique" },
  { label: "Une actualité ou un événement" },
];
