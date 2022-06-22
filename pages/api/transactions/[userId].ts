// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { DBTransactions } from "../../../Types/index";

type Message = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | DBTransactions>
) {
  try {
    const userId = req.query;
    // console.log(userId);
    if (Object.values(userId).length > 2) {
      console.log("loading");
    }
    const id = Object.values(userId)[0];
    // console.log(id);
    const dbTransactions = await prisma.transaction.findMany({
      where: { userId: id as string },
      include: {
        category: true,
      },
    });

    res.status(200).json({ transactions: dbTransactions });
  } catch (error) {
    // console.log(error);
  }
}
