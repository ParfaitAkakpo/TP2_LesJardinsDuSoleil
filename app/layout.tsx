import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Les Jardins du Soleil",
  description: "Gestion de la ferme maraîchère",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <nav className="navbar">
          <span className="navbar-titre">🌱 Les Jardins du Soleil</span>
          <ul className="navbar-liens">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/parcelles">Parcelles</Link></li>
            <li><Link href="/cultures">Cultures</Link></li>
            <li><Link href="/employes">Employés</Link></li>
            <li><Link href="/capteurs">Capteurs</Link></li>
          </ul>
        </nav>
        <main className="contenu">{children}</main>
      </body>
    </html>
  );
}
