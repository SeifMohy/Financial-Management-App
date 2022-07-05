import { AxiosResponse } from "axios";
import { includes } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Transaction,
  TransactionsGetResponse,
} from "plaid";
import prisma from "../../../prismaClient";
import { PlaidGetTransactionWithDate } from "../../../Types/index";
import { initialCategory, transactionStartDate } from "../../../Utils";

type Message = {
  msg: string;
};

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

async function addTransactionsToDB(
  transactions: any,
  userId: string,
  itemId: string
) {
  const transactionsToAdd = transactions.map((transaction: any) => {
    return {
      id: transaction.transaction_id,
      date: transaction.date,
      amount: transaction.amount,
      userId: userId,
      description: transaction.name,
      categoryId: initialCategory(transaction.amount),
      itemId: itemId,
    };
  });
  const addTransactions = await prisma.transaction.createMany({
    data: transactionsToAdd,
  });
  return addTransactions;
}

async function filterTransactionsFromDB(transactions: any, itemId: string) {
  const dbTransactions = await prisma.transaction.findMany({
    where: { itemId },
  });
  const dbTransactionIds = dbTransactions.map((transaction) => transaction.id);
  let transactionsToAdd: any = [];
  for (let transaction of transactions) {
    if (dbTransactionIds.includes(transaction.transaction_id)) {
    } else {
      transactionsToAdd.push(transaction);
    }
  }
  // console.log("transactionstoAdd", transactionsToAdd);
  return transactionsToAdd;
}
const client = new PlaidApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  console.log({ body: req.body });
  const response = req.body.webhook_code;
  const itemId = req.body.item_id;
  const item = await prisma.userItems.findFirst({
    where: { itemId: itemId as string },
  });
  if (!item) {
    return res.status(404).json({ msg: "no user found" });
  }
  const userId = item?.userId;
  const accessToken = item?.accessToken;
  const endDate = new Date().toLocaleDateString("en-CA");
  switch (response) {
    case "INITIAL_UPDATE":
      const sendIU: PlaidGetTransactionWithDate = {
        access_token: accessToken,
        start_date: transactionStartDate("1 month", 1),
        end_date: new Date().toLocaleDateString("en-CA"),
      };
      const oneMonthTransactions = await client.transactionsGet(sendIU);
      const monthTransactions = oneMonthTransactions.data.transactions;
      addTransactionsToDB(monthTransactions, userId, itemId);
      res.status(200).json({ msg: "Initial Update" });
      break;
    case "HISTORICAL_UPDATE":
      const sendHU: PlaidGetTransactionWithDate = {
        access_token: accessToken,
        start_date: transactionStartDate("all", 2),
        end_date: new Date().toLocaleDateString("en-CA"),
      };
      const twoYearMonthTransactions = await client.transactionsGet(sendHU);
      const historicalTransactions = twoYearMonthTransactions.data.transactions;
      const newTransactions = await filterTransactionsFromDB(
        historicalTransactions,
        itemId
      );
      addTransactionsToDB(newTransactions, userId, itemId);
      res.status(200).json({ msg: "Historical Update" });
      break;
    default:
      const sendU: PlaidGetTransactionWithDate = {
        access_token: accessToken,
        start_date: transactionStartDate("1 month", 1),
        end_date: new Date().toLocaleDateString("en-CA"),
      };
      const updatedTransactionsResponse = await client.transactionsGet(sendU);
      const updatedTransactions = updatedTransactionsResponse.data.transactions;
      const newUpdatedTransactions = await filterTransactionsFromDB(
        updatedTransactions,
        itemId
      );
      addTransactionsToDB(newUpdatedTransactions, userId, itemId);
      res.status(200).json({ msg: "Updated Transactions" });
  }
}
