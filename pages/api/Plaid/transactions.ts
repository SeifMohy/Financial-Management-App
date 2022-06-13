import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  TransactionsSyncResponse,
} from "plaid";
import { useContext } from "react";
import Context from "../../../Context";

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
const {
    accessToken,
  } = useContext(Context);
  console.log(accessToken)

const client = new PlaidApi(configuration);

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
  next: ((reason: any) => PromiseLike<never>) | null | undefined
) {
  //TODO: 13. transactions api call
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
      while (hasMore) {
        const request: any = {
          access_token: accessToken? accessToken: "",
          cursor: cursor,
        };

        const response = await client.transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        cursor = data.next_cursor;
      }

      const compareTxnsByDateAscending = (a: any, b: any) => (a.date > b.date) - (a.date < b.date); //TODO: Amend Type
      // Return the 8 most recent transactions
      const recently_added = [...added]
        .sort(compareTxnsByDateAscending)
        .slice(-30);
      response.json({ latest_transactions: recently_added });
    })
    .catch(next);
}
