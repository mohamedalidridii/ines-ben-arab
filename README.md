# Ines Ben Arab — site (Next.js + GSAP)

    npm install
    npm run dev      # http://localhost:3000

Pages : `/` Accueil · `/a-propos` · `/projets` · `/contact`

## Images (public/)
Tant qu'une image manque, un dégradé beige s'affiche à la place.
- `public/home/` : hero.jpg, hero2.jpg (mobile), about-1..6.jpg, portrait.jpg, logo.png (déjà inclus)
- `public/expertises/` : architecture, mobilier, residentiel, commercial, chantier (.jpg)
- `public/projets/` : p1..p6.jpg

## À personnaliser
- Textes, expertises, projets : `src/data.js`
- E-mail du formulaire : `src/app/contact/page.jsx` (constante EMAIL)
- Couleurs : variables en haut de `src/app/globals.css`

## 3D (Three.js)
- `src/components/ArchScene.jsx` : enfilade d'arcs en 3D (caméra pilotée par le scroll, inclinée par la souris).
- Utilisée sur l'accueil (`Passage.jsx`, section épinglée) et dans l'en-tête de `/projets`.
- Réglages : `COUNT` (nombre d'arcs), `GAP` (espacement), couleurs `tones` en haut du fichier.

## Logos (public/home/)
logo-white / logo-black (complet) et logo-mark-white / logo-mark-black (mot arabe seul), fond transparent.
Le logo en haut de page (menu) est `logo-mark-white.png` en mode « difference » : il reste lisible sur photo et sur fond clair.
