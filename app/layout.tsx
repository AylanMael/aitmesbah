import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Aït Mesbah — Village & Mémoire", description: "Découvrez Aït Mesbah, son identité, sa mémoire, son patrimoine et la vie de sa communauté en Haute Kabylie et à travers le monde.", keywords: ["Aït Mesbah", "village Aït Mesbah", "Aït Mesbah Kabylie", "patrimoine kabyle", "Haute Kabylie"], openGraph: { title: "Aït Mesbah — Village & Mémoire", description: "Un village, une mémoire, un avenir.", type: "website", locale: "fr_FR" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
