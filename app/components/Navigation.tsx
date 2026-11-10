"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LIENS = [
  { href: "/", texte: "Accueil" },
  { href: "/parcelles", texte: "Parcelles" },
  { href: "/cultures", texte: "Cultures" },
  { href: "/employes", texte: "Employés" },
  { href: "/capteurs", texte: "Capteurs" },
];

export default function Navigation() {
  // Chemin de la page affichée, par exemple "/cultures"
  const cheminActuel = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-titre">
        <Logo />
        Les Jardins du Soleil
      </Link>

      <ul className="navbar-liens">
        {LIENS.map((lien) => {
          // "/" doit correspondre exactement, sinon il serait actif partout
          const estActif =
            lien.href === "/"
              ? cheminActuel === "/"
              : cheminActuel.startsWith(lien.href);

          return (
            <li key={lien.href}>
              <Link
                href={lien.href}
                className={estActif ? "lien-nav actif" : "lien-nav"}
                aria-current={estActif ? "page" : undefined}
              >
                {lien.texte}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
