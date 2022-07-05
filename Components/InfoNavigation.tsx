/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";

const InfoNavigation = () => {
  const router = useRouter();
  return (
    <div>
      <Disclosure as="nav" className="bg-cyan-700 shadow-lg">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="-ml-2 mr-2 flex items-center md:hidden"></div>
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="block lg:hidden h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-cyan-600.svg"
                  alt="Workflow"
                />
                <img
                  className="hidden lg:block h-8 w-auto"
                  src="https://tailwindui.com/img/logos/easywire-logo-cyan-300-mark-white-text.svg"
                  alt="Workflow"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 mx-3">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                  onClick={() => {
                    router.push("/SignIn");
                  }}
                >
                  <span>Sign In</span>
                </button>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                  onClick={() => {
                    router.push("/SignUp");
                  }}
                >
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
};

export default InfoNavigation;
