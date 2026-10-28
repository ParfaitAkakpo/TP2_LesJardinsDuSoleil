import { prisma } from "@/lib/prisma";
import { createEmploye } from "./actions";

export default async function page() {
  const employes = await prisma.employe.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h1>Employés</h1>

      <form action={createEmploye} className="formulaire">
        <h2>Ajouter un employé</h2>

        <div className="champ">
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" required />
        </div>

        <div className="champ">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" required />
        </div>

        <div className="champ">
          <label htmlFor="specialite">Spécialité</label>
          <input
            id="specialite"
            name="specialite"
            type="text"
            placeholder="Ex. : irrigation, récolte, entretien"
            required
          />
        </div>

        <button type="submit" className="bouton">
          Ajouter l&apos;employé
        </button>
      </form>

      <h2>Liste des employés ({employes.length})</h2>

      {employes.length === 0 ? (
        <p className="vide">Aucun employé pour le moment.</p>
      ) : (
        <ul className="grille">
          {employes.map((employe) => (
            <li key={employe.id} className="carte">
              <h3>
                {employe.prenom} {employe.nom}
              </h3>
              <p>
                <strong>Spécialité :</strong> {employe.specialite}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}