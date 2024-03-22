-- DropForeignKey
ALTER TABLE "Feeding" DROP CONSTRAINT "Feeding_reptileId_fkey";

-- DropForeignKey
ALTER TABLE "HusbandryRecord" DROP CONSTRAINT "HusbandryRecord_reptileId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_reptileId_fkey";

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HusbandryRecord" ADD CONSTRAINT "HusbandryRecord_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
