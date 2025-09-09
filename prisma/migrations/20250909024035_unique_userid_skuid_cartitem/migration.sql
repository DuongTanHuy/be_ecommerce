/*
  Warnings:

  - The values [PENDING_CONFIRMATION] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrderStatus_new" AS ENUM ('PENDING_PAYMENT', 'PENDING_PICKUP', 'PENDING_DELIVERY', 'DELIVERED', 'RETURNED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" TYPE "public"."OrderStatus_new" USING ("status"::text::"public"."OrderStatus_new");
ALTER TYPE "public"."OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "public"."OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
COMMIT;

-- CreateIndex
CREATE INDEX "CartItem_userId_skuId_idx" ON "public"."CartItem"("userId", "skuId");
