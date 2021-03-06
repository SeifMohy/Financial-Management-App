import { Transaction } from "@prisma/client";

export const getTransactionData = async (send: any) => {
  const response = await fetch(`/api/Plaid/transactionsStartDate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: send,
  });
  const data = await response.json();
};

export function startDate(transactions: any) {
  var sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() - 6);
  const startDate = transactions?.length
    ? transactions[0].date
    : sixMonthsFromNow.toLocaleDateString("en-CA");
  return startDate;
}

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
    case "6 months":
      var sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() - 6 * pp);
      return sixMonthsFromNow.toLocaleDateString("en-CA");
    default:
      var oneYearFromNow = new Date();
      oneYearFromNow.setMonth(oneYearFromNow.getMonth() - 24 * pp);
      return oneYearFromNow.toLocaleDateString("en-CA");
  }
}

export function calculateTransactions(transactions: Transaction[]) {
  let totalRevenue = 0;
  for (const transaction of transactions) {
    totalRevenue += transaction.amount;
  }
  return Math.round((totalRevenue + Number.EPSILON) * 100) / 100;
}

export const periodOptions = [
  { period: "1 week" },
  { period: "1 month" },
  { period: "3 months" },
  { period: "6 months" },
  { period: "All" },
];

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function checkAmountType(transaction: any, category: any) {
  if (category.type === "debit") {
    return -Math.abs(parseFloat(transaction.amount));
  } else {
    return Math.abs(parseFloat(transaction.amount));
  }
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function initialCategory(amount: number) {
  if (amount < 0) {
    return "2";
  } else {
    return "1";
  }
}
