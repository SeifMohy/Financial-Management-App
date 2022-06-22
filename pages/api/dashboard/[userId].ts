// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { KeyFigures } from "../../../Types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KeyFigures>
) {
  function calculateTransactions(transactions: Transaction[]) {
    let totalRevenue = 0;
    for (const transaction of transactions) {
      totalRevenue += transaction.amount;
    }
    return totalRevenue;
  }
  try {
    const userId = req.query;
    if (Object.values(userId).length > 2) {
      console.log("loading");
    }
    const id = Object.values(userId)[0];
    const dbTransactions = await prisma.transaction.findMany({
      where: { userId: id as string },
      include: {
        category: true,
      },
    });
    const revenueTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount > 0;
    });
    const costTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount < 0;
    });
    const totalRevenue = calculateTransactions(revenueTransactions);
    const totalCost = calculateTransactions(costTransactions);
    const data = [
      { name: "Total Revenue", pre: "EGP", pos: "", stat: totalRevenue },
      { name: "Sales Growth", pre: "", pos: "%", stat: 0 },
      {
        name: "Gross Margin",
        pre: "",
        pos: "%",
        stat:
          Math.round((totalCost / totalRevenue + Number.EPSILON) * 100) / 100,
      },
    ];
    res.status(200).json({ keyFigures: data });
  } catch (error) {
    console.log(error);
  }
}
