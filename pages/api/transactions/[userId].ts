import type { NextApiRequest, NextApiResponse } from "next";
import { DBTransactions } from "../../../Types/index";
import {
  calculateTransactions,
  numberWithCommas,
  transactionStartDate,
} from "../../../Utils";

type Message = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | DBTransactions>
) {
  try {
    const userId = req.query;
    const period = req.body;
    if (Object.values(userId).length > 2) {
      console.log("loading");
    }
    const id = Object.values(userId)[0];
    const requestedPeriod = Object.keys(period)[0];
    console.log(requestedPeriod);
    const dbTransactions = await prisma.transaction.findMany({
      where: {
        userId: id as string,
        date: {
          lte: new Date().toLocaleDateString("en-CA"),
          gte: transactionStartDate(requestedPeriod, 1),
        },
      },
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
      {
        name: "Net Movements",
        pre: "EGP",
        pos: "",
        stat: numberWithCommas(
          Math.round((totalCost + totalRevenue + Number.EPSILON) * 100) / 100
        ),
      },
      {
        name: "Total Credit Movements",
        pre: "EGP",
        pos: "",
        stat: numberWithCommas(totalRevenue),
      },
      {
        name: "Total Debit Movements",
        pre: "EGP",
        pos: "",
        stat: numberWithCommas(totalCost),
      },
    ];

    res.status(200).json({ transactions: dbTransactions, movements: data });
  } catch (error) {
    // console.log(error);
  }
}
