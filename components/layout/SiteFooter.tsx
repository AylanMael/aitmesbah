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
          <h2>Découvrir</h2>
          {footerDiscoverLinks.map((item) => (
            <a className="footer-link" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </div>
        <div>
          <h2>Communauté</h2>
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
          <h2>Langue</h2>
          <p><strong>Français</strong>, langue actuellement disponible.</p>
          <p className="footer-language-note">Les versions kabyle et arabe seront proposées lorsqu’elles auront été traduites et relues.</p>
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
        <span lang="fr">FR — version actuelle</span>
      </div>
    </footer>
  );
}
