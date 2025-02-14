/*
  Warnings:

  - You are about to drop the column `responsibleName` on the `CollectionPoints` table. All the data in the column will be lost.
  - You are about to drop the column `responsiblePhone` on the `CollectionPoints` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CollectionPoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "shifts" TEXT,
    "contact" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bestCollectionDay" TEXT NOT NULL,
    "responsible" TEXT,
    "selectiveCollectionDay" TEXT NOT NULL,
    "weeklyGlassVolume" REAL,
    "relevantInfos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "operatorId" TEXT NOT NULL,
    CONSTRAINT "CollectionPoints_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CollectionPoints" ("address", "bestCollectionDay", "contact", "createdAt", "id", "name", "operatorId", "relevantInfos", "selectiveCollectionDay", "shifts", "status", "type", "updatedAt", "weeklyGlassVolume") SELECT "address", "bestCollectionDay", "contact", "createdAt", "id", "name", "operatorId", "relevantInfos", "selectiveCollectionDay", "shifts", "status", "type", "updatedAt", "weeklyGlassVolume" FROM "CollectionPoints";
DROP TABLE "CollectionPoints";
ALTER TABLE "new_CollectionPoints" RENAME TO "CollectionPoints";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
