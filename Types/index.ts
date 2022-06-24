import { Category, Transaction } from "@prisma/client";

export type DBTransactions = {
  transactions: (Transaction & {
    category: Category | null;
  })[];
  movements: {
    name: string;
    pre: string;
    pos: string;
    stat: number;
}[]
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

export type DoughnutChart = {
  data: {
    labels: _.Collection<string>;
    data: _.Collection<number>;
    title: string;
  }[];
};
