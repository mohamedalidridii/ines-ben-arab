"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArchScene from "@/components/ArchScene";
gsap.registerPlugin(ScrollTrigger);

/* Section épinglée : le scroll fait avancer la caméra à travers les arches en 3D */
export default function Passage() {
  const root = useRef(null);
  const progress = useRef(0);
  /* pas de 3D sur mobile : le conteneur reste dans le DOM (masqué en CSS, donc la mise en page
     ne change jamais) ; seuls la scène WebGL et l'épinglage ne sont pas créés */
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(!window.matchMedia("(max-width: 767px)").matches); }, []);
  useEffect(() => {
    if (!show) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "+=3200", pin: true, refreshPriority: 2,
        onUpdate: (self) => (progress.current = self.progress),
      });
      gsap.to(".passage-text", { opacity: 0, y: -40, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=900", scrub: true } });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [show]);
  return (
    <div className="passage-wrap">
    <section className="passage" ref={root}>
      {show && <ArchScene progress={progress} />}
      <div className="passage-text">
        <h2>Traverser<br />les espaces</h2>
        <p className="sm">Faites défiler pour avancer</p>
      </div>
    </section>
    </div>
  );
}
