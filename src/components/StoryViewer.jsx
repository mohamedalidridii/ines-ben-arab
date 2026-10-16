"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* Visionneuse façon stories Instagram : barres de progression, tap gauche/droite,
   appui long = pause, flèches / Échap au clavier, passage automatique à l'événement suivant. */
const DURATION = 5; // secondes par slide

export default function StoryViewer({ events, start, onClose }) {
  const [ev, setEv] = useState(start);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const event = events[ev];

  const next = useCallback(() => {
    if (i < event.slides.length - 1) setI(i + 1);
    else if (ev < events.length - 1) { setEv(ev + 1); setI(0); }
    else onClose();
  }, [i, ev, event, events.length, onClose]);

  const prev = useCallback(() => {
    if (i > 0) setI(i - 1);
    else if (ev > 0) { setEv(ev - 1); setI(events[ev - 1].slides.length - 1); }
  }, [i, ev, events]);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", key);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prevOverflow; };
  }, [next, prev, onClose]);

  /* appui long (> 200 ms) = pause ; un tap court change de slide */
  const hold = useRef({ timer: 0, held: false });
  const down = () => { hold.current.held = false; hold.current.timer = setTimeout(() => { hold.current.held = true; setPaused(true); }, 200); };
  const cancel = () => { clearTimeout(hold.current.timer); setPaused(false); };
  const up = (e) => {
    cancel();
    if (hold.current.held) return;
    const r = e.currentTarget.getBoundingClientRect();
    (e.clientX - r.left) < r.width / 3 ? prev() : next();
  };

  const slide = event.slides[i];
  return (
    <div className="story-overlay" data-lenis-prevent role="dialog" aria-modal="true" aria-label={event.title}>
      <button className="story-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="story">
        <div className="story-bars">
          {event.slides.map((_, n) => (
            <span key={n} className="story-bar">
              <i className={n < i ? "done" : n === i ? "run" : ""} style={n === i ? { animationDuration: `${DURATION}s`, animationPlayState: paused ? "paused" : "running" } : undefined}
                 onAnimationEnd={n === i ? next : undefined} />
            </span>
          ))}
        </div>
        <div className="story-head">
          <img src="/home/logo-mark-white.png" alt="" />
          <div><strong>{event.title}</strong><small>{event.place} — {event.year}</small></div>
          <button onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="story-hit" onPointerDown={down} onPointerUp={up} onPointerLeave={cancel}>
          <img key={`${ev}-${i}`} className="story-img" src={slide.image} alt="" draggable="false" />
        </div>
        <p className="story-cap" key={`c${ev}-${i}`}>{slide.caption}</p>
      </div>
    </div>
  );
}
