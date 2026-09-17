import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./public.css";
import "./refresh.css";
import "./heritage.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Aït Mesbah — Village & Mémoire";
const description =
  "Découvrez Aït Mesbah, son identité et son projet communautaire de préservation de la mémoire du village, en Haute Kabylie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ait-mesbah.org"),
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
