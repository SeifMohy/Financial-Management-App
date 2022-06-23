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
  function transactionStartDate(time: string) {
    switch (time) {
      case "1 week":
        var today = new Date();
        var oneWeekFromNow = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        return oneWeekFromNow.toLocaleDateString("en-CA");
      case "1 month":
        var oneMonthsFromNow = new Date();
        oneMonthsFromNow.setMonth(oneMonthsFromNow.getMonth() - 1);
        return oneMonthsFromNow.toLocaleDateString("en-CA");
      case "3 months":
        var threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() - 3);
        return threeMonthsFromNow.toLocaleDateString("en-CA");
      default:
        var sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() - 6);
        return sixMonthsFromNow.toLocaleDateString("en-CA");
    }
  }
  try {
    const userId = req.query;
    const period = req.body;
    console.log(transactionStartDate("1 week"));
    // console.log(Object.keys(period)[0]);
    // console.log(Object.values(userId)[0])
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
          gte: transactionStartDate(requestedPeriod),
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
        name: "Total Revenue",
        pre: "EGP",
        pos: "",
        stat: Math.round(totalRevenue),
      },
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
