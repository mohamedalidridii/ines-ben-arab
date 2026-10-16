"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/* Mot « DESIGN » en tracés SVG (police Jost 300, celle du site) ; le « I » (index 3) devient le bouton. */
const PATHS = [
  "M0 0V1750H138.5V0ZM475 1750Q730 1750 924 1640Q1118 1530 1226.5 1333.8Q1335 1137.5 1335 875Q1335 612.5 1226.5 416.2Q1118 220 924 110Q730 0 475 0H75.5V138.5H475Q638.5 138.5 772 190.2Q905.5 242 1000 338.7Q1094.5 435.5 1145.5 571.5Q1196.5 707.5 1196.5 875Q1196.5 1042.5 1145.5 1178.5Q1094.5 1314.5 1000 1411.3Q905.5 1508 772 1559.8Q638.5 1611.5 475 1611.5H75.5V1750Z",
  "M1667.5 1750H2535V1620H1667.5ZM1667.5 130H2535V0H1667.5ZM1667.5 856H2485V726H1667.5ZM1595 0V1750H1733.5V0Z",
  "M2908 1244 2795 1316Q2837.5 1437 2915.2 1541.7Q2993 1646.5 3108.2 1709.7Q3223.5 1773 3374 1773Q3482 1773 3574.2 1738.5Q3666.5 1704 3735.7 1641Q3805 1578 3843.7 1490Q3882.5 1402 3882.5 1295Q3882.5 1179 3842.5 1095.3Q3802.5 1011.5 3738.2 951.8Q3674 892 3597 852Q3520 812 3447 785Q3306.5 734.5 3211.7 678.8Q3117 623 3069.5 552.3Q3022 481.5 3022 386Q3022 267 3104.5 188.7Q3187 110.5 3340.5 110.5Q3454 110.5 3531.7 153.5Q3609.5 196.5 3660.5 262Q3711.5 327.5 3740 394.5L3860.5 327.5Q3826 243 3758 162.7Q3690 82.5 3588.7 29.8Q3487.5 -23 3348 -23Q3211.5 -23 3105 30.7Q2998.5 84.5 2938 180.5Q2877.5 276.5 2877.5 402.5Q2877.5 514.5 2920.7 594.5Q2964 674.5 3034 730.7Q3104 787 3185.5 826.2Q3267 865.5 3342 893Q3442 929 3533.2 978.2Q3624.5 1027.5 3682 1105.5Q3739.5 1183.5 3739.5 1310Q3739.5 1454 3643 1548Q3546.5 1642 3378.5 1642Q3251.5 1642 3161.5 1588.5Q3071.5 1535 3010.7 1444.5Q2950 1354 2908 1244Z",
  "M4142.5 0V1750H4280V0Z",
  "M5457.5 1007.5H6086Q6071.5 1135 6019.7 1248Q5968 1361 5882 1448.5Q5796 1536 5677.7 1585.3Q5559.5 1634.5 5412.5 1634.5Q5205.5 1634.5 5041 1537Q4876.5 1439.5 4781.2 1268Q4686 1096.5 4686 875Q4686 650 4781.7 479.7Q4877.5 309.5 5042 212.5Q5206.5 115.5 5412.5 115.5Q5624.5 115.5 5782.5 205.2Q5940.5 295 6027 441L6127 352.5Q6052 235 5946.7 151.5Q5841.5 68 5708.2 22.5Q5575 -23 5412.5 -23Q5225.5 -23 5066 43.3Q4906.5 109.5 4788.5 230.3Q4670.5 351 4605.2 515.5Q4540 680 4540 875Q4540 1070 4605.2 1234.5Q4670.5 1399 4788.5 1519.7Q4906.5 1640.5 5066 1706.7Q5225.5 1773 5412.5 1773Q5605.5 1773 5758.2 1700.7Q5911 1628.5 6017.5 1503Q6124 1377.5 6179.5 1216.8Q6235 1056 6235 877.5H5457.5Z",
  "M7824 0V1464.5L6495 -67.5V1750H6633.5V290.5L7962.5 1817.5V0Z",
];
const I_INDEX = 3;
const VB_W = 7962, VB_H = 1750;
const LAYERS = 6;
const LABEL = "PARLONS DE VOTRE PROJET";

/* Animation du template Codegrid : cascade des lettres, le « I » pivote et se centre en bouton,
   puis le fond du bouton s'agrandit en plein écran et révèle « Parlons de votre projet ». */
export default function ContactSpotlight() {
  const root = useRef(null);
  const letterI = useRef(null);
  const fill = useRef(null);
  const label = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const headers = gsap.utils.toArray(".spot-header", root.current);
    const front = headers[headers.length - 1];
    const others = gsap.utils.toArray(".spot-header svg > path", root.current);
    const g = letterI.current;
    const bb = g.querySelector("path").getBBox();
    gsap.set(g, { transformOrigin: "center center" });
    gsap.set(fill.current, { autoAlpha: 0 });

    const reveal = gsap.to(label.current, {
      duration: 1, paused: true,
      scrambleText: { text: LABEL, chars: "upperCase", revealDelay: 0.1, speed: 0.6 },
    });

    const STEP = 5, FINAL = 1 - (headers.length - 1) * 0.075;
    const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
    let end = { x: 0, y: 0, scale: 1, inset: [0, 0] };
    /* translation / échelle qui centrent le bouton, et rectangle (en px) qu'il occupe à l'écran */
    const measure = () => {
      const w = root.current.clientWidth, h = root.current.clientHeight;
      const pad = parseFloat(getComputedStyle(front).paddingLeft);
      const k = (w - pad * 2) / VB_W;
      const H = pad * 2 + VB_H * k;
      const sy = (u) => H + (pad + u * k - H) * FINAL + (headers.length - 1) * STEP;
      const sx = (u) => w / 2 + (pad + u * k - w / 2) * FINAL;
      const bw = Math.min(w * 0.86, 1100);
      const scale = bw / (bb.height * k * FINAL);
      const bh = bb.width * scale * k * FINAL;
      end = {
        x: (w / 2 - sx(cx)) / (k * FINAL),
        y: (h / 2 - sy(cy)) / (k * FINAL),
        scale,
        inset: [(h - bh) / 2, (w - bw) / 2],
      };
    };
    measure();
    const onResize = () => { measure(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", onResize);

    let shown = false, pre = 0, t = 0;
    /* pre : 0→1 quand la section monte du centre de l'écran vers le haut (début de la cascade)
       t   : progression pendant l'épinglage (fin de la cascade, bouton, fond plein écran) */
    const render = () => {
      const cascade = pre < 1 ? pre * 0.6 : 0.6 + 0.4 * Math.min(t / 0.2, 1);
      headers.forEach((h, i) => {
        const finalScale = 1 - i * 0.075;
        gsap.set(h, { scale: 1 + (finalScale - 1) * cascade, y: i * STEP * cascade });
      });
      const k = gsap.utils.clamp(0, 1, (t - 0.2) / 0.3);
      gsap.set(g, {
        rotation: 90 * k, x: end.x * k, y: end.y * k,
        scale: gsap.utils.interpolate(1, end.scale, k),
      });
      gsap.set(others, { opacity: 1 - gsap.utils.clamp(0, 1, k * 3) });

      /* le fond du bouton s'étend jusqu'au plein écran (clip-path) */
      const f = gsap.utils.clamp(0, 1, (t - 0.55) / 0.45);
      const e = gsap.parseEase("power2.inOut")(f);
      const [iy, ix] = end.inset;
      gsap.set(fill.current, {
        autoAlpha: k >= 1 ? 1 : 0,
        clipPath: `inset(${iy * (1 - e)}px ${ix * (1 - e)}px)`,
        pointerEvents: f > 0.98 ? "auto" : "none",
      });
      if (f > 0.4 && !shown) { shown = true; reveal.play(); }
      else if (f < 0.4 && shown) { shown = false; reveal.reverse(); }
    };
    const stPre = ScrollTrigger.create({
      trigger: root.current, start: "top center", end: "top top", scrub: true, refreshPriority: 1,
      onUpdate: (self) => { pre = self.progress; render(); },
    });
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "+=300%", pin: true, scrub: true, refreshPriority: 1,
      onUpdate: (self) => { t = self.progress; render(); },
    });
    return () => { window.removeEventListener("resize", onResize); st.kill(); stPre.kill(); reveal.kill(); };
  }, []);

  return (
    <section className="spot" ref={root} aria-label="Parlons de votre projet">
      {Array.from({ length: LAYERS }, (_, n) => {
        const isFront = n === LAYERS - 1;
        return (
          <div key={n} className="spot-header" aria-hidden={!isFront || undefined}>
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
              {PATHS.map((d, i) => {
                if (!(isFront && i === I_INDEX)) return <path key={i} d={d} />;
                return (
                  <g key={i} ref={letterI} className="spot-i" role="link" tabIndex={0}
                     onClick={() => router.push("/contact")}
                     onKeyDown={(e) => e.key === "Enter" && router.push("/contact")}>
                    <path d={d} />
                  </g>
                );
              })}
            </svg>
          </div>
        );
      })}
      <Link href="/contact" className="spot-fill" ref={fill} aria-label="Parlons de votre projet">
        <span className="spot-cta" ref={label} />
      </Link>
    </section>
  );
}
