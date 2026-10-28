"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEmploye(formData: FormData) {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const specialite = String(formData.get("specialite") ?? "").trim();

  // Validation minimale côté serveur : rien n'est inséré si un champ est vide
  if (!prenom || !nom || !specialite) {
    return;
  }

  await prisma.employe.create({
    data: { prenom, nom, specialite },
  });

  revalidatePath("/employes");
}