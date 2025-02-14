-- CreateTable
CREATE TABLE "Vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CollectionPoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "bestCollectionDay" TEXT NOT NULL,
    "bestTime" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "monitoringResponsible" TEXT NOT NULL,
    "selectiveCollectionDay" TEXT NOT NULL,
    "weeklyGlassVolume" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "operatorId" TEXT NOT NULL,
    CONSTRAINT "CollectionPoints_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionPointId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "volumeCollected" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collection_collectionPointId_fkey" FOREIGN KEY ("collectionPointId") REFERENCES "CollectionPoints" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Collection_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Routes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "totalDistanceKm" REAL NOT NULL,
    "totalTimeMs" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "executorId" TEXT,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "reasonFinished" TEXT,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Routes_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoutesCollectionPoints" (
    "routeId" TEXT NOT NULL,
    "collectionPointId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("routeId", "collectionPointId"),
    CONSTRAINT "RoutesCollectionPoints_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoutesCollectionPoints_collectionPointId_fkey" FOREIGN KEY ("collectionPointId") REFERENCES "CollectionPoints" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpjFile" TEXT,
    "municipalRegistrationFile" TEXT,
    "environmentalLicenseFile" TEXT,
    "operationLicenseFile" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_cnpj_key" ON "Operator"("cnpj");
