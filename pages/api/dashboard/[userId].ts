import type { NextApiRequest, NextApiResponse } from "next";
import { KeyFigures } from "../../../Types/index";
import prisma from "../../../prismaClient";
import {
  calculateTransactions,
  numberWithCommas,
  transactionStartDate,
} from "../../../Utils";

prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KeyFigures>
) {
  try {
    const userId = req.query;
    const period = req.body;
    if (Object.values(userId)[0].length < 10) {
      console.log("loading");
    }
    const id = Object.values(userId)[0];
    const requestedPeriod = Object.keys(period)[0];
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
    const dbTransactionsPP = await prisma.transaction.findMany({
      where: {
        userId: id as string,
        date: {
          lte: transactionStartDate(requestedPeriod, 1),
          gte: transactionStartDate(requestedPeriod, 2),
        },
      },
      include: {
        category: true,
      },
    });
    const revenueTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount > 0;
    });
    const revenueTransactionsPP = dbTransactionsPP.filter((transaction) => {
      return transaction.amount > 0;
    });
    const costTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount < 0;
    });
    const totalRevenue = calculateTransactions(revenueTransactions);
    const totalRevenuePP = calculateTransactions(revenueTransactionsPP);
    const totalCost = calculateTransactions(costTransactions);
    const data = [
      {
        name: "Total Revenue",
        pre: "EGP",
        pos: "",
        stat: numberWithCommas(Math.round(totalRevenue)),
      },
      {
        name: "Sales Growth",
        pre: "",
        pos: "%",
        stat:
          Math.round(
            (((totalRevenue - totalRevenuePP) / totalRevenuePP) * 100 +
              Number.EPSILON) *
              100
          ) / 100,
      },
      {
        name: "Gross Profit Margin",
        pre: "",
        pos: "%",
        stat:
          Math.round(
            (((totalRevenue - totalCost) / totalRevenue) * 100 + Number.EPSILON) *
              100
          ) / 100,
      },
    ];
    res.status(200).json({ keyFigures: data });
  } catch (error) {
    console.log(error);
  }
}
