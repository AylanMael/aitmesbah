import type { Metadata } from "next";
import "./globals.css";
import "./public.css";

const title = "Aït Mesbah — Village & Mémoire";
const description =
  "Découvrez Aït Mesbah, son identité et son projet communautaire de préservation de la mémoire du village, en Haute Kabylie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ait-mesbah.com"),
  title,
  description,
  keywords: [
    "Aït Mesbah",
    "village Aït Mesbah",
    "Aït Mesbah Kabylie",
    "patrimoine kabyle",
    "Haute Kabylie",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description: "Un village, une mémoire, un avenir.",
    url: "/",
    siteName: "Aït Mesbah",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
