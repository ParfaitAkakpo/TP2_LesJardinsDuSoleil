"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCapteur(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const humiditeTexte = String(formData.get("humidite") ?? "").trim();
  const temperatureTexte = String(formData.get("temperature") ?? "").trim();
  const parcelleTexte = String(formData.get("parcelleId") ?? "").trim();

  const humidite = Number(humiditeTexte);
  const temperature = Number(temperatureTexte);
  const parcelleId = Number(parcelleTexte);

  // 1. Validation des champs obligatoires
  if (
    !code ||
    !humiditeTexte ||
    !temperatureTexte ||
    !parcelleTexte ||
    !Number.isFinite(humidite) ||
    !Number.isFinite(temperature) ||
    !Number.isInteger(parcelleId) ||
    humidite < 0 ||
    humidite > 100
  ) {
    redirect("/capteurs?erreur=champs");
  }

  // 2. La parcelle choisie existe-t-elle, et a-t-elle déjà un capteur ?
  const parcelle = await prisma.parcelle.findUnique({
    where: { id: parcelleId },
    include: { capteur: true },
  });

  if (!parcelle) {
    redirect("/capteurs?erreur=parcelle-inexistante");
  }

  if (parcelle.capteur) {
    redirect("/capteurs?erreur=parcelle-occupee");
  }

  // 3. Création : parcelleId relie le capteur à la parcelle
  try {
    await prisma.capteur.create({
      data: { code, humidite, temperature, parcelleId },
    });
  } catch (erreur) {
    // L'erreur brute reste dans la console du serveur, jamais à l'écran
    console.error("Erreur lors de la création du capteur :", erreur);
    redirect("/capteurs?erreur=technique");
  }

  revalidatePath("/capteurs");
  revalidatePath("/parcelles");
  redirect("/capteurs?succes=1");
}