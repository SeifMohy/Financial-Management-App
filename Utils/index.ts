import { Transaction } from "@prisma/client";

export function transactionStartDate(time: string, pp: number) {
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

export   function calculateTransactions(transactions: Transaction[]) {
    let totalRevenue = 0;
    for (const transaction of transactions) {
      totalRevenue += transaction.amount;
    }
    return totalRevenue;
  }