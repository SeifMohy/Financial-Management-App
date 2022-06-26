// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import prisma from "../../../prismaClient";

prisma;

type Data = {
  transactions: Prisma.BatchPayload;
};

type Message = {
  transactions: string;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
//   function initialCategory(amount: number) {
//     if (amount < 0) {
//       return "2";
//     } else {
//       return "1";
//     }
//   }
  try {
    const userId = req.query;
    console.log(userId);
    if (Object.values(userId)[0].length < 10) {
      console.log("loading");
    } else {
      const id = Object.values(userId)[0];
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      // console.log(user);
      const send: any = {
        access_token: user?.accessToken,
        start_date: startDate,
        end_date: new Date().toLocaleDateString("en-CA"),
      };
      const response = await client.transactionsGet(send);
      const resTransactions = response.data.transactions;
      //TODO: Need to add bankID
      const transactionsToAdd = resTransactions.map((transaction) => {
        return {
          id: transaction.transaction_id,
          date: transaction.date,
          amount: transaction.amount,
          userId: id,
          description: transaction.name,
          categoryId: initialCategory(transaction.amount),
        };
      });
      const addTransactions = await prisma.transaction.createMany({
        data: transactionsToAdd,
      });
      res.json({ transactions: addTransactions });
    }
  } catch (error) {
    res.json({ transactions: "error" });
    console.log(error);
  }
}
