/*
  Warnings:

  - You are about to drop the column `chashback_percentage` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cashback_transactions" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discount_applied" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "chashback_percentage",
ADD COLUMN     "cashback_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AddForeignKey
ALTER TABLE "cashback_transactions" ADD CONSTRAINT "cashback_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
