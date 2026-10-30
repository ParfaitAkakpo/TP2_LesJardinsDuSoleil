"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEmploye(formData: FormData) {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const specialite = String(formData.get("specialite") ?? "").trim();

  // 1. Champs obligatoires
  if (!prenom || !nom || !specialite) {
    redirect("/employes?erreur=champs");
  }

  // 2. Création
  try {
    await prisma.employe.create({
      data: { prenom, nom, specialite },
    });
  } catch (erreur) {
    console.error("Erreur lors de la création de l'employé :", erreur);
    redirect("/employes?erreur=technique");
  }

  revalidatePath("/employes");
  revalidatePath("/cultures");
  redirect("/employes?succes=1");
}