import React, { useContext } from "react";
import Layout from "../Components/Layout";
import Context from "../Context";

const stats = [
  { name: "Total Revenue", stat: "450,632" },
  { name: "Sales Growth", stat: "15.16%" },
  { name: "Gross Margin", stat: "4.57%" },
];

const Dashboard = () => {
  const { userInfo } = useContext(Context);
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
            Last 30 days
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.name}
                className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
