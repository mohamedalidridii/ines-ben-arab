"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/projets", label: "Projets" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overlay = useRef(null);

  useEffect(() => {
    setOpen(false);
    const id = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    gsap.to(overlay.current, { clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power4.inOut" });
    if (open) gsap.fromTo(".menu-link span", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, delay: 0.35, ease: "power4.out" });
  }, [open]);

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav-logo" aria-label="Ines Ben Arab — accueil"><img src="/home/logo-mark-white.png" alt="" /></Link>
        <button className="nav-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Fermer" : "Menu"}
        </button>
      </header>
      <div ref={overlay} className="menu-overlay">
        <nav>
          {links.map((l) => (
            <div key={l.href} className="menu-link">
              <span><Link href={l.href} className={pathname === l.href ? "current" : ""}>{l.label}</Link></span>
            </div>
          ))}
        </nav>
        <p className="sm">Architecte d'intérieur — Tunisie</p>
      </div>
    </>
  );
}
