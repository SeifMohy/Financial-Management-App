import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import type { NextApiRequest, NextApiResponse } from "next";

const APP_PORT = process.env.APP_PORT || 8000; //step: 3. setting .env variables to consts
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
) as Products[];

const PLAID_COUNTRY_CODES = (
  process.env.PLAID_COUNTRY_CODES || "US , UK"
).split(",") as CountryCode[];

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

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
export default async function createLinkToken(
  request: NextApiRequest,
  response: NextApiResponse,
  next: ((reason: any) => PromiseLike<never>) | null | undefined
) {
  //step: 5. creating link with plaid
  Promise.resolve()
    .then(async function () {
      const configs: LinkTokenCreateRequest = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: "user-id",
        },
        client_name: "Plaid Quickstart",
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: "en",
        webhook: process.env.WEBHOOK_URL,
      };
      const createTokenResponse = await client.linkTokenCreate(configs); //TODO: type error
      // console.log(createTokenResponse.data)
      response.json(createTokenResponse.data);
    })
    .catch(next);
}
