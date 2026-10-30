import { prisma } from "@/lib/prisma";
import { createEmploye } from "./actions";

export const instant = false;

const MESSAGES_ERREUR: Record<string, string> = {
  champs: "Veuillez remplir le prénom, le nom et la spécialité.",
  technique: "Impossible d'enregistrer l'employé. Veuillez réessayer.",
};

export default async function EmployesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { erreur, succes } = await searchParams;

  const employes = await prisma.employe.findMany({
    orderBy: { id: "desc" },
    include: {
      cultures: {
        include: { parcelle: true },
      },
    },
  });

  return (
    <div>
      <h1>Employés</h1>
      {erreur && (
        <p className="message-erreur">
            {MESSAGES_ERREUR[erreur] ?? MESSAGES_ERREUR.technique}
        </p>
      )}
      {succes && <p className="message-succes">L&apos;employé a été ajouté.</p>}

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

              <div className="sous-liste">
                <strong>Cultures ({employe.cultures.length}) :</strong>
                {employe.cultures.length === 0 ? (
                  <p className="vide">Aucune culture</p>
                ) : (
                  <ul>
                    {employe.cultures.map((culture) => (
                      <li key={culture.id}>
                        {culture.nom} ({culture.parcelle.nom}), {culture.statut}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}