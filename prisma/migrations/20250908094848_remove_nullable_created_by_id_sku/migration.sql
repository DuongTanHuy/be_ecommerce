/*
  Warnings:

  - Made the column `createdById` on table `SKU` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."SKU" DROP CONSTRAINT "SKU_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."SKU" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SKU" ADD CONSTRAINT "SKU_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
