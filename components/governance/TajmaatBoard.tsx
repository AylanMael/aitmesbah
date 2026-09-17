"use client";

import { useState } from "react";

export interface TajmaatDeliberation {
  id: string;
  title: string;
  date: string;
  quarter: string;
  status: "Prochaine Tajmaât" | "Résolution adoptée" | "En délibération";
  summary: string;
  decision: string;
}

export interface VillageNews {
  id: string;
  title: string;
  date: string;
  category: "Culture" | "Sport" | "Éco-Village" | "Mémoire";
  summary: string;
}

interface TajmaatBoardProps {
  deliberatives?: TajmaatDeliberation[];
  newsArticles?: VillageNews[];
}

export default function TajmaatBoard({ deliberatives = [], newsArticles = [] }: TajmaatBoardProps) {
  const [activeTab, setActiveTab] = useState<"deliberations" | "gazette">("deliberations");
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [topicSubmitted, setTopicSubmitted] = useState<boolean>(false);

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTopicSubmitted(true);
    setTimeout(() => {
      setShowTopicModal(false);
      setTopicSubmitted(false);
    }, 2500);
  };

  return (
    <div className="tajmaat-board space-y-8">
      {/* Container */}
      <div className="bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#ffffff15] pb-6">
          <div>
            <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
              📢 Tajmaât & Gazette
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
              Le Panneau d&apos;Affichage Numérique de Tajmaât
            </h3>
            <p className="text-xs text-[#c8d6d0]">
              Ordres du jour de l&apos;Assemblée des délégués et informations validées du village.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTopicModal(true)}
              className="px-5 py-2.5 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-all shadow-lg flex items-center gap-2"
            >
              <span>✍️ Proposer un sujet à Tajmaât</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#ffffff15] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("deliberations")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === "deliberations"
                ? "bg-[#e9c982] text-[#08281f] shadow-md"
                : "bg-[#051d17] text-[#c8d6d0] hover:text-white"
            }`}
          >
            📜 Ordre du Jour & Délibérations ({deliberatives.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gazette")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === "gazette"
                ? "bg-[#e9c982] text-[#08281f] shadow-md"
                : "bg-[#051d17] text-[#c8d6d0] hover:text-white"
            }`}
          >
            📰 Gazette du Terroir ({newsArticles.length})
          </button>
        </div>

        {/* Deliberations Tab Content */}
        {activeTab === "deliberations" && (
          deliberatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deliberatives.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#061f19] border border-[#ffffff15] hover:border-[#d7b56f]/40 p-6 rounded-2xl transition-all space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        item.status === "Prochaine Tajmaât"
                          ? "bg-[#aa593c] text-white"
                          : item.status === "Résolution adoptée"
                          ? "bg-[#1f5e42] text-[#a4f3ce]"
                          : "bg-[#103b30] text-[#efd094]"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[11px] text-[#efd094]">
                        📅 {item.date}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-[#c8d6d0] leading-relaxed mb-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#ffffff10] text-xs">
                    <span className="text-[#e9c982] font-bold block mb-0.5">Note :</span>
                    <p className="text-[#dbe5e0] italic">{item.decision}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#061f19] border border-[#ffffff15] p-8 rounded-2xl text-center space-y-3">
              <span className="text-4xl">🏛️</span>
              <h4 className="font-serif text-xl font-bold text-white">
                Aucune délibération affichée
              </h4>
              <p className="text-xs text-[#c8d6d0] max-w-md mx-auto leading-relaxed">
                Les ordres du jour officiels et délibérations de l&apos;Assemblée des délégués d&apos;Aït Mesbah seront publiés ici dès qu&apos;ils auront été transmis et validés.
              </p>
            </div>
          )
        )}

        {/* Gazette Tab Content */}
        {activeTab === "gazette" && (
          newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-[#061f19] border border-[#ffffff15] hover:border-[#e9c982] p-6 rounded-2xl transition-all space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#efd094] uppercase tracking-wider bg-[#103b30] px-3 py-0.5 rounded-full border border-[#ffffff10]">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-[#c8d6d0]">
                      {art.date}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-white">{art.title}</h4>
                  <p className="text-xs text-[#c8d6d0] leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#061f19] border border-[#ffffff15] p-8 rounded-2xl text-center space-y-3">
              <span className="text-4xl">📰</span>
              <h4 className="font-serif text-xl font-bold text-white">
                Aucune actualité publiée
              </h4>
              <p className="text-xs text-[#c8d6d0] max-w-md mx-auto leading-relaxed">
                La gazette accueillera les annonces d&apos;événements culturels, sportifs et associatifs du village après validation.
              </p>
            </div>
          )
        )}
      </div>

      {/* Propose Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08281f] border border-[#d7b56f]/50 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-5 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowTopicModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {topicSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <span className="text-5xl">📢</span>
                <h4 className="font-serif text-2xl font-bold text-[#e9c982]">
                  Tanemmirt ! (Merci !)
                </h4>
                <p className="text-xs text-[#c8d6d0] leading-relaxed">
                  Votre proposition a bien été soumise pour examen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTopicSubmit} className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-3xl">📢</span>
                  <h4 className="font-serif text-2xl font-bold text-[#efd094]">
                    Proposer un sujet à Tajmaât
                  </h4>
                  <p className="text-xs text-[#c8d6d0]">
                    Soumettez un sujet d&apos;intérêt collectif pour les délibérations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Nom / Quartier (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Votre nom ou quartier"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Titre de la proposition</label>
                  <input
                    type="text"
                    required
                    placeholder="Titre du sujet"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Explication</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Décrivez brièvement le sujet..."
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  Transmettre la proposition ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
