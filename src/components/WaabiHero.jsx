"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* Template Codegrid « Waabi » : l'image héro (desktop / mobile) est épinglée ; l'image rétrécit en vignette et des colonnes d'images dérivent. */
const COLS = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
const DRIFT = [-500, -250, -250, -500];

export default function WaabiHero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".wb-hero", start: "top top", end: () => `+=${window.innerHeight * 1.5}`,
        pin: true, pinSpacing: false, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const ip = gsap.parseEase("power2.inOut")(Math.max(0, Math.min((p - 0.1) / 0.9, 1)));
          gsap.set(".wb-img", {
            width: gsap.utils.interpolate(window.innerWidth, 150, ip),
            height: gsap.utils.interpolate(window.innerHeight, 150, ip),
            borderRadius: gsap.utils.interpolate(0, 10, ip),
          });
        },
      });

      DRIFT.forEach((y, i) => {
        gsap.to(`#wb-col-${i + 1}`, {
          y, scrollTrigger: { trigger: ".wb-about", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="wb" ref={root}>
      <section className="wb-hero">
        <h1 className="sr-only">Ines Ben Arab — Agence Bi — Architecte d'intérieur</h1>
        <div className="wb-img">
          <picture>
            <source media="(max-width: 767px)" srcSet="/home/hero2.jpg" />
            <img src="/home/hero.jpg" alt="" />
          </picture>
        </div>
      </section>

      <section className="wb-about">
        <div className="wb-images" aria-hidden="true">
          {COLS.map((col, c) => (
            <div key={c} className="wb-col" id={`wb-col-${c + 1}`}>
              {col.map((n) => <div key={n} className="wb-thumb"><img src={`/home/drift-${n}.jpg`} alt="" loading="lazy" /></div>)}
            </div>
          ))}
        </div>
        <div className="wb-about-header">
          <h3>Façonner des espaces uniques où l'art de vivre tunisien rencontre l'élégance du design contemporain. Plus de 20 ans de création, de matières et de lumière.</h3>
        </div>
      </section>
    </div>
  );
}
