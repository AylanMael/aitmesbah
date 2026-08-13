import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/home/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import VillageIntro from "@/components/home/VillageIntro";
import MemorySection from "@/components/home/MemorySection";
import PlacesSection from "@/components/home/PlacesSection";
import NewsSection from "@/components/home/NewsSection";
import AgendaSection from "@/components/home/AgendaSection";
import VoicesSection from "@/components/home/VoicesSection";
import DiasporaSection from "@/components/home/DiasporaSection";
import ContributionSection from "@/components/home/ContributionSection";
export default function Home(){return <main>
<SiteHeaderClient />
<HeroSection />
<QuickLinks />
<div className="word-river" aria-hidden="true"><div>TERRE <i>✦</i> TRANSMISSION <i>✦</i> VILLAGE <i>✦</i> MÉMOIRE <i>✦</i> SOLIDARITÉ <i>✦</i> AVENIR <i>✦</i></div></div>
<VillageIntro />
<MemorySection />
<PlacesSection />
<NewsSection />
<AgendaSection />
<VoicesSection />
<DiasporaSection />
<ContributionSection />
<SiteFooter />
</main>}
