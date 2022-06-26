import { Prisma, Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import prisma from "../../../prismaClient";

prisma;

type Data = {
  transaction: Transaction;
};

type Message = {
  transaction: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Message>
) {
  try {
    const userId = req.query;
    const transaction = req.body;
    console.log(userId);
    console.log(transaction);
    if (Object.values(userId)[0].length < 10) {
      console.log("loading");
    } else {
      const id = Object.values(userId)[0];
      const category = await prisma.category.findFirst({
        where: { category: transaction.category },
      });
      const addTransaction = await prisma.transaction.create({
        data: {
          date: transaction.date,
          amount: transaction.amount,
          userId: id as string,
          description: transaction.name,
          categoryId: category?.id,
        },
      });
      res.json({ transaction: addTransaction });
    }
  } catch (error) {
    res.json({ transaction: "error" });
    console.log(error);
  }
}
