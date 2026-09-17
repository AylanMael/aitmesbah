"use client";

import { useState } from "react";

interface FamilyNotice {
  id: string;
  name: string;
  quarter: "Aït Salah" | "Aït Moussa" | "Alma Ath Amrane" | "Tanajelte";
  diasporaLocations: string[];
  notableFigures: string[];
  description: string;
  tradition: string;
}

const familyNotices: FamilyNotice[] = [
  {
    id: "imache",
    name: "Famille Imache (Ath Imache)",
    quarter: "Aït Salah",
    diasporaLocations: ["Paris (France)", "Alger", "Marseille"],
    notableFigures: ["Amar Imache (Pionnier du nationalisme algérien)"],
    description: "Lignée historique d'Aït Salah associée à la fondation du mouvement nationaliste et à la préservation de la mémoire du village.",
    tradition: "Calligraphie, écriture & action politique nationale",
  },
  {
    id: "amrane",
    name: "Famille Ait-Amrane & Ath Amrane",
    quarter: "Alma Ath Amrane",
    diasporaLocations: ["Lyon (France)", "Montréal (Canada)", "Tizi Ouzou"],
    notableFigures: ["Bâtisseurs de la fontaine Alma Ath Amrane"],
    description: "Famille gardienne de la source haute et des vergers d'oliviers séculaires de la vallée d'Aït Mesbah.",
    tradition: "Arboriculture, oléiculture & maçonnerie de pierre",
  },
  {
    id: "moussa",
    name: "Famille Ait-Moussa",
    quarter: "Aït Moussa",
    diasporaLocations: ["Strasbourg (France)", "Alger", "Londres"],
    notableFigures: ["Artisanes potières du reportage 1939"],
    description: "Lignée renommée pour son savoir-faire dans l'art de la poterie gravée et du vernis naturel à la résine.",
    tradition: "Artisanat de la poterie & façonnage de la terre",
  },
  {
    id: "kaci",
    name: "Famille Ath Kaci & Ath Oumghar",
    quarter: "Tanajelte",
    diasporaLocations: ["Lille (France)", "Québec", "Oran"],
    notableFigures: ["Chouhada de la guerre de libération (1954-1962)"],
    description: "Famille établie sur les hauteurs de Tanajelte, gardienne du mémorial de la Résistance et du panorama sur le Djurdjura.",
    tradition: "Tissage du burnous & préservation du mémorial",
  },
];

export default function FamilyRegistryIndex() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const filteredFamilies = familyNotices.filter((f) => {
    const matchesQuarter = selectedQuarter === "Tous" || f.quarter === selectedQuarter;
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.diasporaLocations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesQuarter && matchesQuery;
  });

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="family-registry-index space-y-8">
      {/* Header */}
      <div className="bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#ffffff15] pb-6">
          <div>
            <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
              👨‍👩‍👧‍👦 Étape 4 · Registre & Diaspora
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
              Le Registre des Lignées Familiales & Liens du Monde
            </h3>
            <p className="text-xs text-[#c8d6d0]">
              Index collaboratif des familles originaires d&apos;Aït Mesbah et carrefour de la diaspora établis en Algérie et dans le monde.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-all shadow-xl flex items-center gap-2"
          >
            <span>📜 Transmettre une notice familiale</span>
          </button>
        </div>

        {/* Search Bar & Quarter Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une famille, un nom, une ville de la diaspora (Paris, Lyon...)..."
              className="w-full bg-[#051d17] border border-[#ffffff20] focus:border-[#e9c982] rounded-full px-5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto">
            {["Tous", "Aït Salah", "Aït Moussa", "Alma Ath Amrane", "Tanajelte"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSelectedQuarter(q)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedQuarter === q
                    ? "bg-[#e9c982] text-[#08281f] font-bold shadow"
                    : "bg-[#0b3329] text-[#c8d6d0] hover:text-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Family Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredFamilies.map((family) => (
            <div
              key={family.id}
              className="bg-[#061f19] border border-[#ffffff15] hover:border-[#d7b56f]/40 p-6 rounded-2xl transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#efd094] uppercase tracking-wider bg-[#103b30] px-3 py-0.5 rounded-full border border-[#ffffff10]">
                    📍 Quartier {family.quarter}
                  </span>
                  <span className="text-[11px] text-[#e9c982] font-semibold">
                    {family.tradition}
                  </span>
                </div>

                <h4 className="font-serif text-2xl font-bold text-white mb-2">{family.name}</h4>
                <p className="text-xs text-[#c8d6d0] leading-relaxed mb-4">
                  {family.description}
                </p>

                {family.notableFigures.length > 0 && (
                  <div className="mb-3 text-xs">
                    <span className="text-[#efd094] font-bold block mb-1">📜 Personnalités & Mémoire :</span>
                    <ul className="list-disc list-inside text-[#c8d6d0] space-y-0.5">
                      {family.notableFigures.map((fig, i) => (
                        <li key={i}>{fig}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#ffffff10] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#efd094] font-medium">
                  🌍 Diaspora : {family.diasporaLocations.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Family Notice Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08281f] border border-[#d7b56f]/50 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-5 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <span className="text-5xl">📜</span>
                <h4 className="font-serif text-2xl font-bold text-[#e9c982]">
                  Tanemmirt ! (Merci !)
                </h4>
                <p className="text-xs text-[#c8d6d0] leading-relaxed">
                  Votre notice familiale a bien été soumise. Elle sera modérée avec bienveillance et ajoutée au registre d&apos;Aït Mesbah.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNotice} className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-3xl">📜</span>
                  <h4 className="font-serif text-2xl font-bold text-[#efd094]">
                    Transmettre une notice familiale
                  </h4>
                  <p className="text-xs text-[#c8d6d0]">
                    Faites connaître votre nom, vos racines au village et les lieux de vie de votre famille dans la diaspora.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Nom de famille / Lignée</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Famille Ait-Amrane"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Quartier d&apos;origine</label>
                  <select className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]">
                    <option value="Aït Salah">Aït Salah</option>
                    <option value="Aït Moussa">Aït Moussa</option>
                    <option value="Alma Ath Amrane">Alma Ath Amrane</option>
                    <option value="Tanajelte">Tanajelte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Lieux d&apos;établissement (Diaspora)</label>
                  <input
                    type="text"
                    placeholder="Ex: Paris, Lyon, Montréal, Alger..."
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Souvenirs ou éléments de mémoire à partager</label>
                  <textarea
                    rows={3}
                    placeholder="Proposez une description, un métier traditionnel ou un récit d'ancêtres..."
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  Soumettre pour validation ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
