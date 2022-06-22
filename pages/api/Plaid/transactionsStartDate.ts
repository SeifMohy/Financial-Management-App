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

//TODO: 3. setting .env variables to consts
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  //TODO: 4. setting up header for sending data to plaid api
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Message>
) {
  function initialCategory(amount: number) {
    if (amount < 0) {
      return "2";
    } else {
      return "1";
    }
  }
  try {
    const data = req.body;
    const userId = Object.keys(data)[0].split(",")[0];
    const startDate = Object.keys(data)[0].split(",")[1];
    console.log(userId, startDate);
    if (userId.length < 3) {
      console.log("loading");
    } else {
      const id = userId;
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
