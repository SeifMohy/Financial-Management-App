/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accessToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT;
