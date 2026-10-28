-- CreateTable
CREATE TABLE "Parcelle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "superficie" REAL NOT NULL,
    "typeSol" TEXT NOT NULL,
    "localisation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Employe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "specialite" TEXT NOT NULL
);
