import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href="/">
          ← Retour à l’accueil
        </Link>
        <p className="legal-kicker">Aït Mesbah</p>
        <h1>{title}</h1>
        <div className="legal-content">{children}</div>
        <p className="legal-updated">Dernière mise à jour : 15 août 2026</p>
      </div>
    </main>
  );
}
