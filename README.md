# Les Jardins du Soleil — Gestion d'une ferme maraîchère

**Étudiant :** Irénée Parfait Akakpo
**Cours :** Programmation avancée — TP2
**Collège :** Cégep de La Pocatière

## Description

Application Web permettant au gestionnaire d'une ferme maraîchère de centraliser
ses parcelles, ses cultures, ses employés et ses capteurs, et de visualiser les
liens entre ces données. Les données sont enregistrées dans une base SQLite
via Prisma.

**Technologies :** Next.js (App Router), TypeScript, Prisma ORM 7, SQLite.

## Installation et démarrage

Prérequis : Node.js et npm.

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement (copie de l'exemple fourni)
#    Windows (PowerShell) : copy .env.example .env
#    macOS / Linux        : cp .env.example .env

# 3. Appliquer les migrations (crée la base SQLite)
npx prisma migrate dev

# 4. Générer le client Prisma
npx prisma generate

# 5. Charger le jeu de données de départ
npx prisma db seed

# 6. Démarrer l'application
npm run dev
```

L'application est ensuite accessible à l'adresse http://localhost:3000.

### Commande de migration

```bash
npx prisma migrate dev
```

Les migrations sont conservées dans le dossier `prisma/migrations/`. Pour
recréer entièrement la base puis la repeupler :

```bash
npx prisma migrate reset
npx prisma db seed
```

### Dépannage

Si une erreur indique que le module `better-sqlite3` est introuvable, exécuter
`npm rebuild better-sqlite3`.

## Jeu de données

Le script `prisma/seed.ts` crée 3 parcelles, 4 employés, 4 cultures et
2 capteurs. Attention : il vide les tables avant d'insérer les données.

Il démontre les trois types de relations :

- **1-1 (Parcelle — Capteur)** : les parcelles Nord et Sud ont un capteur,
  la parcelle Est n'en a pas.
- **1-N (Parcelle — Culture)** : la parcelle Nord accueille deux cultures.
- **N-N (Culture — Employé)** : Marie et Luc participent chacun à deux cultures.

## Modèle de données

| Relation | Cardinalité | Implémentation Prisma |
|---|---|---|
| Parcelle — Capteur | 1 à 0..1 | `parcelleId` avec `@unique` dans `Capteur` |
| Parcelle — Culture | 1 à N | `parcelleId` dans `Culture` |
| Culture — Employé | N à N | relation implicite (table de jonction `_CultureToEmploye`) |

## Fonctionnalités réalisées

**Partie 1**
- Navigation commune (Accueil, Parcelles, Cultures, Employés, Capteurs) dans `layout.tsx`
- Configuration de Prisma avec SQLite et migration initiale
- Création et lecture des parcelles
- Création et lecture des employés

**Partie 2**
- Schéma relationnel complet (Parcelle, Capteur, Culture, Employe)
- Création d'un capteur en choisissant une parcelle existante, avec
  contrainte d'unicité (une parcelle ne peut pas avoir deux capteurs)
- Affichage du capteur associé à chaque parcelle
- Création d'une culture en choisissant une parcelle existante
- Affichage des cultures de chaque parcelle
- Affectation de plusieurs employés à une culture (à la création et après coup)
- Affichage des employés d'une culture et des cultures d'un employé
- Validation des champs et messages d'erreur compréhensibles
  (aucune erreur Prisma brute affichée)
- Page d'accueil avec compteurs, interface cohérente et responsive
- Logo de la ferme (aussi utilisé comme icône d'onglet) et pied de page commun

## Structure du projet

```
app/
├── layout.tsx            Mise en page commune (navigation, pied de page)
├── page.tsx              Accueil
├── icon.svg              Icône de l'onglet
├── components/           Navigation (lien de la page active) et logo
├── parcelles/            Page + actions serveur
├── cultures/             Page + actions serveur
├── employes/             Page + actions serveur
└── capteurs/             Page + actions serveur
lib/
├── prisma.ts             Client Prisma partagé
└── dates.ts              Formatage des dates
prisma/
├── schema.prisma         Modèles et relations
├── migrations/           Migrations SQLite
└── seed.ts               Jeu de données

```
