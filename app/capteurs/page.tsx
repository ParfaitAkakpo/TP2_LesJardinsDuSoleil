import { prisma } from "@/lib/prisma";
import { createCapteur } from "./actions";

export const instant = false;

const MESSAGES_ERREUR: Record<string, string> = {
  champs:
    "Veuillez remplir tous les champs avec des valeurs valides (humidité entre 0 et 100).",
  "parcelle-inexistante": "La parcelle choisie n'existe pas.",
  "parcelle-occupee": "Cette parcelle possède déjà un capteur.",
  technique: "Impossible d'enregistrer le capteur. Veuillez réessayer.",
};

export default async function CapteursPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { erreur, succes } = await searchParams;

  // Seules les parcelles sans capteur sont proposées dans la liste
  const parcellesLibres = await prisma.parcelle.findMany({
    where: { capteur: { is: null } },
    orderBy: { nom: "asc" },
  });

  // Lecture 1 à 1 : chaque capteur avec sa parcelle
  const capteurs = await prisma.capteur.findMany({
    include: { parcelle: true },
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h1>Capteurs</h1>

      {erreur && (
        <p className="message-erreur">
          {MESSAGES_ERREUR[erreur] ?? MESSAGES_ERREUR.technique}
        </p>
      )}
      {succes && <p className="message-succes">Le capteur a été ajouté.</p>}

      <div className="mise-en-page">
        <form action={createCapteur} className="formulaire">
          <h2>Ajouter un capteur</h2>

          <div className="champ">
            <label htmlFor="code">Code du capteur</label>
            <input id="code" name="code" type="text" required />
          </div>

          <div className="champ">
            <label htmlFor="humidite">Humidité (%)</label>
            <input
              id="humidite"
              name="humidite"
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="champ">
            <label htmlFor="temperature">Température (°C)</label>
            <input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              required
            />
          </div>

          <div className="champ">
            <label htmlFor="parcelleId">Parcelle</label>
            {parcellesLibres.length === 0 ? (
              <p className="vide">
                Aucune parcelle disponible : toutes ont déjà un capteur, ou
                aucune parcelle n&apos;existe.
              </p>
            ) : (
              <select id="parcelleId" name="parcelleId" required defaultValue="">
                <option value="" disabled>
                  Choisir une parcelle
                </option>
                {parcellesLibres.map((parcelle) => (
                  <option key={parcelle.id} value={parcelle.id}>
                    {parcelle.nom} ({parcelle.localisation})
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="bouton"
            disabled={parcellesLibres.length === 0}
          >
            Ajouter le capteur
          </button>
        </form>

        <section className="zone-liste">
          <h2>Liste des capteurs ({capteurs.length})</h2>

          {capteurs.length === 0 ? (
            <p className="vide">Aucun capteur pour le moment.</p>
          ) : (
            <ul className="grille">
              {capteurs.map((capteur) => (
                <li key={capteur.id} className="carte">
                  <h3>{capteur.code}</h3>
                  <p><strong>Parcelle :</strong> {capteur.parcelle.nom}</p>
                  <p><strong>Humidité :</strong> {capteur.humidite} %</p>
                  <p><strong>Température :</strong> {capteur.temperature} °C</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}