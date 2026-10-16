import Link from "next/link";
export default function Footer({ hideCta = false, light = false }) {
  return (
    <footer className={light ? "footer footer-light" : "footer"}>
      <div className="container">
        {!hideCta && <Link href="/contact" className="footer-big">Parlons de votre projet</Link>}
        <div className="footer-row">
          <p className="sm">© {new Date().getFullYear()} Ines Ben Arab — Agence Bi</p>
          <p className="sm"><Link href="/a-propos">À propos</Link> &nbsp; <Link href="/projets">Projets</Link> &nbsp; <Link href="/contact">Contact</Link></p>
        </div>
      </div>
    </footer>
  );
}
