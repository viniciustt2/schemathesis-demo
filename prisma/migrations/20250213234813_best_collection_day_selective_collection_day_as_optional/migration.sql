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
    "bestCollectionDay" TEXT,
    "responsible" TEXT,
    "selectiveCollectionDay" TEXT,
    "weeklyGlassVolume" REAL,
    "relevantInfos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "operatorId" TEXT NOT NULL,
    CONSTRAINT "CollectionPoints_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CollectionPoints" ("address", "bestCollectionDay", "contact", "createdAt", "id", "name", "operatorId", "relevantInfos", "responsible", "selectiveCollectionDay", "shifts", "status", "type", "updatedAt", "weeklyGlassVolume") SELECT "address", "bestCollectionDay", "contact", "createdAt", "id", "name", "operatorId", "relevantInfos", "responsible", "selectiveCollectionDay", "shifts", "status", "type", "updatedAt", "weeklyGlassVolume" FROM "CollectionPoints";
DROP TABLE "CollectionPoints";
ALTER TABLE "new_CollectionPoints" RENAME TO "CollectionPoints";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
