/*
  Warnings:

  - You are about to drop the column `images` on the `SKU` table. All the data in the column will be lost.
  - Added the required column `image` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SKU" DROP COLUMN "images",
ADD COLUMN     "image" TEXT NOT NULL;
