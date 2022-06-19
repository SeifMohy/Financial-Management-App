import React, { useContext, useEffect, useState } from "react";
import DropDownMenu from "../Components/DropDownMenu";
import Layout from "../Components/Layout";
import Context from "../Context";
import { Data, ErrorDataItem } from "../dataUtilities";

const transactions = [
  {
    id: "oapfjpaodijfpoaijsdf",
    date: "30/12/2020",
    amount: "3,509.00",
    description: "Ahmed ",
    category: "Sales",
    bank: "Chase",
  },
  // More transactions...
];

const TransactionHistory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { accessToken, userInfo } = useContext(Context);
  console.log(accessToken, userInfo);
  const getTransactionData = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/Plaid/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `accessToken=${accessToken}`,
    });
    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    getTransactionData(), [];
  });
  return (
    <Layout>
      <div>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Add Transaction
          </button>
        </div>
        <div className="mt-1 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Bank
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 sm:pl-6">
                          {transaction.date}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                          EGP {transaction.amount}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                          <DropDownMenu />
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                          {transaction.bank}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="m-3">
          <p>Total Debit:</p>
          <p>Total Credit:</p>
          <p>Net Movements:</p>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionHistory;
