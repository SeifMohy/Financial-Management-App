-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankId" TEXT;

-- CreateTable
CREATE TABLE "_transaction-category" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_transaction-category_AB_unique" ON "_transaction-category"("A", "B");

-- CreateIndex
CREATE INDEX "_transaction-category_B_index" ON "_transaction-category"("B");

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transaction-category" ADD CONSTRAINT "_transaction-category_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transaction-category" ADD CONSTRAINT "_transaction-category_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
