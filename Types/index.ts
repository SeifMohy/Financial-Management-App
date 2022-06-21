import { Category, Transaction } from "@prisma/client";

export type DBTransactions = {
  transactions: (Transaction & {
    category: Category | null;
  })[];
};

export type transactionWCategory = {
  transaction: Transaction & {
    category: Category | null;
  };
};

export type Categories = {
  data: Category[];
};

export type KeyFigures = {
  keyFigures: {
    name: string;
    pre: string;
    pos: string;
    stat: number;
  }[];
};
