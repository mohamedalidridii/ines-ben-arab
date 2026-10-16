"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);

/* Défilement fluide (Lenis) synchronisé avec ScrollTrigger */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    /* recalcule les positions ScrollTrigger quand la hauteur de la page change (images, polices, accordéons) */
    let h = document.body.scrollHeight, timer;
    const ro = new ResizeObserver(() => {
      if (Math.abs(document.body.scrollHeight - h) < 2) return;
      h = document.body.scrollHeight;
      clearTimeout(timer);
      timer = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 150);
    });
    ro.observe(document.body);
    return () => { clearTimeout(timer); ro.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
