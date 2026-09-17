"use client";

import { useState } from "react";

interface TajmaatDeliberation {
  id: string;
  title: string;
  date: string;
  quarter: string;
  status: "Prochaine Tajmaât" | "Résolution adoptée" | "En délibération";
  summary: string;
  decision: string;
}

interface VillageNews {
  id: string;
  title: string;
  date: string;
  category: "Culture" | "Sport" | "Éco-Village" | "Mémoire";
  summary: string;
}

const deliberatives: TajmaatDeliberation[] = [
  {
    id: "1",
    title: "Validation de la charte de propreté et de tri des déchets au village",
    date: "15 Octobre 2026",
    quarter: "Tous les quartiers",
    status: "Prochaine Tajmaât",
    summary: "Fixation des jours de collecte collective et mise en place de bacs séparés près de Tajmaât d'Aït Salah.",
    decision: "Ordre du jour prioritaire de l'assemblée d'Automne",
  },
  {
    id: "2",
    title: "Restauration du canal d'adduction de la fontaine Bouagala",
    date: "12 Septembre 2026",
    quarter: "Aït Moussa",
    status: "Résolution adoptée",
    summary: "Approbation du budget participatif Tiwizi et désignation des maîtres-maçons du village.",
    decision: "Adoptée à l'unanimité des 15 délégués de famille",
  },
  {
    id: "3",
    title: "Organisation de la commémoration d'Amar Imache (Février 2027)",
    date: "05 Septembre 2026",
    quarter: "Aït Salah",
    status: "En délibération",
    summary: "Coordination avec l'Association Culturelle Imache Amar pour le programme d'expositions et de conférences.",
    decision: "Comité de pilotage en cours de constitution",
  },
];

const newsArticles: VillageNews[] = [
  {
    id: "news-1",
    title: "L'ASAM Aït Mesbah s'impose en finale de coupe régionale 2026",
    date: "14 Septembre 2026",
    category: "Sport",
    summary: "Ferveur au village après la brillante victoire de l'équipe de football devant une foule enthousiaste de supporters venus de toute la commune.",
  },
  {
    id: "news-2",
    title: "Succès des ateliers de poterie pour les jeunes au JCAM",
    date: "28 Août 2026",
    category: "Culture",
    summary: "Plus de 40 jeunes filles et garçons ont participé à la transmission des gestes anciens de modelage de la terre d'Aït Mesbah.",
  },
  {
    id: "news-3",
    title: "Lancement de la Gazette Écologique de la saison des olives",
    date: "10 Août 2026",
    category: "Éco-Village",
    summary: "Préparation des moulins traditionnels et calendrier des cueillettes partagées dans les vergers de la vallée.",
  },
];

export default function TajmaatBoard() {
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
              📢 Étape 5 · Tajmaât & Gazette
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
              Le Panneau d&apos;Affichage Numérique de Tajmaât
            </h3>
            <p className="text-xs text-[#c8d6d0]">
              Ordres du jour de l&apos;Assemblée des délégués, résolutions communautaires et actualités du terroir.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTopicModal(true)}
              className="px-5 py-2.5 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-all shadow-lg flex items-center gap-2"
            >
              <span>✍️ Proposer un point à Tajmaât</span>
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
                  <span className="text-[#e9c982] font-bold block mb-0.5">Décision :</span>
                  <p className="text-[#dbe5e0] italic">{item.decision}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gazette Tab Content */}
        {activeTab === "gazette" && (
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
                  Votre proposition d&apos;ordre du jour a été soumise au bureau de Tajmaât pour la prochaine réunion de quartier.
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
                    Soumettez un sujet d&apos;intérêt collectif pour les délibérations des délégués du village.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Votre Nom & Quartier</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rezki Ait-Moussa (Aït Moussa)"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Titre du sujet</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Entretien du sentier des oliviers vers Tanajelte"
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#efd094] font-semibold mb-1">Explication & Proposition de solution</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Décrivez le besoin et ce qui est suggéré pour l'action commune..."
                    className="w-full bg-[#051d17] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e9c982]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#aa593c] hover:bg-[#ab4a2f] text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  Transmettre à la Tajmaât ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
