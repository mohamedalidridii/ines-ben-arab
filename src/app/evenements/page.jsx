"use client";
import { useState } from "react";
import Copy from "@/components/Copy";
import StoryViewer from "@/components/StoryViewer";
import Footer from "@/components/Footer";
import { introDelay } from "@/lib/intro";
import { events } from "@/data";

export default function Evenements() {
  const d = introDelay();
  const [open, setOpen] = useState(null);
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Copy type="words" animateOnScroll={false} delay={d}><h1 className="ev-title">Événements</h1></Copy>
          <Copy type="lines" animateOnScroll={false} delay={d + 0.3}>
            <p className="lead">Salons, expositions et rencontres : revivez nos participations en stories. Touchez un événement pour le découvrir.</p>
          </Copy>
        </div>
      </section>

      <section className="ev">
        <div className="container">
          <div className="ev-rings" role="list">
            {events.map((e, i) => (
              <button key={e.id} className="ev-ring" role="listitem" onClick={() => setOpen(i)}>
                <span className="ev-ring-img"><img src={e.cover} alt="" /></span>
                <span className="sm">{e.title}</span>
              </button>
            ))}
          </div>
          <div className="ev-grid">
            {events.map((e, i) => (
              <button key={e.id} className="ev-card" onClick={() => setOpen(i)} aria-label={`Ouvrir les stories : ${e.title}`}>
                <img src={e.cover} alt="" loading="lazy" />
                <span className="ev-card-meta"><strong>{e.title}</strong><small>{e.place} — {e.year}</small></span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {open !== null && <StoryViewer events={events} start={open} onClose={() => setOpen(null)} />}
      <Footer />
    </div>
  );
}
