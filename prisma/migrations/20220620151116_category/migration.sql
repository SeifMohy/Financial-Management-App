/*
  Warnings:

  - You are about to drop the `_transaction-category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_transaction-category" DROP CONSTRAINT "_transaction-category_A_fkey";

-- DropForeignKey
ALTER TABLE "_transaction-category" DROP CONSTRAINT "_transaction-category_B_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "categotyId" TEXT;

-- DropTable
DROP TABLE "_transaction-category";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categotyId_fkey" FOREIGN KEY ("categotyId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
