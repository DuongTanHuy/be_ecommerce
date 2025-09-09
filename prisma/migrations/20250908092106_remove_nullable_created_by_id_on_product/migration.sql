/*
  Warnings:

  - Made the column `createdById` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
