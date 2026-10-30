import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AccueilPage() {
  // Les quatre comptages sont lancés en parallèle
  const [nbParcelles, nbCultures, nbEmployes, nbCapteurs] = await Promise.all([
    prisma.parcelle.count(),
    prisma.culture.count(),
    prisma.employe.count(),
    prisma.capteur.count(),
  ]);

  const sections = [
    {
      titre: "Parcelles",
      href: "/parcelles",
      total: nbParcelles,
      description: "Zones cultivables de la ferme, avec leur capteur et leurs cultures.",
    },
    {
      titre: "Cultures",
      href: "/cultures",
      total: nbCultures,
      description: "Productions en cours, leur parcelle et les employés affectés.",
    },
    {
      titre: "Employés",
      href: "/employes",
      total: nbEmployes,
      description: "Équipe de la ferme et les cultures auxquelles chacun participe.",
    },
    {
      titre: "Capteurs",
      href: "/capteurs",
      total: nbCapteurs,
      description: "Mesures d'humidité et de température par parcelle.",
    },
  ];

  return (
    <div>
      <h1>Les Jardins du Soleil</h1>
      <p className="introduction">
        Bienvenue dans l&apos;application de gestion de la ferme maraîchère.
        Consultez et enregistrez les parcelles, les cultures, les employés et
        les capteurs au même endroit.
      </p>

      <ul className="grille">
        {sections.map((section) => (
          <li key={section.href} className="carte">
            <h3>{section.titre}</h3>
            <p className="compteur">{section.total}</p>
            <p>{section.description}</p>
            <Link href={section.href} className="lien-carte">
              Voir les {section.titre.toLowerCase()} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}