// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import transactions from "./Plaid/transactions";

type Data = {
  data: Category[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({ data: categories });
  } catch (error) {
    console.log(error);
  }
}
