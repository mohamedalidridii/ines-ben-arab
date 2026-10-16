"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Copy from "@/components/Copy";
import Footer from "@/components/Footer";
import { introDelay } from "@/lib/intro";
import { faq } from "@/data";

const EMAIL = "contact@agencebi.tn"; // ← remplace par ton vrai e-mail

export default function Contact() {
  const d = introDelay();
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".field", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, delay: d + 0.5, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, [d]);

  const send = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get("message")}\n\n${f.get("name")} — ${f.get("email")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Nouveau projet")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div ref={root}>
      <section className="page-hero">
        <div className="container contact-grid">
          <div>
            <Copy type="words" animateOnScroll={false} delay={d}><h1>Contact</h1></Copy>
            <Copy type="lines" animateOnScroll={false} delay={d + 0.3}><p className="lead">Parlez-nous de votre espace, de vos envies et de votre calendrier.</p></Copy>
            <p className="sm info">{EMAIL}<br />Tunisie</p>
          </div>
          <form onSubmit={send} className="form">
            <label className="field">Nom<input name="name" required autoComplete="name" /></label>
            <label className="field">E-mail<input name="email" type="email" required autoComplete="email" /></label>
            <label className="field">Votre projet<textarea name="message" rows="4" required /></label>
            <button className="btn field" type="submit">Envoyer le message</button>
          </form>
        </div>
      </section>
      <section className="faq">
        <div className="container">
          <Copy type="words"><h2>Questions fréquentes</h2></Copy>
          <div className="faq-list">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
