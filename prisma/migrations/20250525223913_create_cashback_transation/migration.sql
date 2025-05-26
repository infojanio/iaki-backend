-- CreateEnum
CREATE TYPE "CashbackTransactionType" AS ENUM ('RECEIVE', 'USE');

-- AlterTable
ALTER TABLE "cashbacks" ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "credited_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "cashback_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "CashbackTransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cashback_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cashback_transactions" ADD CONSTRAINT "cashback_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
