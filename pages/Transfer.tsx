import React, { useContext } from "react";
import { useState } from "react";
import { ScaleIcon } from "@heroicons/react/outline";
import Layout from "../Components/Layout";
import TransferForm from "../Components/TransferForm";
import axios from "axios";
import { User } from "@prisma/client";
import useSWR from "swr";
import Context from "../Context";
import { APIUser } from "../Types/index";
import { numberWithCommas } from "../Utils";

const fetchUser = (url: string) => axios.get(url).then((res) => res.data);

const Transfer = () => {
  const { userInfo } = useContext(Context);
  const userId = userInfo.currentSession?.user.id;
  const { data: user } = useSWR<APIUser>([`/api/user/${userId}`], fetchUser);
  const currentBalance = user? user.user?.currentBalance: 0
  return (
    <Layout>
      <div className="mt-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Process A Payment
          </h2>
          <div className="sm:flex sm:justify-center">
            <div className="m-5 sm:w-3/4 ">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center ">
                    <div className="ml-5 flex-1">
                      <dl>
                        <dt className="text-lg font-medium text-gray-500 truncate">
                          Avaiable Balance
                        </dt>
                        <dd>
                          <div className="text-3xl font-medium text-gray-900">
                            EGP{" "}
                            {user
                              ? numberWithCommas(user.user?.currentBalance)
                              : 0}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TransferForm userId={userId} currentBalance={currentBalance}/>
        </div>
      </div>
    </Layout>
  );
};

export default Transfer;
