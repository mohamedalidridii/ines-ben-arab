"use client";
import { useEffect, useRef, useState } from "react";
import Copy from "@/components/Copy";
import { expertises, bg } from "@/data";

export default function Expertises() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const cur = expertises[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="expertises" ref={root}>
      <div className="container">
        <Copy type="words"><h2>Expertises</h2></Copy>
        <div className="exp-grid">
          <ul className="exp-list">
            {expertises.map((e, i) => (
              <li key={e.title} style={{ "--d": `${i * 0.1}s` }} className={`exp-row ${seen ? "seen" : ""} ${i === active ? "active" : ""}`} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                {e.title}
              </li>
            ))}
          </ul>
          <div className="exp-visual">
            <div className="exp-imgs">
              {expertises.map((e, i) => (
                <div key={e.title} className={i === active ? "active" : ""} style={bg(e.image, i)} />
              ))}
            </div>
            <div className="exp-details" key={active}>
              <p>{cur.text}</p>
              <ul className="tags">{cur.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
