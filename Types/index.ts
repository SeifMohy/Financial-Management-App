import { Transaction } from "@prisma/client";


export type DBTransactions = {
    transactions: Transaction[];
  };