export interface TourStep {
  number: string;
  title: string;
  locationName: string;
  quarter: string;
  description: string;
  anecdote?: string;
  coordinates: { lat: number; lon: number };
  imageSrc?: string;
  audioGuideAvailable?: boolean;
}

export interface VillageTour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  theme: string;
  distance: string;
  duration: string;
  difficulty: "Facile" | "Modéré" | "Randonneur";
  color: string;
  icon: string;
  badge: string;
  summary: string;
  steps: readonly TourStep[];
}

export const villageTours: readonly VillageTour[] = [
  {
    id: "tour-imache",
    slug: "sur-les-pas-d-amar-imache",
    title: "Sur les pas d’Amar Imache",
    subtitle: "Itinéraire de mémoire & du mouvement national",
    theme: "Histoire & Mémoire Nationale",
    distance: "1,2 km",
    duration: "35 min",
    difficulty: "Facile",
    color: "#aa593c",
    icon: "📜",
    badge: "Circuit Historique",
    summary:
      "Un parcours mémoriel traversant Aït Salah et Tanajelte, retraçant la mémoire d'Amar Imache.",
    steps: [
      {
        number: "01",
        title: "Maison natale d’Amar Imache",
        locationName: "Demeure familiale des Ath Imache",
        quarter: "Aït Salah",
        description:
          "Demeure historique située à Aït Salah, haut-lieu de mémoire rattaché au parcours d'Amar Imache.",
        coordinates: { lat: 36.6141, lon: 4.0628 },
        imageSrc: "/images/amar-imache/portrait-ancien.jpg",
        audioGuideAvailable: true,
      },
      {
        number: "02",
        title: "El Djema n’Ath Salah",
        locationName: "Lieu d'assemblée du quartier",
        quarter: "Aït Salah",
        description:
          "Espace traditionnel de rassemblement des habitants d'Aït Salah.",
        coordinates: { lat: 36.6138, lon: 4.0624 },
        audioGuideAvailable: true,
      },
      {
        number: "03",
        title: "La Place Tajmaât",
        locationName: "Lieu d'assemblée du village",
        quarter: "Tanajelte",
        description:
          "Lieu d'exercice traditionnel de l'assemblée Tajmaât à Aït Mesbah.",
        coordinates: { lat: 36.6123, lon: 4.0618 },
        audioGuideAvailable: true,
      },
      {
        number: "04",
        title: "Monument aux Martyrs d’Aït Mesbah",
        locationName: "Mémorial des Chouhada",
        quarter: "Tanajelte",
        description:
          "Mémorial érigé en hommage aux enfants du village tombés durant la Guerre de Libération Nationale.",
        coordinates: { lat: 36.612, lon: 4.0615 },
        audioGuideAvailable: true,
      },
    ],
  },
  {
    id: "tour-fontaines",
    slug: "chemin-des-fontaines-et-de-la-terre",
    title: "Le Chemin des Fontaines & de la Terre",
    subtitle: "Artisanat de la poterie & sources du village",
    theme: "Savoir-faire & Patrimoine Hydraulique",
    distance: "1,8 km",
    duration: "45 min",
    difficulty: "Modéré",
    color: "#c79145",
    icon: "🏺",
    badge: "Artisanat & Nature",
    summary:
      "Parcours reliant les quartiers d'artisans d'Aït Moussa et les fontaines traditionnelles Alma Ath Amrane et Bouagala.",
    steps: [
      {
        number: "01",
        title: "Ateliers de Poterie d’Aït Moussa",
        locationName: "Ateliers de poterie",
        quarter: "Aït Moussa",
        description:
          "Quartier d'Aït Moussa réputé pour son artisanat traditionnel de la poterie.",
        coordinates: { lat: 36.6152, lon: 4.0645 },
        imageSrc: "/images/artisanat/poterie.jpg",
        audioGuideAvailable: true,
      },
      {
        number: "02",
        title: "Fontaine Alma Ath Amrane",
        locationName: "Tala Alma Ath Amrane",
        quarter: "Aït Moussa",
        description:
          "Source d'eau et fontaine traditionnelle du village.",
        coordinates: { lat: 36.6158, lon: 4.0651 },
        audioGuideAvailable: true,
      },
      {
        number: "03",
        title: "Fontaine Bouagala",
        locationName: "Tala Bouagala",
        quarter: "Aït Moussa",
        description:
          "Source naturelle d'eau du village.",
        coordinates: { lat: 36.6162, lon: 4.0658 },
        audioGuideAvailable: true,
      },
    ],
  },
  {
    id: "tour-panorama",
    slug: "panorama-du-djurdjura-et-tassast",
    title: "Panorama du Djurdjura & Crêtes",
    subtitle: "Sentier des crêtes & Ighf Ouguemoune",
    theme: "Randonnée Topographique",
    distance: "2,4 km",
    duration: "1h 00",
    difficulty: "Randonneur",
    color: "#173e32",
    icon: "🏔️",
    badge: "Grand Panorama",
    summary:
      "Itinéraire reliant les crêtes d'Ighf Ouguemoune et les hauteurs d'Aït Mesbah.",
    steps: [
      {
        number: "01",
        title: "Ighf Ouguemoune (780m)",
        locationName: "Point culminant d’Aït Mesbah",
        quarter: "Aït Moussa",
        description:
          "Belvédère naturel offrant une vue panoramique sur les crêtes de Kabylie et le Djurdjura.",
        coordinates: { lat: 36.6165, lon: 4.065 },
        audioGuideAvailable: true,
      },
      {
        number: "02",
        title: "Tassast",
        locationName: "Quartier haut",
        quarter: "Tassast",
        description:
          "Quartier ancien du village d'Aït Mesbah.",
        coordinates: { lat: 36.6115, lon: 4.0592 },
        audioGuideAvailable: true,
      },
    ],
  },
] as const;
