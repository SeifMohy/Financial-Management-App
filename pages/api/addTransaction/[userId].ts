import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import prisma from "../../../prismaClient";
import { checkAmountType } from "../../../Utils";
import moment from "moment"

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
          date: transaction.date.split("/").reverse().join("-"),
          // moment(new Date(transaction.date)).format("YYYY-MM-DD"),
          amount: checkAmountType(transaction, category),
          userId: id as string,
          description: transaction.description,
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
