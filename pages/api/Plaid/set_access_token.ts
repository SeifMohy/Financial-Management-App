import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import type { NextApiRequest, NextApiResponse } from "next";

const APP_PORT = process.env.APP_PORT || 8000; //step: 3. setting .env variables to consts
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN: null | string = null;
let ITEM_ID = null;

const configuration = new Configuration({
  //step: 4. setting up header for sending data to plaid api
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
  //step: 11. the api call that creates access_token

  const { public_token } = request.body;
  // console.log(public_token);

  Promise.resolve()
    .then(async function () {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token,
      });
      // console.log(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;

      response.json({
        //This is the token that should be saved on server
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    })
    .catch(next);
}
