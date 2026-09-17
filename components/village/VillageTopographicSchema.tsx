"use client";

import { villageDistricts } from "@/data/village-atlas";

interface VillageTopographicSchemaProps {
  activeDistrictIndex: number;
  onSelectDistrict: (index: number) => void;
  categoryFilter?: string;
}

export default function VillageTopographicSchema({
  activeDistrictIndex,
  onSelectDistrict,
  categoryFilter = "all",
}: VillageTopographicSchemaProps) {
  // Coordinates mapping on 800x600 viewBox
  const schemaNodes = [
    { index: 0, x: 500, y: 380, label: "Aït Moussa", tag: "Ighf Ouguemoune (Sommet)", icon: "🏔️", cat: "quartier" },
    { index: 1, x: 440, y: 360, label: "Aït Salah", tag: "Maison Amar Imache", icon: "🏛️", cat: "memoire" },
    { index: 2, x: 416, y: 318, label: "Tanajelte", tag: "Cœur & Monument", icon: "🕊️", cat: "memoire" },
    { index: 3, x: 384, y: 276, label: "Tassast", tag: "Colline & Mosquée ancienne", icon: "🕌", cat: "quartier" },
    { index: 4, x: 336, y: 240, label: "Lakouyathe", tag: "École primaire", icon: "🏫", cat: "equipement" },
    { index: 5, x: 304, y: 300, label: "Timizart Oussamar", tag: "Versant d'Oussamar", icon: "☀️", cat: "quartier" },
    { index: 6, x: 528, y: 276, label: "El Hammam", tag: "Sources & Vallon", icon: "⛲", cat: "fontaine" },
    { index: 7, x: 256, y: 384, label: "Ighil Oussamar", tag: "CEM & Huileries", icon: "🫒", cat: "equipement" },
    { index: 8, x: 576, y: 132, label: "Ighil Hammou", tag: "Limite Ath Douala / Ath Aïssi", icon: "📍", cat: "quartier" },
  ];

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#071f19] border border-[#d7b56f]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full select-none"
        aria-label="Schéma topographique détaillé d'Aït Mesbah"
      >
        <defs>
          {/* Gradients & Filters */}
          <radialGradient id="mountainGlow" cx="60%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#d7b56f" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#071f19" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9c982" />
            <stop offset="100%" stopColor="#aa593c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Relief Layers */}
        <rect width="800" height="600" fill="#071f19" />
        <circle cx="480" cy="350" r="320" fill="url(#mountainGlow)" />

        {/* Topographic Contour Lines (Lignes de niveau du relief) */}
        <g stroke="#d7b56f" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" fill="none">
          <path d="M 100 500 Q 250 420 420 480 T 750 450" />
          <path d="M 120 460 Q 280 370 450 420 T 720 380" />
          <path d="M 150 410 Q 320 320 480 370 T 680 320" />
          <path d="M 200 360 Q 350 260 520 310 T 650 250" />
          <path d="M 280 300 Q 400 210 550 250 T 620 180" />
          <path d="M 360 240 Q 450 170 580 190 T 600 120" />
        </g>

        {/* Peak Highlight for Ighf Ouguemoune (780m) */}
        <path
          d="M 500 345 L 515 375 L 485 375 Z"
          fill="#e9c982"
          fillOpacity="0.3"
          stroke="#e9c982"
          strokeWidth="1.5"
        />
        <text x="500" y="340" textAnchor="middle" fill="#efd094" fontSize="10" fontWeight="bold" fontFamily="serif">
          ▲ Ighf Ouguemoune (Point culminant 780m)
        </text>

        {/* Main Road CW 100 (Winding Road through Ath Douala) */}
        <path
          d="M 150 550 C 220 450, 260 400, 330 350 S 410 320, 460 350 T 540 400 T 650 320 T 720 120"
          fill="none"
          stroke="url(#roadGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 150 550 C 220 450, 260 400, 330 350 S 410 320, 460 350 T 540 400 T 650 320 T 720 120"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.6"
        />
        <text x="170" y="530" fill="#e9c982" fontSize="9" fontWeight="bold" letterSpacing="1">
          ROUTE CW 100 (vers Ath Zmenzer / Ath Douala)
        </text>

        {/* Secondary Village Trails (Sentiers d'Aït Mesbah) */}
        <g stroke="#c8d6d0" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" fill="none">
          {/* Trail to Alma Ath Amrane / Bouagala fontaines */}
          <path d="M 500 380 L 528 276" />
          {/* Trail from Aït Salah to Tanajelte */}
          <path d="M 440 360 L 416 318" />
          {/* Trail from Tanajelte to Tassast */}
          <path d="M 416 318 L 384 276" />
          {/* Trail from Tassast to Lakouyathe */}
          <path d="M 384 276 L 336 240" />
          {/* Trail to Timizart Oussamar */}
          <path d="M 416 318 L 304 300" />
          {/* Trail to Ighil Hammou */}
          <path d="M 416 318 L 576 132" />
        </g>

        {/* Stream / Vallon d'El Hammam */}
        <path
          d="M 560 50 C 540 180, 530 250, 528 276 T 600 450 T 680 550"
          fill="none"
          stroke="#52b788"
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.6"
        />
        <text x="600" y="470" fill="#52b788" fontSize="9" fontStyle="italic">
          ~ Vallon & Sources d&apos;El Hammam ~
        </text>

        {/* District Node Markers */}
        {schemaNodes.map((node) => {
          const isSelected = activeDistrictIndex === node.index;
          const isVisible = categoryFilter === "all" || node.cat === categoryFilter;

          if (!isVisible) return null;

          return (
            <g
              key={node.index}
              onClick={() => onSelectDistrict(node.index)}
              className="cursor-pointer group/node"
              tabIndex={0}
              role="button"
              aria-label={`Sélectionner ${node.label}`}
            >
              {/* Pulsing selection aura */}
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill="#aa593c"
                  fillOpacity="0.3"
                  className="animate-ping"
                />
              )}

              {/* Node Outer Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? "18" : "14"}
                fill={isSelected ? "#aa593c" : "#103b30"}
                stroke={isSelected ? "#e9c982" : "#ffffff40"}
                strokeWidth={isSelected ? "2.5" : "1.5"}
                className="transition-all duration-300 group-hover/node:scale-125"
                filter={isSelected ? "url(#glow)" : undefined}
              />

              {/* Node Icon/Number */}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="11"
                fill="#ffffff"
                className="pointer-events-none font-bold"
              >
                {node.icon}
              </text>

              {/* Label Badge */}
              <g transform={`translate(${node.x}, ${node.y - 22})`}>
                <rect
                  x="-65"
                  y="-14"
                  width="130"
                  height="20"
                  rx="10"
                  fill={isSelected ? "#0d2d25" : "#08221be6"}
                  stroke={isSelected ? "#e9c982" : "#ffffff30"}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill={isSelected ? "#efd094" : "#ffffff"}
                  fontSize="10"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="sans-serif"
                >
                  {String(node.index + 1).padStart(2, "0")}. {node.label}
                </text>
              </g>

              {/* Sub-Tag on Hover/Selection */}
              {isSelected && (
                <g transform={`translate(${node.x}, ${node.y + 32})`}>
                  <rect
                    x="-80"
                    y="-12"
                    width="160"
                    height="18"
                    rx="4"
                    fill="#aa593ce6"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    📍 {node.tag}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend Panel (Bas gauche) */}
        <g transform="translate(20, 480)">
          <rect width="210" height="100" rx="12" fill="#08221be6" stroke="#ffffff20" strokeWidth="1" />
          <text x="15" y="22" fill="#efd094" fontSize="10" fontWeight="bold" letterSpacing="1">
            LÉGENDE DU SCHÉMA :
          </text>
          <line x1="15" y1="30" x2="195" y2="30" stroke="#ffffff20" strokeWidth="1" />
          
          <line x1="20" y1="46" x2="45" y2="46" stroke="url(#roadGradient)" strokeWidth="3" />
          <text x="55" y="49" fill="#c8d6d0" fontSize="9">Route CW 100 (Principale)</text>

          <line x1="20" y1="66" x2="45" y2="66" stroke="#c8d6d0" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="55" y="69" fill="#c8d6d0" fontSize="9">Sentiers du village (Tiwizi)</text>

          <circle cx="32" cy="85" r="5" fill="#103b30" stroke="#efd094" />
          <text x="55" y="88" fill="#c8d6d0" fontSize="9">Quartier / Lieu documenté</text>
        </g>
      </svg>

      {/* Top Banner overlay */}
      <div className="absolute top-3 left-4 bg-[#08221be6] border border-[#ffffff20] backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-[#efd094] font-bold flex items-center gap-2">
        <span>✏️ Vue Schéma Vectoriel Topographique</span>
        <span className="text-[#b6c3bd] font-normal">· Cliquez sur un quartier pour l&apos;examiner</span>
      </div>
    </div>
  );
}
