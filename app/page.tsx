import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/home/HeroSection";
import VillageIntro from "@/components/home/VillageIntro";
import CraftSection from "@/components/home/CraftSection";
import MemorySection from "@/components/home/MemorySection";
import VillageLifeSection from "@/components/home/VillageLifeSection";
import VillageAliveSection from "@/components/home/VillageAliveSection";
import DiasporaSection from "@/components/home/DiasporaSection";
import ContributionSection from "@/components/home/ContributionSection";
import QuickLinks from "@/components/home/QuickLinks";
import VillageFutureSection from "@/components/home/VillageFutureSection";
import HomeEditorialPulse from "@/components/home/HomeEditorialPulse";
import { loadPublicContents } from "@/lib/public-contents-server";
import { loadPublicEvents } from "@/lib/public-events-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [contents, events] = await Promise.all([loadPublicContents(), loadPublicEvents()]);
  const now = Date.now(), nextEvent = events.filter(event => event.status !== "cancelled" && new Date(event.endsAt ?? event.startsAt).getTime() >= now)[0] ?? null;
  const publications = contents.filter(item => item.kind !== "news").slice(0, 3), initiatives = contents.filter(item => item.kind === "news").slice(0, 3);
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
        <CraftSection />
        <MemorySection />
        <VillageLifeSection />
        <VillageAliveSection />
        <HomeEditorialPulse publications={publications} event={nextEvent} initiatives={initiatives} />
        <VillageFutureSection />
        <DiasporaSection />
        <ContributionSection />
      </main>
      <SiteFooter />
    </>
  );
}
