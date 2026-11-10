import { prisma } from "@/lib/prisma";
import { formaterDate } from "@/lib/dates";
import { createCulture, affecterEmployes } from "./actions";

export const instant = false;

const STATUTS = ["Planifiée", "Semée", "En croissance", "Récoltée"];

const MESSAGES_ERREUR: Record<string, string> = {
  champs: "Veuillez remplir tous les champs avec des valeurs valides.",
  dates: "La date de récolte prévue doit être après la date de semis.",
  "parcelle-inexistante": "La parcelle choisie n'existe pas.",
  "employes-inexistants": "Un des employés choisis n'existe pas.",
  "culture-inexistante": "La culture choisie n'existe pas.",
  "aucun-employe": "Veuillez cocher au moins un employé à affecter.",
  technique: "Une erreur est survenue. Veuillez réessayer.",
};

const MESSAGES_SUCCES: Record<string, string> = {
  "1": "La culture a été ajoutée.",
  affectation: "Les employés ont été affectés à la culture.",
};

export default async function CulturesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { erreur, succes } = await searchParams;

  const parcelles = await prisma.parcelle.findMany({
    orderBy: { nom: "asc" },
  });

  const employes = await prisma.employe.findMany({
    orderBy: [{ nom: "asc" }, { prenom: "asc" }],
  });

  // Lecture 1 à N + N à N : chaque culture avec sa parcelle et ses employés
  const cultures = await prisma.culture.findMany({
    include: { parcelle: true, employes: true },
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h1>Cultures</h1>

      {erreur && (
        <p className="message-erreur">
          {MESSAGES_ERREUR[erreur] ?? MESSAGES_ERREUR.technique}
        </p>
      )}
      {succes && MESSAGES_SUCCES[succes] && (
        <p className="message-succes">{MESSAGES_SUCCES[succes]}</p>
      )}

      <div className="mise-en-page">
        <form action={createCulture} className="formulaire">
          <h2>Ajouter une culture</h2>

          <div className="champ">
            <label htmlFor="nom">Nom de la culture</label>
            <input
              id="nom"
              name="nom"
              type="text"
              placeholder="Ex. : Tomates"
              required
            />
          </div>

          <div className="champ">
            <label htmlFor="dateSemis">Date de semis</label>
            <input id="dateSemis" name="dateSemis" type="date" required />
          </div>

          <div className="champ">
            <label htmlFor="dateRecoltePrevue">Date de récolte prévue</label>
            <input
              id="dateRecoltePrevue"
              name="dateRecoltePrevue"
              type="date"
              required
            />
          </div>

          <div className="champ">
            <label htmlFor="statut">Statut</label>
            <select id="statut" name="statut" required defaultValue="">
              <option value="" disabled>
                Choisir un statut
              </option>
              {STATUTS.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </div>

          <div className="champ">
            <label htmlFor="parcelleId">Parcelle</label>
            {parcelles.length === 0 ? (
              <p className="vide">
                Aucune parcelle disponible. Créez d&apos;abord une parcelle.
              </p>
            ) : (
              <select id="parcelleId" name="parcelleId" required defaultValue="">
                <option value="" disabled>
                  Choisir une parcelle
                </option>
                {parcelles.map((parcelle) => (
                  <option key={parcelle.id} value={parcelle.id}>
                    {parcelle.nom} ({parcelle.localisation})
                  </option>
                ))}
              </select>
            )}
          </div>

          <fieldset className="cases">
            <legend>Employés affectés (optionnel)</legend>
            {employes.length === 0 ? (
              <p className="vide">Aucun employé disponible.</p>
            ) : (
              employes.map((employe) => (
                <label key={employe.id} className="case">
                  <input type="checkbox" name="employeIds" value={employe.id} />
                  {employe.prenom} {employe.nom} ({employe.specialite})
                </label>
              ))
            )}
          </fieldset>

          <button
            type="submit"
            className="bouton"
            disabled={parcelles.length === 0}
          >
            Ajouter la culture
          </button>
        </form>

        <section className="zone-liste">
          <h2>Liste des cultures ({cultures.length})</h2>

          {cultures.length === 0 ? (
            <p className="vide">Aucune culture pour le moment.</p>
          ) : (
            <ul className="grille">
              {cultures.map((culture) => {
                // Employés pas encore affectés à cette culture
                const employesDisponibles = employes.filter(
                  (employe) =>
                    !culture.employes.some((affecte) => affecte.id === employe.id),
                );

                return (
                  <li key={culture.id} className="carte">
                    <h3>{culture.nom}</h3>
                    <p><strong>Parcelle :</strong> {culture.parcelle.nom}</p>
                    <p><strong>Statut :</strong> {culture.statut}</p>
                    <p><strong>Semis :</strong> {formaterDate(culture.dateSemis)}</p>
                    <p>
                      <strong>Récolte prévue :</strong>{" "}
                      {formaterDate(culture.dateRecoltePrevue)}
                    </p>

                    <div className="sous-liste">
                      <strong>Employés ({culture.employes.length}) :</strong>
                      {culture.employes.length === 0 ? (
                        <p className="vide">Aucun employé affecté</p>
                      ) : (
                        <ul>
                          {culture.employes.map((employe) => (
                            <li key={employe.id}>
                              {employe.prenom} {employe.nom} ({employe.specialite})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {employesDisponibles.length > 0 && (
                      <form action={affecterEmployes} className="sous-liste">
                        <input type="hidden" name="cultureId" value={culture.id} />
                        <fieldset className="cases">
                          <legend>Affecter d&apos;autres employés</legend>
                          {employesDisponibles.map((employe) => (
                            <label key={employe.id} className="case">
                              <input
                                type="checkbox"
                                name="employeIds"
                                value={employe.id}
                              />
                              {employe.prenom} {employe.nom}
                            </label>
                          ))}
                        </fieldset>
                        <button type="submit" className="bouton">
                          Affecter
                        </button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}