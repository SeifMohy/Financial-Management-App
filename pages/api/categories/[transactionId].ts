// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: Transaction;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const transactionId = req.query;
    const categoryId = req.body;
    const updatedCategoryId = Object.keys(categoryId)[0];
    const id = Object.values(transactionId)[0];
    const transaction = await prisma.transaction.update({
      where: { id: id as string },
      data: { categoryId: updatedCategoryId },
    });
    console.log(transaction)
    res.status(200).json({ data: transaction });
  } catch (error) {
    console.log(error);
  }
}
