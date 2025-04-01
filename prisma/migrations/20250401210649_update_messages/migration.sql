/*
  Warnings:

  - You are about to drop the column `userId` on the `Wmessage` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wmessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Wmessage" ("active", "createdAt", "id", "message", "updatedAt") SELECT "active", "createdAt", "id", "message", "updatedAt" FROM "Wmessage";
DROP TABLE "Wmessage";
ALTER TABLE "new_Wmessage" RENAME TO "Wmessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
