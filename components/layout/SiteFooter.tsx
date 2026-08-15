import Brand from "@/components/layout/Brand";
import Link from "next/link";
import {
  footerCommunityLinks,
  footerDiscoverLinks,
} from "@/data/navigation";

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            La mémoire d’un village, partagée entre les générations et au-delà
            des frontières.
          </p>
        </div>
        <div>
          <h4>Découvrir</h4>
          {footerDiscoverLinks.map((item) => (
            <a className="footer-link" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </div>
        <div>
          <h4>Communauté</h4>
          {footerCommunityLinks.map((item) =>
            item.href ? (
              <a className="footer-link" href={item.href} key={item.label}>
                {item.label}
              </a>
            ) : (
              <span className="footer-link unavailable" key={item.label}>
                {item.label}
              </span>
            ),
          )}
        </div>
        <div>
          <h4>Rester en lien</h4>
          <p>La lettre du village sera bientôt disponible.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Aït Mesbah — Projet communautaire</span>
        <nav className="footer-legal" aria-label="Pages légales">
          <Link href="/mentions-legales">Mentions légales</Link>
          <span aria-hidden="true">·</span>
          <Link href="/confidentialite">Confidentialité</Link>
          <span aria-hidden="true">·</span>
          <Link href="/credits">Crédits</Link>
        </nav>
        <span>FR · KAB · ع</span>
      </div>
    </footer>
  );
}
