"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* Slider infini (template Codegrid « Perpetual Motion ») : les vignettes grandissent en
   progression géométrique vers la droite et se recyclent à l'infini.
   Piloté par le scroll (section épinglée) et par le glisser à la souris / au doigt. */
const BASE = { lerp: 0.075, minSize: 0.1, scrollSpan: 9, maxHeight: 0.75 };

export default function InfiniteSlider({ items }) {
  const root = useRef(null);

  useEffect(() => {
    const slider = root.current;
    /* la plus grande vignette entièrement visible fait maxHeight (3/4) de la hauteur du slider :
       largeur c·W avec c = (minSize + r − 1) / r, d'où r = (1 − minSize) / (1 − c) */
    const W0 = slider.clientWidth, H0 = slider.clientHeight;
    const aspect = W0 < 768 ? 1 / 1.25 : 1 / 1.1;
    const c = Math.min((BASE.maxHeight * H0 * aspect) / W0, 0.85);
    const growth = Math.log((1 - BASE.minSize) / (1 - c));
    const config = { ...BASE, aspect, growth };
    const total = items.length;
    const growthRatio = Math.exp(config.growth);
    const slideCount = Math.ceil(Math.log(1 + (growthRatio - 1) / config.minSize) / config.growth) + 4;
    const wrap = (v, m) => ((v % m) + m) % m;
    const edgeX = (pos, w) => (w * config.minSize * (Math.pow(growthRatio, pos) - 1)) / (growthRatio - 1);

    const slides = [], streamIndex = [];
    for (let i = 0; i < slideCount; i++) {
      const el = document.createElement("div");
      el.className = "islide";
      el.innerHTML = '<img alt="" draggable="false" /><div class="islide-cap"><span></span><small></small></div>';
      slider.appendChild(el);
      slides.push(el); streamIndex.push(i);
    }

    let scroll = 0, base = 0, drag = 0, target = 0;
    const st = ScrollTrigger.create({
      trigger: slider, start: "top top", end: "+=300%", pin: true,
      onUpdate: (self) => { base = self.progress * config.scrollSpan; target = base + drag; },
    });

    /* glisser : pointer events (souris + tactile ; le scroll vertical reste libre grâce à touch-action: pan-y) */
    let lastX = null;
    const down = (e) => { lastX = e.clientX; slider.setPointerCapture(e.pointerId); };
    const move = (e) => {
      if (lastX === null) return;
      drag -= (e.clientX - lastX) * 0.012; lastX = e.clientX; target = base + drag;
    };
    const up = () => (lastX = null);
    slider.addEventListener("pointerdown", down);
    slider.addEventListener("pointermove", move);
    slider.addEventListener("pointerup", up);
    slider.addEventListener("pointercancel", up);

    let raf, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(slider);

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      scroll += (target - scroll) * config.lerp;
      const W = slider.clientWidth;
      for (let i = 0; i < slideCount; i++) {
        let s = streamIndex[i];
        while (edgeX(s + scroll, W) > W) s -= slideCount;
        while (edgeX(s + scroll + 1, W) < 0) s += slideCount;
        streamIndex[i] = s;
        const left = Math.round(edgeX(s + scroll, W));
        const right = Math.round(edgeX(s + scroll + 1, W));
        const width = right - left, el = slides[i];
        const k = wrap(s, total), item = items[k];
        if (el.dataset.k !== String(k)) {
          el.dataset.k = k;
          el.querySelector("img").src = item.image;
          el.querySelector("span").textContent = item.name;
          el.querySelector("small").textContent = `${item.type} — ${item.year}`;
        }
        el.style.width = `${width}px`;
        el.style.height = `${width / config.aspect}px`;
        el.style.zIndex = right;
        el.style.transform = `translate(${left}px, 0)`;
        el.classList.toggle("big", width > 240);
      }
    };
    render();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); st.kill();
      slider.removeEventListener("pointerdown", down); slider.removeEventListener("pointermove", move);
      slider.removeEventListener("pointerup", up); slider.removeEventListener("pointercancel", up);
      slides.forEach((el) => el.remove());
    };
  }, [items]);

  return <section className="islider" ref={root} aria-label="Galerie de projets" />;
}
