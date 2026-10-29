import { prisma } from "@/lib/prisma";
import { createParcelle } from "./actions";

export default async function page() {
  const parcelles = await prisma.parcelle.findMany({
  orderBy: { id: "desc" },
  include: { capteur: true },
  });

  return (
    <div>
      <h1>Parcelles</h1>

      <form action={createParcelle} className="formulaire">
        <h2>Ajouter une parcelle</h2>

        <div className="champ">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" required />
        </div>

        <div className="champ">
          <label htmlFor="superficie">Superficie (hectares)</label>
          <input
            id="superficie"
            name="superficie"
            type="number"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="champ">
          <label htmlFor="typeSol">Type de sol</label>
          <input id="typeSol" name="typeSol" type="text" required />
        </div>

        <div className="champ">
          <label htmlFor="localisation">Localisation</label>
          <input id="localisation" name="localisation" type="text" required />
        </div>


        <button type="submit" className="bouton">
          Ajouter la parcelle
        </button>
      </form>

      <h2>Liste des parcelles ({parcelles.length})</h2>

      {parcelles.length === 0 ? (
        <p className="vide">Aucune parcelle pour le moment.</p>
      ) : (
        <ul className="grille">
          {parcelles.map((parcelle) => (
            <li key={parcelle.id} className="carte">
              <h3>{parcelle.nom}</h3>
              <p><strong>Superficie :</strong> {parcelle.superficie} ha</p>
              <p><strong>Type de sol :</strong> {parcelle.typeSol}</p>
              <p><strong>Localisation :</strong> {parcelle.localisation}</p>
              <p><strong>Capteur :</strong>{" "} {parcelle.capteur ? parcelle.capteur.code : "Aucun capteur"}</p>
              {parcelle.capteur && (
              <p>{parcelle.capteur.humidite} % • {parcelle.capteur.temperature} °C</p>)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}