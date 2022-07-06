import axios from "axios";
import React, { useContext, useState } from "react";
import useSWR from "swr";
import DoughnutChart from "../Components/DoughnutChart";
import LineChart from "../Components/LineChart";
import LoadingPage from "../Components/LoadingPage";
import PeriodDropDown from "../Components/PeriodDropDown";
import Context from "../Context";
import { KeyFigures } from "../Types/index";
import { periodOptions } from "../Utils";
import Layout from "../Components/Layout";

const fetchKeyFigures = (url: string, period: string) =>
  axios.put(url, period).then((res) => res.data);

const Dashboard = () => {
  const [period, setPeriod] = useState("3 months");
  const { userInfo } = useContext(Context);
  const userId = userInfo.currentSession?.user.id;

  const { data: keyFigures } = useSWR<KeyFigures>(
    [`/api/dashboard/${userId}`, period],
    fetchKeyFigures
  );

  console.log(keyFigures);
  if (!keyFigures) return <LoadingPage />;
  const figures = Object.values(keyFigures)[0];
  return (
    <Layout>
      <div>
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
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
                    {item.pre} {item.stat !== null ? item.stat : "N/A"}{" "}
                    {item.pos}
                  </dd>
                </div>
              )
            )}
          </dl>
        </div>
      </div>
      <div>
        <DoughnutChart period={period} userId={userId} />
      </div>
      <div>
        <LineChart userId={userId} />
      </div>
    </Layout>
  );
};

export default Dashboard;
