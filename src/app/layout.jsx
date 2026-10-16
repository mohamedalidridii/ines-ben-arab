import { Jost } from "next/font/google";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Ines Ben Arab — Architecte d'intérieur · Agence Bi",
  description: "Architecture d'intérieur et design en Tunisie. Plus de 20 ans de création.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={jost.className}>
        <SmoothScroll />
        <Preloader />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
