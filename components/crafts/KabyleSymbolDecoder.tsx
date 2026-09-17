"use client";

import { useState } from "react";

interface KabyleSymbol {
  id: string;
  nameTamazight: string;
  nameFrench: string;
  category: "Cosmogonie" | "Foyer & Famille" | "Protection" | "Nature";
  meaning: string;
  support: "Poterie gravée" | "Tissage Robe & Burnous" | "Poterie & Tissage";
  ethnographicNote: string;
  svgPath: string;
}

const kabyleSymbols: KabyleSymbol[] = [
  {
    id: "tafukt",
    nameTamazight: "Tafukt (ⵜⴰⴼⵓⴽⵜ)",
    nameFrench: "Le Soleil & La Source de Vie",
    category: "Cosmogonie",
    meaning: "Symbole de lumière, de fécondité et d'énergie vitale. Présent au centre des poteries et sur le haut des cols de robes kabyles.",
    support: "Poterie gravée",
    ethnographicNote: "Relevé par Thérèse Rivière en 1939 sur les plats à galette (Afeqrus) à Aït Mesbah. Le cercle central représente la matrice de vie.",
    svgPath: "M50,15 L50,25 M50,75 L50,85 M15,50 L25,50 M75,50 L85,50 M25,25 L32,32 M68,68 L75,75 M75,25 L68,32 M32,68 L25,75 M50,30 A20,20 0 1,0 50,70 A20,20 0 1,0 50,30 Z M50,40 A10,10 0 1,0 50,60 A10,10 0 1,0 50,40 Z",
  },
  {
    id: "tazeqqa",
    nameTamazight: "Tazeqqa (ⵜⴰⵣⴻⵇⵇⴰ)",
    nameFrench: "La Maison & Le Foyer",
    category: "Foyer & Famille",
    meaning: "Le losange structuré représente l'espace domestique sacré, le pilier central (Tigejdit) et l'union des membres de la famille.",
    support: "Poterie & Tissage",
    ethnographicNote: "Gravé sur les grandes jarres d'huile d'olive (Akufi) conservées dans la maison traditionnelle kabyle.",
    svgPath: "M50,15 L85,50 L50,85 L15,50 Z M50,30 L70,50 L50,70 L30,50 Z M50,30 L50,70 M30,50 L70,50",
  },
  {
    id: "tisegnatin",
    nameTamazight: "Tisegnatin (ⵜⵉⵙⴻⴳⵏⴰⵜⵉⵏ)",
    nameFrench: "Les Aiguilles & Le Peigne de Tisserand",
    category: "Protection",
    meaning: "Motifs en chevrons pointus destinés à éloigner le mauvais œil et protéger les récoltes ainsi que les nouveau-nés.",
    support: "Tissage Robe & Burnous",
    ethnographicNote: "Tissé sur la lisière du Burnous blanc et peint au résine d'ocre rouge sur les vases d'eau.",
    svgPath: "M15,70 L32,30 L50,70 L68,30 L85,70 M15,80 L32,40 L50,80 L68,40 L85,80",
  },
  {
    id: "tizizwit",
    nameTamazight: "Tizizwit (ⵜⵉⵣⵉⵣⵡⵉⵜ)",
    nameFrench: "L'Abeille & Le Travail Commun",
    category: "Nature",
    meaning: "Symbolise l'effort collectif, l'esprit d'entraide Tiwizi, la douceur du miel et l'harmonie communautaire.",
    support: "Poterie gravée",
    ethnographicNote: "Figuré par des triangles imbriqués formant des alvéoles sur les cruches à lait d'Aït Mesbah.",
    svgPath: "M50,20 L75,35 L75,65 L50,80 L25,65 L25,35 Z M50,20 L50,80 M25,35 L75,65 M75,35 L25,65",
  },
  {
    id: "asga",
    nameTamazight: "Asga / Adrar (ⴰⴷⵔⴰⵔ)",
    nameFrench: "La Montagne & Les Crestes du Djurdjura",
    category: "Cosmogonie",
    meaning: "Représentation schématique des crêtes géologiques, assurant ancrage, résilience et fierté territoriale.",
    support: "Poterie & Tissage",
    ethnographicNote: "Élément central des bordures géométriques kabyles marquant la limite entre terre cultivée et ciel.",
    svgPath: "M10,75 L30,25 L50,75 L70,25 L90,75 Z M30,45 L50,45 M50,45 L70,45",
  },
  {
    id: "azrem",
    nameTamazight: "Azrem (ⴰⵣⵔⴻⵎ)",
    nameFrench: "Le Serpent Gardien de la Terre",
    category: "Protection",
    meaning: "Ligne ondulante représentant l'esprit protecteur du foyer et des réserves de céréales dans l'Akufi.",
    support: "Poterie gravée",
    ethnographicNote: "Considéré dans la mythologie agricole kabyle comme l'ami du paysan car il protège le grain des rongeurs.",
    svgPath: "M10,50 Q25,20 40,50 T70,50 T100,50 M10,60 Q25,30 40,60 T70,60 T100,60",
  },
];

export default function KabyleSymbolDecoder() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [activeModalSymbol, setActiveModalSymbol] = useState<KabyleSymbol | null>(null);

  const filteredSymbols = selectedCategory === "Tous"
    ? kabyleSymbols
    : kabyleSymbols.filter(s => s.category === selectedCategory);

  return (
    <div className="kabyle-symbol-decoder bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#ffffff15] pb-6">
        <div>
          <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
            🏺 Étape 3 · Conservatoire des Symboles
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
            Le Décodeur Interactif des Motifs Kabyles
          </h3>
          <p className="text-xs text-[#c8d6d0]">
            Cliquez sur un motif pour explorer sa signification cosmique, sa fonction protectrice et sa mémoire ethnographique.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["Tous", "Cosmogonie", "Foyer & Famille", "Protection", "Nature"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#e9c982] text-[#08281f] font-bold shadow"
                  : "bg-[#0b3329] text-[#c8d6d0] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Symbol Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSymbols.map((symbol) => (
          <div
            key={symbol.id}
            onClick={() => setActiveModalSymbol(symbol)}
            className="bg-[#061f19] border border-[#ffffff15] hover:border-[#e9c982] p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] space-y-4 group shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Symbol SVG Display */}
              <div className="w-full h-36 bg-[#041713] rounded-xl flex items-center justify-center p-4 border border-[#ffffff0d] group-hover:border-[#e9c982]/50 transition-colors">
                <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-[#e9c982] fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round drop-shadow-[0_0_8px_rgba(233,201,130,0.3)]">
                  <path d={symbol.svgPath} />
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#efd094] uppercase tracking-wider bg-[#103b30] px-2.5 py-0.5 rounded-full border border-[#ffffff10]">
                  {symbol.category}
                </span>
                <span className="text-[11px] text-[#c8d6d0]">
                  {symbol.support}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-white mt-2 group-hover:text-[#e9c982] transition-colors">
                {symbol.nameTamazight}
              </h4>
              <p className="text-xs text-[#efd094] font-medium">{symbol.nameFrench}</p>
              <p className="text-xs text-[#c8d6d0] line-clamp-2 mt-2 leading-relaxed">
                {symbol.meaning}
              </p>
            </div>

            <div className="pt-3 border-t border-[#ffffff10] flex items-center justify-between text-xs text-[#e9c982] font-semibold">
              <span>Décoder le symbole</span>
              <span>🔍 ➔</span>
            </div>
          </div>
        ))}
      </div>

      {/* Symbol Modal Detail */}
      {activeModalSymbol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08281f] border border-[#d7b56f]/50 p-6 md:p-8 rounded-3xl max-w-lg w-full space-y-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModalSymbol(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-[#ffffff15] pb-4">
              <div className="w-20 h-20 bg-[#041713] rounded-2xl flex items-center justify-center border border-[#e9c982]/40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-14 h-14 stroke-[#e9c982] fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
                  <path d={activeModalSymbol.svgPath} />
                </svg>
              </div>

              <div>
                <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {activeModalSymbol.category}
                </span>
                <h4 className="font-serif text-2xl font-bold text-white mt-1">
                  {activeModalSymbol.nameTamazight}
                </h4>
                <p className="text-xs text-[#efd094]">{activeModalSymbol.nameFrench}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#c8d6d0] leading-relaxed">
              <div>
                <span className="font-bold text-[#e9c982] block mb-1">📜 Signification & Symbolique :</span>
                <p className="bg-[#061f19] p-3 rounded-xl border border-[#ffffff10]">
                  {activeModalSymbol.meaning}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#e9c982] block mb-1">🏺 Support d&apos;expression :</span>
                <p>{activeModalSymbol.support}</p>
              </div>

              <div>
                <span className="font-bold text-[#e9c982] block mb-1">💡 Note Ethnographique & Archives :</span>
                <p className="italic bg-[#0b3329] p-3 rounded-xl border-l-4 border-l-[#e9c982]">
                  &quot;{activeModalSymbol.ethnographicNote}&quot;
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModalSymbol(null)}
              className="w-full py-2.5 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-xl transition-colors"
            >
              Fermer le décodeur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
