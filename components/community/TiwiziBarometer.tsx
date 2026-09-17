"use client";

import { useState } from "react";

interface TiwiziAction {
  id: string;
  title: string;
  category: "Environnement" | "Patrimoine" | "Solidarité" | "Jeunesse";
  date: string;
  participants: number;
  impact: string;
  status: "Réalisé" | "En cours" | "Planifié";
}

const recentActions: TiwiziAction[] = [
  {
    id: "1",
    title: "Nettoyage et aménagement des abords d'Alma Ath Amrane",
    category: "Environnement",
    date: "Mai 2026",
    participants: 34,
    impact: "Désherbage, curage du bassin et pose d'assises en pierre",
    status: "Réalisé",
  },
  {
    id: "2",
    title: "Reconstitution du muret traditionnel d'Aït Salah",
    category: "Patrimoine",
    date: "Février 2026",
    participants: 18,
    impact: "Restauration à la chaux et pierres assises avec les maçons du village",
    status: "Réalisé",
  },
  {
    id: "3",
    title: "Campagne de reboisement des collines de Tanajelte",
    category: "Environnement",
    date: "Novembre 2025",
    participants: 52,
    impact: "120 oliviers et figuiers plantés avec les jeunes du JCAM",
    status: "Réalisé",
  },
  {
    id: "4",
    title: "Renforcement de l'éclairage éco-solaire des ruelles",
    category: "Solidarité",
    date: "Automne 2026",
    participants: 12,
    impact: "Installation de 15 points solaires dans les passages isolés",
    status: "En cours",
  },
];

export default function TiwiziBarometer() {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [showPledgeModal, setShowPledgeModal] = useState<boolean>(false);
  const [pledgeSubmitted, setPledgeSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", role: "Habitant", contribution: "", availability: "Week-ends" });

  const filteredActions = activeCategory === "Tous" 
    ? recentActions 
    : recentActions.filter(a => a.category === activeCategory);

  const handleSubmitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    setPledgeSubmitted(true);
    setTimeout(() => {
      setShowPledgeModal(false);
      setPledgeSubmitted(false);
      setFormData({ name: "", role: "Habitant", contribution: "", availability: "Week-ends" });
    }, 2500);
  };

  return (
    <div className="tiwizi-barometer space-y-8">
      {/* Dynamic Key Performance Indicators (Baromètre Impact) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#08281f] border border-[#d7b56f]/30 p-5 rounded-2xl text-center space-y-1 shadow-xl">
          <span className="text-3xl">🌿</span>
          <p className="font-serif text-3xl font-bold text-[#e9c982]">14</p>
          <p className="text-xs text-[#c8d6d0]">Projets Tiwizi accomplis</p>
        </div>
        <div className="bg-[#08281f] border border-[#d7b56f]/30 p-5 rounded-2xl text-center space-y-1 shadow-xl">
          <span className="text-3xl">🌳</span>
          <p className="font-serif text-3xl font-bold text-[#e9c982]">250+</p>
          <p className="text-xs text-[#c8d6d0]">Arbres & oliviers plantés</p>
        </div>
        <div className="bg-[#08281f] border border-[#d7b56f]/30 p-5 rounded-2xl text-center space-y-1 shadow-xl">
          <span className="text-3xl">⛲</span>
          <p className="font-serif text-3xl font-bold text-[#e9c982]">4</p>
          <p className="text-xs text-[#c8d6d0]">Fontaines entretenues</p>
        </div>
        <div className="bg-[#08281f] border border-[#d7b56f]/30 p-5 rounded-2xl text-center space-y-1 shadow-xl">
          <span className="text-3xl">🤝</span>
          <p className="font-serif text-3xl font-bold text-[#e9c982]">1 200h</p>
          <p className="text-xs text-[#c8d6d0]">Heures de bénévolat partagées</p>
        </div>
      </div>

      {/* Main Barometer Container */}
      <div className="bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#ffffff15] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Tradition & Solidarité
              </span>
              <span className="text-xs text-[#efd094] font-medium">Esprit Tiwizi</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
              Le Journal des Actions & Engagements Éco-Village
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowPledgeModal(true)}
            className="px-6 py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-full transition-all duration-300 shadow-xl scale-105 flex items-center gap-2"
          >
            <span>🤝 Rejoindre l&apos;effort Tiwizi (Prendre un engagement)</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["Tous", "Environnement", "Patrimoine", "Solidarité", "Jeunesse"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#e9c982] text-[#08281f] font-bold shadow-md"
                  : "bg-[#0b3329] text-[#c8d6d0] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActions.map((action) => (
            <div
              key={action.id}
              className="bg-[#061f19] border border-[#ffffff15] hover:border-[#d7b56f]/40 p-5 rounded-2xl transition-all duration-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#efd094] bg-[#103b30] px-3 py-1 rounded-full border border-[#ffffff10]">
                  {action.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  action.status === "Réalisé" ? "bg-[#1f5e42] text-[#a4f3ce]" : "bg-[#aa593c] text-white"
                }`}>
                  {action.status}
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-white">{action.title}</h4>
              <p className="text-xs text-[#c8d6d0] leading-relaxed">{action.impact}</p>

              <div className="pt-3 border-t border-[#ffffff10] flex items-center justify-between text-xs text-[#efd094]">
                <span>📅 {action.date}</span>
                <span>👥 {action.participants} volontaires</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement / Pledge Modal */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08281f] border border-[#d7b56f]/50 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-5 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowPledgeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {pledgeSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <span className="text-5xl">✨</span>
                <h4 className="font-serif text-2xl font-bold text-[#e9c982]">
                  Tanemmirt ! (Merci !)
                </h4>
                <p className="text-xs text-[#c8d6d0] leading-relaxed">
                  Votre engagement a bien été enregistré. Le comité d&apos;action Tiwizi vous recontactera très rapidement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPledge} className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-3xl">🤝</span>
                  <h4 className="font-serif text-2xl font-bold text-[#efd094]">
                    Rejoindre l&apos;effort Tiwizi
                  </h4>
                  <p className="text-xs text-[#c8d6d0]">
                    Qu&apos;il s&apos;agisse de temps, d&apos;outils ou de compétences, chaque geste fortifie Aït Mesbah.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Nom / Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Jugurtha Ait-Amrane"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Votre relation au village</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  >
                    <option value="Habitant">Habitant du village</option>
                    <option value="Diaspora">Membre de la diaspora</option>
                    <option value="Ami">Ami / Sympathisant du village</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Comment souhaitez-vous aider ?</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.contribution}
                    onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                    placeholder="Ex: Participation aux travaux de maçonnerie, apport d'outils, aide au reboisement..."
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  Envoyer mon engagement Tiwizi ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
