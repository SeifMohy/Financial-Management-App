import type { NextApiRequest, NextApiResponse } from "next";
import _, { map } from "lodash";
import { calculateTransactions, months, transactionStartDate } from "../../../Utils";
import prisma from "../../../prismaClient";
import { LineChartType } from "../../../Types/index";

prisma;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LineChartType>
) {
  try {
    const userId = req.query;
    console.log(userId);
    if (Object.values(userId).length > 2) {
      console.log("loading line");
    }
    const id = Object.values(userId)[0];
    const dbTransactions = await prisma.transaction.findMany({
      where: {
        userId: id as string,
      },
    });

    const revenueTransactions = dbTransactions.filter((transaction) => {
      return transaction.amount > 0;
    });

    const sortedTransactions = revenueTransactions.sort(
      (a: any, b: any) =>
        new Date(a.date).valueOf() - new Date(b.date).valueOf()
    );
    const groupedRevenueByMonth = _(sortedTransactions)
      .groupBy((transactions) => transactions.date?.split("-")[1])
      .entries();

    const graphData = {
      labels: groupedRevenueByMonth.map((month) => months[+month[0] - 1]),
      data: groupedRevenueByMonth.map((month) =>
        calculateTransactions(month[1])
      ),
    };
    res.status(200).json({ data: graphData });
  } catch (error) {
    console.log(error);
  }
}
