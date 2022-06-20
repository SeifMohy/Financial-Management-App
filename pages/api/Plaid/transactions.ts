import { getUser } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  TransactionsSyncResponse,
} from "plaid";
import prisma from "../../../prismaClient";

prisma;

//TODO: 3. setting .env variables to consts
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
let ACCESS_TOKEN: any | string = null;

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

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
  next: ((reason: any) => PromiseLike<never>) | null | undefined
) {
  Promise.resolve()
    .then(async function () {
      // Set cursor to empty to receive all historical updates
      let cursor = null;
      // New transaction updates since "cursor"
      //TODO: Amend any types
      let added: any = [];
      let modified: any = [];
      // Removed transaction ids
      let removed: any = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      function initialCategory(amount: number) {
        if (amount < 0) {
          return "2";
        } else {
          return "1";
        }
      }
      while (hasMore) {
        const userId = request.body;
        if (Object.keys(userId).length > 2) {
          console.log("loading");
        } else {
          const id = Object.keys(userId)[0];
          const user = await prisma.user.findUnique({
            where: { id: id },
          });
          console.log(user);
          const send: any = {
            access_token: user?.accessToken,
            cursor: cursor,
          };

          const response = await client.transactionsSync(send); //TODO: make it for a month
          const data = response.data;
          // Add this page of results
          added = added.concat(data.added);
          modified = modified.concat(data.modified);
          removed = removed.concat(data.removed);
          hasMore = data.has_more;
          // Update cursor to the next cursor
          cursor = data.next_cursor;
        }

        //TODO: this should stop duplicates
        const compareTxnsByDateAscending = (a: any, b: any) =>
          (a.date > b.date) - (a.date < b.date); //TODO: Amend Type
        // Return the 8 most recent transactions
        const recently_added = [...added]
          .sort(compareTxnsByDateAscending)
          .slice(-8);
        response.json({ latest_transactions: recently_added });

        const id = Object.keys(userId)[0];
        //TODO: Need to add bankID
        const transactionsToAdd = recently_added.map((transaction) => {
          return {
            id: transaction.transaction_id,
            date: transaction.date,
            amount: transaction.amount,
            userId: id,
            description: transaction.name,
            categoryId: initialCategory(transaction.amount),
          };
        });

        //adding the data created
        const addTransactions = await prisma.transaction.createMany({
          data: transactionsToAdd,
        });
        response.json({ addTransactions });
      }
    })
    .catch(next);
}
