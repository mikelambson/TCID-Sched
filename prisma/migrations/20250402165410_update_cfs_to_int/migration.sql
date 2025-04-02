/*
  Warnings:

  - You are about to alter the column `cfs` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "mainLateral" TEXT NOT NULL,
    "cfs" INTEGER NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "lineHead" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Schedule" ("cfs", "createdAt", "district", "id", "lineHead", "mainLateral", "orderNumber", "startTime", "status", "updatedAt") SELECT "cfs", "createdAt", "district", "id", "lineHead", "mainLateral", "orderNumber", "startTime", "status", "updatedAt" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
