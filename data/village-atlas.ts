export interface VillageDistrict {
  slug: string;
  name: string;
  index: string;
  situation: string;
  note: string;
  landmarks: string[];
}

export const villageDistricts: readonly VillageDistrict[] = [
  {
    slug: "ait-moussa",
    name: "Aït Moussa",
    index: "01",
    situation: "Flanc de crête · Point culminant du village",
    note: "Le quartier se trouve sur le flanc d'une crête. Il abrite Ighf Ouguemoune, le point culminant et le plus haut d'Aït Mesbah, ainsi que la mosquée Aït Moussa, les fontaines Alma Ath Amrane et Bouagala, une pharmacie et une huilerie traditionnelle.",
    landmarks: [
      "Fontaine Alma Ath Amrane",
      "Fontaine Bouagala",
      "Ighf Ouguemoune (Point culminant)",
      "Mosquée Aït Moussa",
      "Pharmacie",
      "Huilerie traditionnelle",
    ],
  },
  {
    slug: "ait-salah",
    name: "Aït Salah",
    index: "02",
    situation: "Crête secondaire · Histoire & mémoire",
    note: "Aït Salah se trouve sur une crête secondaire. C'est le berceau historique d'Amar Imache (1895-1960), figure emblématique du mouvement national algérien. On y trouve notamment El Djema n'Ath Salah.",
    landmarks: [
      "El Djema n'Ath Salah",
      "Maison natale d'Amar Imache",
      "Crête secondaire d'Ath Salah",
    ],
  },
  {
    slug: "tanajelt",
    name: "Tanajelte",
    index: "03",
    situation: "Centre du village · Espace commerçant et de mémoire",
    note: "Tanajelte constitue le centre névralgique du village d'Aït Mesbah. Quartier vivant animé par des commerces de proximité, il abrite le monument aux martyrs dédié aux chouhada du village.",
    landmarks: [
      "Centre du village",
      "Monument aux martyrs",
      "Commerces de proximité",
    ],
  },
  {
    slug: "tassast",
    name: "Tassast",
    index: "04",
    situation: "Colline · Quartier ancien",
    note: "Située sur une colline, Tassast figure parmi les quartiers les plus anciens d'Aït Mesbah. Il est caractérisé par sa mosquée ancienne et son architecture traditionnelle.",
    landmarks: [
      "Mosquée ancienne",
      "Quartier historique (le plus ancien)",
      "Vue panoramique sur la colline",
    ],
  },
  {
    slug: "lakouyathe",
    name: "Lakouyathe",
    index: "05",
    situation: "Extension résidentielle (années 80-90)",
    note: "Lakouyathe est un quartier relativement nouveau qui s'est principalement formé dans les années 1980 et 1990. C'est là que se situe l'école primaire du village.",
    landmarks: [
      "École primaire du village",
      "Habitations des années 80 et 90",
    ],
  },
  {
    slug: "timizart-oussamer",
    name: "Timizart Oussamar",
    index: "06",
    situation: "Axe routier vers Ath Zmenzer",
    note: "Quartier récent s'étant développé le long de la route reliant Aït Mesbah à Ath Zmenzer. On y recense le CEM (Collège d'enseignement moyen), de nouvelles bâtisses et des huileries.",
    landmarks: [
      "CEM (Collège d'enseignement moyen)",
      "Huileries",
      "Nouvelles bâtisses",
      "Route d'Ath Zmenzer",
    ],
  },
  {
    slug: "el-hammam",
    name: "El Hammam",
    index: "07",
    situation: "Périphérie du village",
    note: "Petit quartier excentré, situé à quelques centaines de mètres en contrebas du cœur du village.",
    landmarks: [
      "Sources d'El Hammam",
      "Secteur vallonné périphérique",
    ],
  },
  {
    slug: "ighil-oussamer",
    name: "Ighil Oussamar",
    index: "08",
    situation: "Crête ensoleillée (Oussamar)",
    note: "Également situé le long de l'axe vers Ath Zmenzer sur le versant ensoleillé (Oussamar), ce quartier en plein essor compte de nouvelles bâtisses et huileries.",
    landmarks: [
      "Axe vers Ath Zmenzer",
      "Bâtisses récentes & huileries",
    ],
  },
  {
    slug: "ighil-hamou",
    name: "Ighil Hammou",
    index: "09",
    situation: "Limite communale (Ath Douala / Ath Aïssi)",
    note: "Ighil Hammou est le quartier le plus éloigné d'Aït Mesbah. Il s'étend à la limite territoriale entre le chef-lieu de la commune d'Ath Douala et la commune d'Ath Aïssi.",
    landmarks: [
      "Limite communale Ath Douala / Ath Aïssi",
      "Point le plus éloigné du village",
    ],
  },
];

