/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Schedule_orderNumber_startTime_key";

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_orderNumber_key" ON "Schedule"("orderNumber");
