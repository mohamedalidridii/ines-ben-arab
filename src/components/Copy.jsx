"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

/* Découpe le texte enfant en lignes/mots masqués et les fait monter */
export default function Copy({ children, type = "lines", animateOnScroll = true, delay = 0, start = "top 85%" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split, tween, cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(el.firstElementChild || el, { type: "lines,words", mask: "lines" });
      tween = gsap.from(type === "words" ? split.words : split.lines, {
        yPercent: 110, duration: 1, delay, ease: "power4.out", stagger: type === "words" ? 0.08 : 0.1,
        scrollTrigger: animateOnScroll ? { trigger: el, start, once: true } : undefined,
      });
    });
    return () => { cancelled = true; tween?.scrollTrigger?.kill(); tween?.kill(); split?.revert(); };
  }, [type, animateOnScroll, delay, start]);
  return <div ref={ref} className="copy">{children}</div>;
}
