// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { KeyFigures } from "../../../Types/index";
import prisma from "../../../prismaClient";

prisma;

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
  function transactionStartDate(time: string, pp: number) {
    switch (time) {
      case "1 week":
        var today = new Date();
        var oneWeekFromNow = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000 * pp
        );
        return oneWeekFromNow.toLocaleDateString("en-CA");
      case "1 month":
        var oneMonthsFromNow = new Date();
        oneMonthsFromNow.setMonth(oneMonthsFromNow.getMonth() - 1 * pp);
        return oneMonthsFromNow.toLocaleDateString("en-CA");
      case "3 months":
        var threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() - 3 * pp);
        return threeMonthsFromNow.toLocaleDateString("en-CA");
      default:
        var sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() - 6 * pp);
        return sixMonthsFromNow.toLocaleDateString("en-CA");
    }
  }
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
          lte: transactionStartDate(requestedPeriod, 1), //the start
          gte: transactionStartDate(requestedPeriod, 2), //the end
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
    console.log(totalRevenue);
    const totalRevenuePP = calculateTransactions(revenueTransactionsPP);
    console.log(totalRevenuePP);
    const totalCost = calculateTransactions(costTransactions);
    const data = [
      {
        name: "Total Revenue",
        pre: "EGP",
        pos: "",
        stat: Math.round(totalRevenue),
      },
      {
        name: "Sales Growth",
        pre: "",
        pos: "%",
        stat:
          Math.round(
            ((totalRevenue - totalRevenuePP) / totalRevenuePP +
              Number.EPSILON) *
              100
          ) / 100,
      },
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
