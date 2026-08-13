import { Fragment } from "react";
import Brand from "@/components/layout/Brand";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import HeroSection from "@/components/home/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import VillageIntro from "@/components/home/VillageIntro";
import MemorySection from "@/components/home/MemorySection";
import PlacesSection from "@/components/home/PlacesSection";
import NewsSection from "@/components/home/NewsSection";
import AgendaSection from "@/components/home/AgendaSection";
import ContributionFormClient from "@/components/home/ContributionFormClient";
import { footerCommunityLinks, footerDiscoverLinks } from "@/data/navigation";
import { voiceCategories } from "@/data/home";
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
<section className="voices section-pad"><p className="eyebrow">Paroles d’Aït Mesbah</p><blockquote>« Notre village vit dans les souvenirs de ceux qui sont partis, dans les gestes de ceux qui y restent, et dans les rêves de ceux qui reviendront. »</blockquote><p className="quote-note">Texte éditorial provisoire — à remplacer par un témoignage authentique</p><div className="voice-types">{voiceCategories.map((category,index)=><Fragment key={category}><span>{category}</span>{index<voiceCategories.length-1&&<i/>}</Fragment>)}</div></section>
<section id="diaspora" className="diaspora section-pad"><div className="world">⌁<span>PARIS</span><span>MONTRÉAL</span><span>ALGER</span><span>AILLEURS</span></div><div className="diaspora-copy"><p className="eyebrow light">La communauté sans frontières</p><h2>Aït Mesbah<br/><em>au-delà des montagnes</em></h2><p>De l’Algérie à la France, du Canada à d’autres horizons, la diaspora continue de faire vivre les liens, les souvenirs et les projets du village.</p><div className="diaspora-actions"><a href="#contribuer">Raconter mon parcours →</a><a href="#contribuer">Envoyer une archive →</a></div></div></section>
<section id="contribuer" className="contribution section-pad"><div><p className="eyebrow">Notre mémoire vous appartient</p><h2>Vous avez une photo,<br/>un document, <em>une histoire ?</em></h2><p>Contribuez à enrichir la mémoire collective d’Aït Mesbah. Chaque témoignage sera étudié et valorisé avec soin.</p></div><ContributionFormClient /></section>
<footer><div className="footer-main"><div><Brand/><p>La mémoire d’un village, partagée entre les générations et au-delà des frontières.</p></div><div><h4>Découvrir</h4>{footerDiscoverLinks.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}</div><div><h4>Communauté</h4>{footerCommunityLinks.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}</div><div><h4>Rester en lien</h4><p>Recevez les nouvelles du village.</p><form className="newsletter"><input type="email" placeholder="Votre adresse e-mail"/><button>→</button></form></div></div><div className="footer-bottom"><span>© 2026 Aït Mesbah — Projet communautaire</span><span>Mentions légales · Confidentialité · Crédits</span><span>FR · KAB · ع</span></div></footer></main>}
