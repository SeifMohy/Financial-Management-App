/*
  Warnings:

  - You are about to drop the column `categotyId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categotyId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "categotyId",
ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
