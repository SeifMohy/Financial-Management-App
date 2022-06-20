import { Category, Transaction } from "@prisma/client";

export type DBTransactions = {
  transactions: (Transaction & {
    category: Category | null;
  })[];
};

export type transactionWCategory ={
  transaction: Transaction & {
    category: Category | null;
  };
}