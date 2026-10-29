-- CreateTable
CREATE TABLE "Capteur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "humidite" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "parcelleId" INTEGER NOT NULL,
    CONSTRAINT "Capteur_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Culture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "dateSemis" DATETIME NOT NULL,
    "dateRecoltePrevue" DATETIME NOT NULL,
    "statut" TEXT NOT NULL,
    "parcelleId" INTEGER NOT NULL,
    CONSTRAINT "Culture_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CultureToEmploye" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CultureToEmploye_A_fkey" FOREIGN KEY ("A") REFERENCES "Culture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CultureToEmploye_B_fkey" FOREIGN KEY ("B") REFERENCES "Employe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Capteur_parcelleId_key" ON "Capteur"("parcelleId");

-- CreateIndex
CREATE UNIQUE INDEX "_CultureToEmploye_AB_unique" ON "_CultureToEmploye"("A", "B");

-- CreateIndex
CREATE INDEX "_CultureToEmploye_B_index" ON "_CultureToEmploye"("B");
