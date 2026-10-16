"use client";
import Link from "next/link";
import Copy from "@/components/Copy";
import WaabiHero from "@/components/WaabiHero";
import EventBubbles from "@/components/EventBubbles";
import Passage from "@/components/Passage";
import Expertises from "@/components/Expertises";
import Footer from "@/components/Footer";
import ContactSpotlight from "@/components/ContactSpotlight";
import { bg, process, projects } from "@/data";

export default function Home() {
  return (
    <div>
      <WaabiHero />
      <EventBubbles />

      <Passage />
      <Expertises />

      <section className="process">
        <div className="container">
          <Copy type="words"><h2>Notre méthode</h2></Copy>
          <div className="process-grid">
            {process.map((s) => (
              <div key={s.n} className="process-step">
                <p className="sm">{s.n}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <Copy type="words"><h2>Projets récents</h2></Copy>
          <div className="featured-grid">
            {projects.slice(0, 3).map((p, i) => (
              <Link key={p.name} href="/projets" className="featured-item">
                <div className="project-img" style={bg(p.image, i)} />
                <h3>{p.name}</h3>
                <p className="sm">{p.type} — {p.year}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactSpotlight />
      <Footer hideCta />
    </div>
  );
}
