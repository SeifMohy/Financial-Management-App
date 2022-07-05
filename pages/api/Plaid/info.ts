import type { NextApiRequest, NextApiResponse } from "next";

let ITEM_ID: null | any = null;
let ACCESS_TOKEN: null | any = null;
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);

export default async function info(
  request: NextApiRequest,
  response: NextApiResponse,
  next: ((reason: any) => PromiseLike<never>) | null | undefined
) {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
}
