import Brand from "@/components/layout/Brand";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import HeroSection from "@/components/home/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import VillageIntro from "@/components/home/VillageIntro";
import MemorySection from "@/components/home/MemorySection";
import PlacesSection from "@/components/home/PlacesSection";
import NewsSection from "@/components/home/NewsSection";
import AgendaSection from "@/components/home/AgendaSection";
import VoicesSection from "@/components/home/VoicesSection";
import DiasporaSection from "@/components/home/DiasporaSection";
import ContributionFormClient from "@/components/home/ContributionFormClient";
import { footerCommunityLinks, footerDiscoverLinks } from "@/data/navigation";
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
<section id="contribuer" className="contribution section-pad"><div><p className="eyebrow">Notre mémoire vous appartient</p><h2>Vous avez une photo,<br/>un document, <em>une histoire ?</em></h2><p>Contribuez à enrichir la mémoire collective d’Aït Mesbah. Chaque témoignage sera étudié et valorisé avec soin.</p></div><ContributionFormClient /></section>
<footer><div className="footer-main"><div><Brand/><p>La mémoire d’un village, partagée entre les générations et au-delà des frontières.</p></div><div><h4>Découvrir</h4>{footerDiscoverLinks.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}</div><div><h4>Communauté</h4>{footerCommunityLinks.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}</div><div><h4>Rester en lien</h4><p>Recevez les nouvelles du village.</p><form className="newsletter"><input type="email" placeholder="Votre adresse e-mail"/><button>→</button></form></div></div><div className="footer-bottom"><span>© 2026 Aït Mesbah — Projet communautaire</span><span>Mentions légales · Confidentialité · Crédits</span><span>FR · KAB · ع</span></div></footer></main>}
