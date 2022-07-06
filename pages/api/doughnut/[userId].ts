import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { calculateTransactions, transactionStartDate } from "../../../Utils";
import { DoughnutChart } from "../../../Types/index";
import prisma from "../../../prismaClient";

prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DoughnutChart>
) {
  try {
    const userId = req.query;
    const period = req.body;
    if (Object.values(userId).length > 2) {
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
    const revenueTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount > 0;
    });
    const costTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount < 0;
    });
    const groupedRevenueByCategory = _(revenueTransactions)
      .groupBy((transactions) => transactions.category?.category)
      .entries();
    const groupedCostByCategory = _(costTransactions)
      .groupBy((transactions) => transactions.category?.category)
      .entries();

    const revenueCategories = groupedRevenueByCategory.map((group) => group[0]);
    const costCategories = groupedCostByCategory.map((group) => group[0]);

    const revenueData = groupedRevenueByCategory.map((group) => {
      return (
        Math.round((calculateTransactions(group[1]) + Number.EPSILON) * 100) /
        100
      );
    });

    const costData = groupedCostByCategory.map((group) => {
      return (
        Math.round((calculateTransactions(group[1]) + Number.EPSILON) * 100) /
        100
      );
    });

    const data = [
      {
        labels: revenueCategories,
        data: revenueData,
        title: "Revenue Breakdown",
      },
      {
        labels: costCategories,
        data: costData,
        title: "Cost Breakdown",
      },
    ];
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
  }
}
