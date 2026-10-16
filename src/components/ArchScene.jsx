"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* Enfilade d'arcs en 3D cinématique : textures PBR réelles (enduit + marbre, Poly Haven CC0, dans
   /public/textures), lumière rasante chaude, contre-jour sur le logo, brume, bloom, vignette et grain.
   Au bout du couloir, le logo de l'agence flotte en relief doré.
   - progress : { current: 0..1 } fait avancer la caméra dans le couloir (piloté par GSAP)
   - auto     : sans scroll, la caméra flotte lentement
   La souris incline légèrement la vue. */
const COUNT = 16, GAP = 5;

function archWall(w, h, aw, ah, depth) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
  const r = aw / 2, hole = new THREE.Path();
  hole.moveTo(-r, 0); hole.lineTo(-r, ah - r); hole.absarc(0, ah - r, r, Math.PI, 0, true); hole.lineTo(r, 0); hole.closePath();
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
}

const FILM = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform float time; varying vec2 vUv;
    float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      c.rgb *= smoothstep(0.95, 0.25, length(d * vec2(1.0, 0.85)));        // vignette
      c.rgb += (rnd(vUv * 900.0 + time) - 0.5) * 0.045;                    // grain
      gl_FragColor = c;
    }`,
};

export default function ArchScene({ progress, auto = false }) {
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, antialias: !mobile, alpha: false, powerPreference: "high-performance" });
    } catch (err) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setClearColor(0x0d0906);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x120b06, 7, 46);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.22;
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffe2bd, 0x20140a, 0.18));
    /* lumière rasante : met en relief la matière des murs */
    const sun = new THREE.DirectionalLight(0xffb866, 4.2);
    sun.castShadow = !mobile;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 40 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);
    const lamp = new THREE.PointLight(0xff9a4d, 9, 14, 1.7); scene.add(lamp);

    /* textures PBR réelles */
    const loader = new THREE.TextureLoader();
    const load = (url, srgb, rx, ry) => {
      const t = loader.load(url); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
      t.anisotropy = renderer.capabilities.getMaxAnisotropy(); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
    };
    const wall = (n, rx, ry) => ({ map: load(`/textures/${n}_diff.jpg`, true, rx, ry), normalMap: load(`/textures/${n}_nor_gl.jpg`, false, rx, ry), roughnessMap: load(`/textures/${n}_rough.jpg`, false, rx, ry) });
    const wallTex = wall("beige_wall_001", 0.3, 0.3);
    const floorTex = wall("marble_tiles", 4, 40);
    const tones = [0xf4ece0, 0xe0b968, 0x6e6459, 0xdcc69c];
    const mats = tones.map((c) => new THREE.MeshStandardMaterial({ ...wallTex, color: c, roughness: 1, normalScale: new THREE.Vector2(1.4, 1.4) }));
    const geos = [archWall(10, 8, 3.2, 5, 0.6), archWall(10, 8, 2.6, 4.2, 0.6), archWall(10, 8, 3.8, 5.6, 0.6)];
    for (let i = 0; i < COUNT; i++) {
      const m = new THREE.Mesh(geos[i % 3], mats[i % 4]);
      m.position.set(0, -2, -i * GAP); m.castShadow = m.receiveShadow = true; scene.add(m);
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, COUNT * GAP + 20),
      new THREE.MeshStandardMaterial({ ...floorTex, color: 0x6b6258, roughness: 0.8, metalness: 0.05, envMapIntensity: 1.6 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, -2, -(COUNT * GAP) / 2 + 8); floor.receiveShadow = true; scene.add(floor);

    /* le logo de l'agence : empilement de tranches pour donner du relief, en or poli */
    const logoGroup = new THREE.Group();
    logoGroup.position.set(0, 0.3, -(COUNT - 1) * GAP - 3); scene.add(logoGroup);
    const logoH = 2.6, logoW = logoH * (419 / 500), SLICES = mobile ? 8 : 14;
    const logoTex = new THREE.TextureLoader().load("/home/logo-mark-white.png");
    logoTex.colorSpace = THREE.SRGBColorSpace; logoTex.anisotropy = 8;
    const slices = [];
    for (let i = 0; i < SLICES; i++) {
      const front = i === SLICES - 1;
      const m = new THREE.MeshStandardMaterial({
        map: logoTex, alphaTest: 0.5, transparent: false, side: THREE.DoubleSide,
        color: new THREE.Color(0x8a6a22).lerp(new THREE.Color(0xf3d27a), i / (SLICES - 1)),
        metalness: 0.95, roughness: front ? 0.22 : 0.4, envMapIntensity: 1.6,
        emissive: 0x3a2a08, emissiveIntensity: 0.5,
      });
      const p = new THREE.Mesh(new THREE.PlaneGeometry(logoW, logoH), m);
      p.position.z = (i - SLICES / 2) * 0.022; p.castShadow = !mobile; logoGroup.add(p); slices.push(m);
    }
    /* contre-jour chaud derrière le logo + halo lumineux (capté par le bloom) */
    const endZ = -(COUNT - 1) * GAP - 3;
    const back = new THREE.SpotLight(0xffc27a, 160, 30, 0.5, 0.8, 1.4); back.position.set(0, 1.5, endZ - 5); back.target.position.set(0, 0, endZ + 6);
    scene.add(back, back.target);
    const front = new THREE.PointLight(0xffd9a0, 7, 9, 1.8); front.position.set(0, 0.8, endZ + 3); scene.add(front);
    const gc = document.createElement("canvas"); gc.width = gc.height = 128;
    const gx = gc.getContext("2d"), gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,205,130,1)"); gr.addColorStop(0.35, "rgba(255,160,70,.35)"); gr.addColorStop(1, "rgba(255,140,40,0)");
    gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(gc);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0.75 }));
    glow.scale.set(9, 9, 1); glow.position.set(0, 0.3, endZ - 1.2); scene.add(glow);

    /* poussière dans la lumière */
    const N = mobile ? 120 : 320, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 8; pos[i * 3 + 1] = -1.8 + Math.random() * 7; pos[i * 3 + 2] = -Math.random() * COUNT * GAP + 6; }
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xfff0d0, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
    scene.add(dust);

    /* post-traitement (desktop) : bloom + vignette + grain */
    let composer, bloom, film;
    if (!mobile) {
      composer = new EffectComposer(renderer); composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      composer.addPass(new RenderPass(scene, camera));
      bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.8, 0.82);
      composer.addPass(bloom);
      film = new ShaderPass(FILM); composer.addPass(film);
      composer.addPass(new OutputPass());
    }

    const mouse = { x: 0, y: 0 }, cur = { p: 0, x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h, false); composer?.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let raf, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      const target = auto ? 0.1 + 0.04 * Math.sin(t * 0.25) : progress?.current ?? 0;
      cur.p += (target - cur.p) * 0.06; cur.x += (mouse.x - cur.x) * 0.05; cur.y += (mouse.y - cur.y) * 0.05;
      camera.position.set(cur.x * 1.6, 0.4 - cur.y * 0.8, 4 - cur.p * (COUNT - 1) * GAP);
      camera.lookAt(cur.x * 0.8, 0.2, camera.position.z - 8);
      const cz = camera.position.z;
      sun.position.set(-6, 3.5, cz + 3); sun.target.position.set(0, 0, cz - 8); sun.target.updateMatrixWorld();
      lamp.position.set(camera.position.x, 1.5, cz - 1);
      logoGroup.rotation.y = Math.sin(t * 0.5) * 0.45;
      logoGroup.position.y = 0.3 + Math.sin(t * 0.8) * 0.08;
      dust.position.y = Math.sin(t * 0.3) * 0.15;
      if (composer) { film.uniforms.time.value = t % 100; composer.render(); } else renderer.render(scene, camera);
    };
    if (reduce) { frame(); cancelAnimationFrame(raf); } else frame();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
      glowTex.dispose(); logoTex.dispose(); composer?.dispose(); envRT.dispose(); pmrem.dispose(); renderer.dispose();
    };
  }, [auto, progress]);

  return <canvas ref={canvas} className="scene" aria-hidden="true" />;
}
