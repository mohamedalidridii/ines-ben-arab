"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Copy from "@/components/Copy";
import Parallax from "@/components/Parallax";
import Footer from "@/components/Footer";
import { introDelay } from "@/lib/intro";
import { stats, values } from "@/data";
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const d = introDelay();
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* compteurs qui montent quand la section apparaît */
      gsap.utils.toArray(".stat-num").forEach((el) => {
        const o = { v: 0 };
        gsap.to(o, { v: +el.dataset.value, duration: 2, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)),
          scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.from(".stat", { y: 40, autoAlpha: 0, stagger: 0.15, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".stats", start: "top 85%", once: true } });
      /* le titre géant se déplace latéralement avec le scroll */
      gsap.to(".marquee-text", { xPercent: -30, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <section className="page-hero">
        <div className="container">
          <Copy type="words" animateOnScroll={false} delay={d}><h1>À propos</h1></Copy>
          <Copy type="lines" animateOnScroll={false} delay={d + 0.3}>
            <p className="lead">Ines Ben Arab est architecte d'intérieur et créatrice tunisienne, à la tête de l'Agence Bi.</p>
          </Copy>
        </div>
      </section>

      <section className="split">
        <div className="container split-grid">
          <Parallax src="/home/portrait.jpg" i={1} />
          <div className="split-text">
            <Copy type="lines"><p>Depuis plus de vingt ans, elle conçoit des intérieurs où l'art de vivre tunisien traditionnel dialogue avec le design contemporain.</p></Copy>
            <Copy type="lines"><p>Présidente d'un groupement professionnel d'architectes d'intérieur à Sfax, elle participe régulièrement aux grands salons du secteur : Medibat, Salon du Meuble de Tunis, Zina Expo.</p></Copy>
            <Copy type="lines"><p>Chaque projet commence par une écoute : vos habitudes, votre lumière, vos matières. Le reste suit.</p></Copy>
          </div>
        </div>
      </section>

      <div className="marquee"><div className="marquee-text">Matière · Lumière · Volume · Savoir-faire · Matière · Lumière · Volume</div></div>

      <section className="stats">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <p className="stat-big"><span className="stat-num" data-value={s.value}>0</span>{s.suffix}</p>
              <p className="sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="values">
        <div className="container">
          <Copy type="words"><h2>Nos valeurs</h2></Copy>
          <div className="values-grid">
            {values.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
