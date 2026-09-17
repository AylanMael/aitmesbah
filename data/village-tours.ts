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
      "Un parcours mémoriel traversant Aït Salah et Tanajelte, retraçant la jeunesse, les racines et l'héritage d'Amar Imache, secrétaire général de l'Étoile Nord-Africaine.",
    steps: [
      {
        number: "01",
        title: "Maison natale d’Amar Imache",
        locationName: "Demeure familiale des Ath Imache",
        quarter: "Aït Salah",
        description:
          "C'est ici qu'Amar Imache est né le 7 juillet 1895. La maison en pierre traditionnelle domine la crête d'Aït Salah et conserve l'esprit des familles d'Ath Douala.",
        anecdote:
          "De sa fenêtre, le jeune Imache contemplait les montagnes du Djurdjura qui inspireront plus tard ses écrits sur la souveraineté et la liberté du peuple.",
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
          "Espace traditionnel de rassemblement où les habitants du quartier se réunissaient pour délibérer des affaires collectives et des volontariats.",
        coordinates: { lat: 36.6138, lon: 4.0624 },
        audioGuideAvailable: true,
      },
      {
        number: "03",
        title: "La Place Tajmaât",
        locationName: "Cœur de la démocratie villageoise",
        quarter: "Tanajelte",
        description:
          "Le centre névralgique du village d'Aït Mesbah. C'est le lieu d'exercice de la Tajmaât, l'assemblée démocratique traditionnelle garantissant la cohésion et le respect des règles communautaires.",
        anecdote:
          "Les principes d'organisation de la Tajmaât ont profondément influencé Imache Amar dans sa vision de la démocratie et du contrôle populaire.",
        coordinates: { lat: 36.6123, lon: 4.0618 },
        audioGuideAvailable: true,
      },
      {
        number: "04",
        title: "Monument aux Martyrs d’Aït Mesbah",
        locationName: "Mémorial des Chouhada",
        quarter: "Tanajelte",
        description:
          "Un lieu du souvenir érigé en hommage aux enfants du village tombés durant la Guerre de Libération Nationale (1954-1962).",
        coordinates: { lat: 36.612, lon: 4.0615 },
        audioGuideAvailable: true,
      },
    ],
  },
  {
    id: "tour-fontaines",
    slug: "chemin-des-fontaines-et-de-la-terre",
    title: "Le Chemin des Fontaines & de la Terre",
    subtitle: "Artisanat de la poterie & sources ancestrales",
    theme: "Savoir-faire & Patrimoine Hydraulique",
    distance: "1,8 km",
    duration: "45 min",
    difficulty: "Modéré",
    color: "#c79145",
    icon: "🏺",
    badge: "Artisanat & Nature",
    summary:
      "Une déambulation entre les ateliers de potiers d'Aït Moussa et les fontaines séculaires Alma Ath Amrane et Bouagala, sources d'eau et de vie de la communauté.",
    steps: [
      {
        number: "01",
        title: "Ateliers de Poterie d’Aït Moussa",
        locationName: "Ateliers des potières du village",
        quarter: "Aït Moussa",
        description:
          "Découverte de la modélisation manuelle de l'argile et de la peinture aux engobes naturels. La poterie d'Aït Mesbah est célèbre pour ses lignes géométriques et ses motifs symboliques.",
        anecdote:
          "Les engobes rouges et noirs sont préparés à partir de minéraux locaux récoltés dans les vallons du Djurdjura.",
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
          "L'une des fontaines traditionnelles les plus fréquentées du village. Espace de rencontre pour les femmes et lieu de rafraîchissement préservé.",
        coordinates: { lat: 36.6158, lon: 4.0651 },
        audioGuideAvailable: true,
      },
      {
        number: "03",
        title: "Fontaine Bouagala",
        locationName: "Tala Bouagala",
        quarter: "Aït Moussa",
        description:
          "Une source naturelle fraîche jaillissant du flanc de montagne, connue pour la pureté de son eau et ses vertus d'apaisement.",
        coordinates: { lat: 36.6162, lon: 4.0658 },
        audioGuideAvailable: true,
      },
      {
        number: "04",
        title: "Huilerie Traditionnelle d’Olive",
        locationName: "Maâssara d'Aït Moussa",
        quarter: "Aït Moussa",
        description:
          "La presse à huile de pierre traditionnelle où les olives récoltées en hiver sont broyées pour produire l'huile d'olive extra-vierge du terroir.",
        coordinates: { lat: 36.615, lon: 4.0639 },
        audioGuideAvailable: true,
      },
    ],
  },
  {
    id: "tour-panorama",
    slug: "panorama-du-djurdjura-et-tassast",
    title: "Panorama du Djurdjura & Crêtes",
    subtitle: "Randonnée des crêtes, Tassast & Ighf Ouguemoune",
    theme: "Randonnée Topographique & Vues Panoramiques",
    distance: "2,4 km",
    duration: "1h 00",
    difficulty: "Randonneur",
    color: "#173e32",
    icon: "🏔️",
    badge: "Grand Panorama",
    summary:
      "Une randonnée stimulante offrant des vues spectaculaires à 360° sur la chaîne du Djurdjura, la mosquée ancienne de Tassast et les oliveraies d'Oussamar.",
    steps: [
      {
        number: "01",
        title: "Ighf Ouguemoune (780m)",
        locationName: "Point culminant d’Aït Mesbah",
        quarter: "Aït Moussa",
        description:
          "Le sommet du village offrant un belvédère impressionnant sur les massifs de la Kabylie, la vallée de la Soummam et les crêtes d'Ath Douala.",
        coordinates: { lat: 36.6165, lon: 4.065 },
        audioGuideAvailable: true,
      },
      {
        number: "02",
        title: "Tassast & Mosquée Ancienne",
        locationName: "Le plus ancien quartier du village",
        quarter: "Tassast",
        description:
          "Perché sur une colline escarpée, Tassast conserve les bâtisses en pierre d'origine et la mosquée séculaire du village.",
        coordinates: { lat: 36.6115, lon: 4.0592 },
        audioGuideAvailable: true,
      },
      {
        number: "03",
        title: "Versant de Timizart Oussamar",
        locationName: "Oliveraies ensoleillées",
        quarter: "Timizart Oussamar",
        description:
          "Traversée des oliveraies baignées de soleil où se déroule chaque automne la grande cueillette collective des olives (Tiwizi n uzzemur).",
        coordinates: { lat: 36.6082, lon: 4.061 },
        audioGuideAvailable: true,
      },
      {
        number: "04",
        title: "Route d’Ighil Oussamar vers Ath Zmenzer",
        locationName: "Collège CEM & Huileries modernes",
        quarter: "Ighil Oussamar",
        description:
          "Fin de la boucle le long de la route reliant Aït Mesbah à Ath Zmenzer, découvrant le CEM du village et le dynamisme de l'extension sud.",
        coordinates: { lat: 36.6065, lon: 4.0545 },
        audioGuideAvailable: true,
      },
    ],
  },
] as const;
