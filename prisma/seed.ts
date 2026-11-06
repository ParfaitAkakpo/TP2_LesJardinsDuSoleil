import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // On vide les tables (les enfants avant les parents) pour pouvoir
  // relancer le seed sans créer de doublons.
  await prisma.capteur.deleteMany();
  await prisma.culture.deleteMany();
  await prisma.employe.deleteMany();
  await prisma.parcelle.deleteMany();

  // --- Parcelles (3) ---
  const parcelleNord = await prisma.parcelle.create({
    data: {
      nom: "Parcelle Nord",
      superficie: 2.5,
      typeSol: "Limoneux",
      localisation: "Secteur nord",
    },
  });

  const parcelleSud = await prisma.parcelle.create({
    data: {
      nom: "Parcelle Sud",
      superficie: 1.8,
      typeSol: "Argileux",
      localisation: "Secteur sud",
    },
  });

  const parcelleEst = await prisma.parcelle.create({
    data: {
      nom: "Parcelle Est",
      superficie: 3.2,
      typeSol: "Sableux",
      localisation: "Secteur est",
    },
  });

  // --- Capteurs (2) : relation 1-1, la parcelle Est n'en a pas ---
  await prisma.capteur.create({
    data: {
      code: "CAP-001",
      humidite: 62.5,
      temperature: 18.4,
      parcelle: { connect: { id: parcelleNord.id } },
    },
  });

  await prisma.capteur.create({
    data: {
      code: "CAP-002",
      humidite: 48.0,
      temperature: 20.1,
      parcelle: { connect: { id: parcelleSud.id } },
    },
  });

  // --- Employés (4) ---
  const marie = await prisma.employe.create({
    data: { prenom: "Marie", nom: "Tremblay", specialite: "Irrigation" },
  });
  const luc = await prisma.employe.create({
    data: { prenom: "Luc", nom: "Gagnon", specialite: "Récolte" },
  });
  const sophie = await prisma.employe.create({
    data: { prenom: "Sophie", nom: "Bouchard", specialite: "Entretien du sol" },
  });
  const karim = await prisma.employe.create({
    data: { prenom: "Karim", nom: "Benali", specialite: "Semis" },
  });

  // --- Cultures (4) ---
  // Relation 1-N : la parcelle Nord accueille deux cultures.
  // Relation N-N : Marie et Luc travaillent chacun sur deux cultures.
  await prisma.culture.create({
    data: {
      nom: "Tomates",
      dateSemis: new Date("2026-05-10"),
      dateRecoltePrevue: new Date("2026-08-20"),
      statut: "Récoltée",
      parcelle: { connect: { id: parcelleNord.id } },
      employes: { connect: [{ id: marie.id }, { id: luc.id }] },
    },
  });

  await prisma.culture.create({
    data: {
      nom: "Courges",
      dateSemis: new Date("2026-05-20"),
      dateRecoltePrevue: new Date("2026-09-30"),
      statut: "Récoltée",
      parcelle: { connect: { id: parcelleNord.id } },
      employes: { connect: [{ id: luc.id }, { id: sophie.id }] },
    },
  });

  await prisma.culture.create({
    data: {
      nom: "Carottes",
      dateSemis: new Date("2026-08-01"),
      dateRecoltePrevue: new Date("2026-11-15"),
      statut: "En croissance",
      parcelle: { connect: { id: parcelleSud.id } },
      employes: { connect: [{ id: marie.id }, { id: karim.id }] },
    },
  });

  await prisma.culture.create({
    data: {
      nom: "Laitue",
      dateSemis: new Date("2026-10-01"),
      dateRecoltePrevue: new Date("2026-11-30"),
      statut: "Semée",
      parcelle: { connect: { id: parcelleEst.id } },
      employes: { connect: [{ id: sophie.id }] },
    },
  });

  console.log("Jeu de données créé : 3 parcelles, 4 employés, 4 cultures, 2 capteurs.");
}

main()
  .catch((erreur) => {
    console.error("Erreur pendant le seed :", erreur);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });