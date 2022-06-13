import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import type { NextApiRequest, NextApiResponse } from 'next';

const APP_PORT = process.env.APP_PORT || 8000; //TODO: 3. setting .env variables to consts
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
    ',',
  );
  
  const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US , UK').split(
    ',',
  );
  
const configuration = new Configuration({ //TODO: 4. setting up header for sending data to plaid api
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  });
  
  const client = new PlaidApi(configuration);

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
export default async function (request: NextApiRequest, response:NextApiResponse, next: ((reason: any) => PromiseLike<never>) | null | undefined) { //TODO: 5. creating link with plaid
  Promise.resolve()
    .then(async function () {
      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'user-id',
        },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
      };
      const createTokenResponse = await client.linkTokenCreate(configs); //TODO: type error
      console.log(createTokenResponse.data)
      response.json(createTokenResponse.data); //this works
    })
    .catch(next);
};
