import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CategoryDropDown from "../Components/CategoryDropDown";
import Layout from "../Components/Layout";
import Context from "../Context";
import useSWR from "swr";
import { Category, Transaction } from "@prisma/client";
import { DBTransactions } from "../Types/index";
import PeriodDropDown from "../Components/PeriodDropDown";
import { periodOptions } from "../Utils";
import AddTransactionModal from "../Components/AddTransactionModal";

const fetchDBTransactions = (url: string, period: any) =>
  axios.put(url, period).then((res) => res.data);

const TransactionHistory = () => {
  const [openModal, setOpenModal] = useState(false);
  const [period, setPeriod] = useState("3 months");
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(Context);
  const userId = userInfo.currentSession?.user.id;
  const { data: transactions } = useSWR<DBTransactions>(
    [`/api/transactions/${userId}`, period],
    fetchDBTransactions
  );
  const sortedTransactions = transactions?.transactions.sort(
    (a: any, b: any) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );
  var sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() - 6);
  const startDate = sortedTransactions?.length
    ? sortedTransactions[0].date
    : sixMonthsFromNow.toLocaleDateString("en-CA");
  console.log(startDate);
  const getTransactionData = async (send: any) => {
    //TODO: need to find a better place to place this
    setIsLoading(true);
    const response = await fetch(`/api/Plaid/transactionsStartDate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: send,
    });
    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    if (!userId) {
      //TODO: need to find condition where transactions should not be sent till a response from transactions is received
      console.log("no user");
    }
    const data = [userId, startDate];
    getTransactionData(data), [];
  });

  return (
    <Layout>
      <div>
        <AddTransactionModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          userId={userId}
        />
        <div className="mb-3 flex justify-between">
          <PeriodDropDown
            periodOptions={periodOptions}
            period={period}
            setPeriod={setPeriod}
          />
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={() => setOpenModal(true)}
          >
            Add Transaction
          </button>
        </div>
        <dl className="m-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {transactions?.movements.map(
            (item: {
              name: string;
              pre: string;
              stat: number;
              pos: string;
            }) => (
              <div
                key={item.name}
                className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {item.pre} {item.stat} {item.pos}
                </dd>
              </div>
            )
          )}
        </dl>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedTransactions?.map(
                      (
                        transaction: Transaction & {
                          category: Category | null;
                        }
                      ) => (
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
                            <CategoryDropDown transaction={transaction} />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionHistory;
