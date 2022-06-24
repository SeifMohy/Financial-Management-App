import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import DoughnutChart from "../Components/DoughnutChart";
import Layout from "../Components/Layout";
import LineChart from "../Components/LineChart";
import PeriodDropDown from "../Components/PeriodDropDown";
import Context from "../Context";
import { KeyFigures } from "../Types/index";
import { periodOptions } from "../Utils";

const fetchKeyFigures = (url: string, period: any) =>
  axios.put(url, period).then((res) => res.data);

const Dashboard = () => {
  const [period, setPeriod] = useState("3 months");

  const { userInfo } = useContext(Context);
  const userId = userInfo.currentSession?.user.id;
  const { data: keyFigures } = useSWR<KeyFigures>(
    [`/api/dashboard/${userId}`, period],
    fetchKeyFigures
  );

  if (!keyFigures) return <div>loading...</div>;
  const figures = Object.values(keyFigures)[0];
  return (
    <Layout>
      <div>
        {" "}
        <div className="flex items-center">
          <img
            className="hidden h-16 w-16 rounded-full sm:block"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
            alt=""
          />
          <div>
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full sm:hidden"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                alt=""
              />
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Good morning, {userInfo.currentSession?.user.user_metadata.name}
              </h1>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg mt-5 leading-6 font-medium text-gray-900">
            <PeriodDropDown
              periodOptions={periodOptions}
              period={period}
              setPeriod={setPeriod}
            />
          </h3>
          <dl className="m-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {figures.map(
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
        </div>
      </div>
      <div>
        <DoughnutChart period={period} />
      </div>
      <div>
        <LineChart />
      </div>
    </Layout>
  );
};

export default Dashboard;
