"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/* Écran d'intro : compteur 0 → 100 puis le rideau remonte (une seule fois par chargement) */
export default function Preloader() {
  const root = useRef(null), num = useRef(null);
  useEffect(() => {
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { window.__loaded = true; root.current.style.display = "none"; } });
    tl.to(o, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => (num.current.textContent = Math.round(o.v)) })
      .to(".pre-in", { opacity: 0, duration: 0.3 })
      .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" });
    return () => tl.kill();
  }, []);
  return (
    <div ref={root} className="preloader">
      <div className="pre-in"><img className="pre-logo" src="/home/logo-white.png" alt="Ines Ben Arab — Agence Bi" /><span className="pre-num" ref={num}>0</span></div>
    </div>
  );
}
