// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";

type DoughnutChart = {
  data: {
    labels: _.Collection<string>;
    data: _.Collection<number>;
    title: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DoughnutChart>
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
