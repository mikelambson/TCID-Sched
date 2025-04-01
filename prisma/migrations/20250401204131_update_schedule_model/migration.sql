/*
  Warnings:

  - You are about to drop the column `endTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `cfs` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineHead` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainLateral` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "mainLateral" TEXT NOT NULL,
    "cfs" DATETIME NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "lineHead" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Schedule" ("createdAt", "id", "startTime", "updatedAt") SELECT "createdAt", "id", "startTime", "updatedAt" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
