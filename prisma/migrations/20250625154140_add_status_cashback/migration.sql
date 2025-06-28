-- CreateEnum
CREATE TYPE "CashbackStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- AlterTable
ALTER TABLE "cashbacks" ADD COLUMN     "status" "CashbackStatus" NOT NULL DEFAULT 'PENDING';
