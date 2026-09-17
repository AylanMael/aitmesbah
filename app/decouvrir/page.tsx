import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import ShareDiscovery from "@/components/public/ShareDiscovery";
import VillageTourGuide from "@/components/discovery/VillageTourGuide";
import "./parcours.css";

export const metadata: Metadata = {
  title: "Aït Mesbah en cinq minutes & Carnet du Voyageur — Circuits de Visite",
  description: "Un parcours en cinq étapes et trois circuits thématiques géo-guidés pour découvrir le village d'Aït Mesbah, sa mémoire et ses paysages.",
  alternates: { canonical: "/decouvrir" },
  openGraph: {
    title: "Aït Mesbah en cinq minutes & Circuits de Visite",
    description: "Explorer les lieux, la mémoire et les circuits thématiques d'Aït Mesbah.",
    url: "/decouvrir",
    siteName: "Aït Mesbah",
    locale: "fr_DZ",
    type: "website",
    images: [{ url: "/ait-mesbah-village.jpg", alt: "Vue du village d’Aït Mesbah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aït Mesbah — Circuits de Visite & Découverte",
    description: "Le Carnet du Voyageur et les circuits patrimoniaux d'Aït Mesbah.",
    images: ["/ait-mesbah-village.jpg"],
  },
};

const photoDimensions: Record<string, { width: number; height: number }> = {
  lieux: { width: 720, height: 540 },
  memoire: { width: 312, height: 472 },
  gestes: { width: 910, height: 950 },
  present: { width: 958, height: 540 },
  participer: { width: 2048, height: 1536 },
};

const steps = [
  { id: "lieux", label: "Un territoire", title: "D’abord, situer le village", text: "Aït Mesbah se trouve en Kabylie, dans la commune d’Ath Douala, au sein de la wilaya de Tizi Ouzou. Pour qui y revient ou le découvre de loin, ses reliefs, ses chemins et ses quartiers sont les premiers repères d’une histoire commune.", image: "/ait-mesbah-village.jpg", alt: "Vue des habitations d’Aït Mesbah", caption: "Le village et ses reliefs", href: "/village", action: "Explorer les lieux" },
  { id: "memoire", label: "Une mémoire", title: "Relier les générations", text: "L’histoire du village se découvre à travers des documents, des photographies et des témoignages. Le parcours d’Amar Imache, la guerre d’indépendance et les migrations y occupent une place. La chronologie distingue les faits documentés des mémoires locales qui restent à recouper.", image: "/images/amar-imache/portrait-ancien.jpg", alt: "Portrait ancien d’Amar Imache", caption: "Amar Imache · Portrait présenté dans le dossier historique", href: "/histoire-memoire", action: "Parcourir l’histoire" },
  { id: "gestes", label: "Des savoir-faire", title: "La mémoire passe aussi par les mains", text: "La poterie, la couture de robes kabyles et le tissage ouvrent une autre porte sur Aït Mesbah. Les pages métiers réunissent des gestes, des objets et des pistes documentaires. Le reportage photographique de 1939 offre notamment un regard ancien sur le travail de la poterie au village.", image: "/archives/poterie-1939/14.jpg", alt: "Photographie ancienne du décor d’une poterie", caption: "Décor d’une poterie, 1939 · Thérèse Rivière · Musée du quai Branly – Jacques Chirac, PP0193025", href: "/artisanat", action: "Rencontrer les savoir-faire" },
  { id: "present", label: "Une vie collective", title: "Un village qui se construit au présent", text: "Le comité de village, le football, le judo et l’association culturelle composent autant d’espaces où se rencontrer et transmettre. Leurs pages présentent leurs parcours, leurs activités et les besoins exprimés pour la jeunesse et la vie commune.", image: "/images/jcam-jeunes-taqaats.jpg", alt: "Groupe de jeunes judokas réunis dans la salle Taqaats", caption: "Les jeunes du JCAM à la salle Taqaats", href: "/vivre", action: "Découvrir la vie du village" },
  { id: "participer", label: "Un lien à faire vivre", title: "D’ici ou d’ailleurs, faire sa part", text: "On peut vivre loin et rester proche. Une photographie à identifier, un souvenir à transmettre, une compétence ou un peu de temps peuvent être utiles. Chacun peut proposer une contribution ; les contenus sont examinés avant leur publication.", image: "/images/asam-2026-finaliste.jpg", alt: "L’équipe de l’ASAM réunie devant ses supporters", caption: "ASAM · L’équipe finaliste en 2026", href: "/contribuer", action: "Proposer me contribution" },
];

export default function DiscoveryPage() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
      <SiteHeaderClient />
      <main id="contenu-principal" className="discovery-journey">
        <header className="journey-intro">
          <p className="journey-label">Un premier regard · Cinq étapes & Circuits</p>
          <h1>Aït Mesbah<br /><em>en cinq minutes & Carnet de visite</em></h1>
          <p>Pour découvrir le village, parcourir ses sentiers géo-guidés ou partager son histoire avec les générations futures.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="#circuits-visite" className="px-6 py-3 bg-[#aa593c] text-white font-bold rounded-full shadow-lg hover:bg-[#8b432a] transition-all">
              🗺️ Carnet du Voyageur (Circuits Géo-guidés)
            </a>
            <a href="#lieux" className="px-6 py-3 bg-[#103b30] text-[#efd094] font-bold rounded-full border border-[#d7b56f]/40 hover:bg-[#175042] transition-all">
              📜 Découvrir en 5 minutes ↓
            </a>
          </div>
        </header>

        {/* SECTION CARNET DU VOYAGEUR & CIRCUITS DE VISITE */}
        <section id="circuits-visite" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
          <div className="text-center mb-10 space-y-3">
            <span className="bg-[#e9c982] text-[#08281f] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              📍 Étape 1 · Carnet du Voyageur
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Circuits de Visite & Déambulations Patrimoniales
            </h2>
            <p className="text-sm md:text-base text-[#c8d6d0] max-w-2xl mx-auto leading-relaxed">
              Sélectionnez un circuit géo-guidé pour explorer les quartiers d’Aït Mesbah, ses fontaines sacrées et ses haut-lieux de mémoire.
            </p>
          </div>

          <VillageTourGuide />
        </section>

        {/* PARCOURS TRADITIONNEL EN 5 ETAPES */}
        <nav className="journey-nav" aria-label="Les cinq étapes">
          <ol>
            {steps.map((step, index) => (
              <li key={step.id}>
                <a href={`#${step.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{step.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="journey-stages">
          {steps.map((step, index) => (
            <section key={step.id} id={step.id} aria-labelledby={`titre-${step.id}`} className="journey-stage">
              <figure>
                <Image src={step.image} alt={step.alt} width={photoDimensions[step.id].width} height={photoDimensions[step.id].height} loading="lazy" sizes="(max-width: 760px) calc(100vw - 44px), 470px" />
                <figcaption>{step.caption}</figcaption>
              </figure>
              <div>
                <p className="journey-label">{String(index + 1).padStart(2, "0")} / 05 · {step.label}</p>
                <h2 id={`titre-${step.id}`}>{step.title}</h2>
                <p>{step.text}</p>
                <Link href={step.href}>{step.action} <span aria-hidden="true">↗</span></Link>
                <div className="journey-next">
                  <a href={index < steps.length - 1 ? `#${steps[index + 1].id}` : "#continuer"}>
                    {index < steps.length - 1 ? `Étape suivante : ${steps[index + 1].label.toLowerCase()}` : "Terminer le parcours"}
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section id="continuer" className="journey-ending">
          <p className="journey-label">La découverte continue</p>
          <h2>Une terre commune,<br />des liens sans frontières.</h2>
          <p>Ce premier regard n’épuise pas l’histoire du village. Prenez le temps d’explorer les archives, de lire un récit ou de découvrir une initiative.</p>
          <Link href="/diaspora">Retrouver les liens de la diaspora →</Link>
          <Link href="/agir">Découvrir « Agir ensemble » →</Link>
        </section>

        <ShareDiscovery />
      </main>
      <SiteFooter />
    </>
  );
}

