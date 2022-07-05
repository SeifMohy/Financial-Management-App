-- CreateTable
CREATE TABLE "UserItems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "UserItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserItems" ADD CONSTRAINT "UserItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
