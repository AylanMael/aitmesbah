"use client";

import { useState } from "react";
import Image from "next/image";
import { villageTours, type VillageTour, type TourStep } from "@/data/village-tours";

export default function VillageTourGuide() {
  const [activeTourIndex, setActiveTourIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const activeTour: VillageTour = villageTours[activeTourIndex] || villageTours[0];
  const activeStep: TourStep = activeTour.steps[activeStepIndex] || activeTour.steps[0];

  const handleSelectTour = (index: number) => {
    setActiveTourIndex(index);
    setActiveStepIndex(0);
    setIsPlayingAudio(false);
  };

  const handleNextStep = () => {
    if (activeStepIndex < activeTour.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
      setIsPlayingAudio(false);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="village-tour-guide space-y-8">
      {/* Tour Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {villageTours.map((tour, idx) => {
          const isSelected = activeTourIndex === idx;
          return (
            <button
              key={tour.id}
              type="button"
              onClick={() => handleSelectTour(idx)}
              className={`relative text-left p-6 rounded-2xl transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? "bg-[#08281f] text-white border-[#e9c982] shadow-2xl scale-[1.02]"
                  : "bg-[#0a231c]/60 text-[#c8d6d0] border-[#ffffff15] hover:border-[#efd094]/50 hover:bg-[#08281f]/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{tour.icon}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: tour.color }}
                  >
                    {tour.difficulty}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-1">{tour.title}</h3>
                <p className="text-xs text-[#efd094] mb-3">{tour.subtitle}</p>
                <p className="text-xs text-[#b6c3bd] line-clamp-2 leading-relaxed">{tour.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ffffff15] flex items-center justify-between text-xs text-[#efd094]">
                <span>📏 {tour.distance}</span>
                <span>⏱️ {tour.duration}</span>
                <span>{tour.steps.length} étapes ➔</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Tour Explorer Frame */}
      <div className="bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#061f19] via-[#0b352a] to-[#124235] border-b border-[#ffffff1c] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#aa593c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {activeTour.badge}
              </span>
              <span className="text-xs text-[#efd094] font-medium">{activeTour.theme}</span>
            </div>
            <h2 className="font-serif text-3xl text-white font-bold">{activeTour.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 bg-[#103b30] hover:bg-[#164a3a] text-[#efd094] border border-[#d7b56f]/40 text-xs font-bold rounded-full transition-colors flex items-center gap-2"
            >
              <span>📲 Flasher sur place au village</span>
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeStep.coordinates.lat},${activeStep.coordinates.lon}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>📍 Lancer dans Google Maps ↗</span>
            </a>
          </div>
        </div>

        {/* Step-by-Step Navigation Bar */}
        <div className="flex items-center justify-between bg-[#051d17] px-6 py-3 border-b border-[#ffffff15]">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs text-[#efd094] font-bold uppercase tracking-wider mr-2">
              Étapes du circuit :
            </span>
            {activeTour.steps.map((step, idx) => {
              const isCurrentStep = activeStepIndex === idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                    isCurrentStep
                      ? "bg-[#e9c982] text-[#08281f] font-bold shadow scale-105"
                      : "bg-[#0b3027] text-[#c8d6d0] hover:text-white"
                  }`}
                >
                  {step.number}. {step.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className="px-3 py-1 bg-[#103b30] disabled:opacity-30 text-white rounded-full text-xs font-bold transition-opacity"
            >
              ← Précédent
            </button>
            <span className="text-xs text-[#efd094] font-mono font-bold">
              {activeStepIndex + 1}/{activeTour.steps.length}
            </span>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStepIndex === activeTour.steps.length - 1}
              className="px-3 py-1 bg-[#103b30] disabled:opacity-30 text-white rounded-full text-xs font-bold transition-opacity"
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* Step Detail Content & Satellite Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Step Card Content */}
          <div className="lg:col-span-6 p-6 md:p-8 space-y-6 flex flex-col justify-between border-r border-[#ffffff18]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl font-serif font-bold text-[#e9c982]">
                  Étape {activeStep.number}
                </span>
                <span className="bg-[#103b30] text-[#efd094] border border-[#d7b56f]/30 text-xs px-3 py-1 rounded-full font-bold">
                  📍 Quartier {activeStep.quarter}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-1">{activeStep.title}</h3>
              <p className="text-xs text-[#efd094] font-semibold mb-4">{activeStep.locationName}</p>

              <p className="text-sm text-[#c8d6d0] leading-relaxed text-justify mb-4">
                {activeStep.description}
              </p>

              {activeStep.anecdote && (
                <div className="p-4 rounded-xl bg-[#0b3329] border-l-4 border-l-[#e9c982] text-xs text-[#dbe5e0] space-y-1">
                  <span className="font-bold text-[#efd094] uppercase tracking-wider block">
                    💡 Mémoire & Anecdote du lieu :
                  </span>
                  <p className="italic leading-relaxed">{activeStep.anecdote}</p>
                </div>
              )}
            </div>

            {/* Audio Guide & GPS Bar */}
            <div className="pt-4 border-t border-[#ffffff1c] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio((prev) => !prev)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  isPlayingAudio
                    ? "bg-[#aa593c] text-white animate-pulse"
                    : "bg-[#103b30] hover:bg-[#164a3a] text-[#efd094] border border-[#d7b56f]/40"
                }`}
              >
                <span>{isPlayingAudio ? "⏸️ Pause Audio Guide" : "🎧 Écouter le récit de l'étape"}</span>
              </button>

              <span className="text-xs font-mono text-[#efd094]">
                GPS : {activeStep.coordinates.lat.toFixed(4)}° N, {activeStep.coordinates.lon.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Right Column: Step Satellite HD View */}
          <div className="lg:col-span-6 relative min-h-[420px] bg-[#061f19]">
            <iframe
              title={`Vue Satellite HD de l'étape ${activeStep.title}`}
              src={`https://maps.google.com/maps?q=${activeStep.coordinates.lat},${activeStep.coordinates.lon}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[420px] border-0 filter brightness-95 contrast-105"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-[#08221be6] border border-[#d7b56f]/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-[#efd094] font-bold shadow-xl">
              🛰️ Repère Satellite HD : Étape {activeStep.number}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for On-Site Visitors */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08281f] border border-[#d7b56f]/50 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 text-white shadow-2xl">
            <span className="text-3xl">📲</span>
            <h4 className="font-serif text-xl font-bold text-[#efd094]">
              Visite sur place au village
            </h4>
            <p className="text-xs text-[#c8d6d0] leading-relaxed">
              Flashez ce QR Code ou accédez à l&apos;URL ci-dessous depuis votre smartphone lors de votre déambulation à Aït Mesbah.
            </p>
            <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
              {/* QR Code SVG Placeholder */}
              <svg viewBox="0 0 100 100" className="w-40 h-40 fill-black">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />
                <rect x="60" y="10" width="30" height="30" fill="black" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="black" />
                <rect x="10" y="60" width="30" height="30" fill="black" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="black" />
                <rect x="50" y="50" width="10" height="10" fill="black" />
                <rect x="70" y="70" width="20" height="20" fill="black" />
              </svg>
            </div>
            <p className="text-[11px] font-mono text-[#efd094]">
              ait-mesbah.org/decouvrir#{activeTour.slug}
            </p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
