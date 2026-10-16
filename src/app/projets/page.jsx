"use client";
import Copy from "@/components/Copy";
import InfiniteSlider from "@/components/InfiniteSlider";
import Footer from "@/components/Footer";
import { introDelay } from "@/lib/intro";
import { projects } from "@/data";

export default function Projets() {
  const d = introDelay();
  return (
    <div>
      <section className="page-hero small">
        <div className="container">
          <Copy type="words" animateOnScroll={false} delay={d}><h1>Projets</h1></Copy>
          <Copy type="lines" animateOnScroll={false} delay={d + 0.3}>
            <p className="lead">Résidences, hôtels, restaurants et espaces de travail : une sélection de réalisations où chaque lieu naît d'une écoute attentive, du choix des matières et du travail de la lumière. Faites défiler pour parcourir les projets de l'Agence Bi.</p>
          </Copy>
        </div>
      </section>

      <InfiniteSlider items={projects} />
      <Footer />
    </div>
  );
}
