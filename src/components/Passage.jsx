"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArchScene from "@/components/ArchScene";
gsap.registerPlugin(ScrollTrigger);

/* Section épinglée : le scroll fait avancer la caméra à travers les arches en 3D */
export default function Passage() {
  const root = useRef(null);
  const progress = useRef(0);
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "+=3200", pin: true,
        onUpdate: (self) => (progress.current = self.progress),
      });
      gsap.to(".passage-text", { opacity: 0, y: -40, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=900", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div className="passage-wrap">
    <section className="passage" ref={root}>
      <ArchScene progress={progress} />
      <div className="passage-text">
        <h2>Traverser<br />les espaces</h2>
        <p className="sm">Faites défiler pour avancer</p>
      </div>
    </section>
    </div>
  );
}
