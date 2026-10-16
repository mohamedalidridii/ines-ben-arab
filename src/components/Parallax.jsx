"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bg } from "@/data";
gsap.registerPlugin(ScrollTrigger);

/* Image qui glisse doucement pendant le scroll + révélation par clip-path */
export default function Parallax({ src, i = 0, ratio = "4 / 5", className = "" }) {
  const box = useRef(null), inner = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(box.current, { clipPath: "inset(12% 12% 12% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: box.current, start: "top bottom", end: "top 45%", scrub: true } });
      gsap.fromTo(inner.current, { yPercent: -10 }, { yPercent: 10, ease: "none",
        scrollTrigger: { trigger: box.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={box} className={`plx ${className}`} style={{ aspectRatio: ratio }}>
      <div ref={inner} className="plx-in" style={bg(src, i)} />
    </div>
  );
}
