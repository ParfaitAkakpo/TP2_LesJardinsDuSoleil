"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Transforme les cases cochées (texte) en une liste d'ids entiers sans doublon
function lireIdsEmployes(formData: FormData): number[] {
  const ids = formData.getAll("employeIds").map((valeur) => Number(valeur));
  return [...new Set(ids)].filter((id) => Number.isInteger(id));
}

// Vérifie que tous les ids reçus correspondent à des employés existants
async function tousLesEmployesExistent(ids: number[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const trouves = await prisma.employe.count({ where: { id: { in: ids } } });
  return trouves === ids.length;
}

export async function createCulture(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const dateSemisTexte = String(formData.get("dateSemis") ?? "").trim();
  const dateRecolteTexte = String(formData.get("dateRecoltePrevue") ?? "").trim();
  const statut = String(formData.get("statut") ?? "").trim();
  const parcelleTexte = String(formData.get("parcelleId") ?? "").trim();

  const dateSemis = new Date(dateSemisTexte);
  const dateRecoltePrevue = new Date(dateRecolteTexte);
  const parcelleId = Number(parcelleTexte);
  const employeIds = lireIdsEmployes(formData);

  // 1. Champs obligatoires et valeurs valides
  if (
    !nom ||
    !dateSemisTexte ||
    !dateRecolteTexte ||
    !statut ||
    !parcelleTexte ||
    Number.isNaN(dateSemis.getTime()) ||
    Number.isNaN(dateRecoltePrevue.getTime()) ||
    !Number.isInteger(parcelleId)
  ) {
    redirect("/cultures?erreur=champs");
  }

  // 2. Règle métier : on ne récolte pas avant d'avoir semé
  if (dateRecoltePrevue < dateSemis) {
    redirect("/cultures?erreur=dates");
  }

  // 3. La parcelle choisie existe-t-elle ?
  const parcelle = await prisma.parcelle.findUnique({
    where: { id: parcelleId },
  });

  if (!parcelle) {
    redirect("/cultures?erreur=parcelle-inexistante");
  }

  // 4. Les employés cochés existent-ils ?
  if (!(await tousLesEmployesExistent(employeIds))) {
    redirect("/cultures?erreur=employes-inexistants");
  }

  // 5. Création : connect relie la culture à la parcelle et aux employés
  try {
    await prisma.culture.create({
      data: {
        nom,
        dateSemis,
        dateRecoltePrevue,
        statut,
        parcelle: { connect: { id: parcelleId } },
        employes: { connect: employeIds.map((id) => ({ id })) },
      },
    });
  } catch (erreur) {
    console.error("Erreur lors de la création de la culture :", erreur);
    redirect("/cultures?erreur=technique");
  }

  revalidatePath("/cultures");
  revalidatePath("/parcelles");
  revalidatePath("/employes");
  redirect("/cultures?succes=1");
}

export async function affecterEmployes(formData: FormData) {
  const cultureId = Number(formData.get("cultureId"));
  const employeIds = lireIdsEmployes(formData);

  if (!Number.isInteger(cultureId)) {
    redirect("/cultures?erreur=culture-inexistante");
  }

  if (employeIds.length === 0) {
    redirect("/cultures?erreur=aucun-employe");
  }

  const culture = await prisma.culture.findUnique({
    where: { id: cultureId },
  });

  if (!culture) {
    redirect("/cultures?erreur=culture-inexistante");
  }

  if (!(await tousLesEmployesExistent(employeIds))) {
    redirect("/cultures?erreur=employes-inexistants");
  }

  try {
    // connect ajoute les employés sans retirer ceux déjà affectés
    await prisma.culture.update({
      where: { id: cultureId },
      data: {
        employes: { connect: employeIds.map((id) => ({ id })) },
      },
    });
  } catch (erreur) {
    console.error("Erreur lors de l'affectation des employés :", erreur);
    redirect("/cultures?erreur=technique");
  }

  revalidatePath("/cultures");
  revalidatePath("/employes");
  redirect("/cultures?succes=affectation");
}