import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/home/HeroSection";
import VillageIntro from "@/components/home/VillageIntro";
import MemorySection from "@/components/home/MemorySection";
import VillageLifeSection from "@/components/home/VillageLifeSection";
import VillageAliveSection from "@/components/home/VillageAliveSection";
import DiasporaSection from "@/components/home/DiasporaSection";
import ContributionSection from "@/components/home/ContributionSection";
import QuickLinks from "@/components/home/QuickLinks";
import VillageFutureSection from "@/components/home/VillageFutureSection";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">
        Aller au contenu principal
      </a>
      <SiteHeaderClient />
      <main id="contenu-principal" tabIndex={-1}>
        <HeroSection />
        <div className="word-river" aria-hidden="true">
          <div>
            TRANSMISSION <i>✦</i> VILLAGE <i>✦</i> MÉMOIRE <i>✦</i> SOLIDARITÉ <i>✦</i>
          </div>
        </div>
        <VillageIntro />
        <MemorySection />
        <VillageLifeSection />
        <VillageAliveSection />
        <VillageFutureSection />
        <DiasporaSection />
        <ContributionSection />
      </main>
      <SiteFooter />
    </>
  );
}
