"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createParcelle(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const superficieTexte = String(formData.get("superficie") ?? "").trim();
  const typeSol = String(formData.get("typeSol") ?? "").trim();
  const localisation = String(formData.get("localisation") ?? "").trim();

  const superficie = Number(superficieTexte.replace(",", "."));

  // 1. Champs obligatoires
  if (!nom || !superficieTexte || !typeSol || !localisation) {
    redirect("/parcelles?erreur=champs");
  }

  // 2. La superficie doit être un nombre strictement positif
  if (!Number.isFinite(superficie) || superficie <= 0) {
    redirect("/parcelles?erreur=superficie");
  }

  // 3. Création
  try {
    await prisma.parcelle.create({
      data: { nom, superficie, typeSol, localisation },
    });
  } catch (erreur) {
    // L'erreur brute reste dans la console du serveur, jamais à l'écran
    console.error("Erreur lors de la création de la parcelle :", erreur);
    redirect("/parcelles?erreur=technique");
  }

  revalidatePath("/parcelles");
  redirect("/parcelles?succes=1");
}