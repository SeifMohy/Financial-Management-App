import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  HomeIcon,
  MenuAlt1Icon,
  ScaleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const navigation = [
  { name: "Dashboard", href: "/Dashboard", icon: HomeIcon },
  { name: "Transaction History", href: "/TransactionHistory", icon: ClockIcon },
  { name: "Transfers", href: "/Transfer", icon: ScaleIcon },
  { name: "Add A Bank", href: "/AddingABank", icon: CreditCardIcon },
];

function classNames(...classes: any) {
  //TODO: Amend Type
  return classes.filter(Boolean).join(" ");
}

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || " ",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || " "
  );
  const signOutNow = async () => {
    await supabase.auth.signOut();
    router.push("/SignIn");
  };

  useEffect(() => {
    const userAuth: string | null = JSON.parse(
      localStorage.getItem("supabase.auth.token")
    ); //TODO: fix type
    if (!userAuth) {
      router.push("/SignIn");
    }
  }, []);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-cyan-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 relative flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/easywire-logo-cyan-300-mark-white-text.svg"
                    alt="Easywire logo"
                  />
                </div>
                <nav
                  className="mt-5 flex-shrink-0 h-full divide-y divide-cyan-800 overflow-y-auto"
                  aria-label="Sidebar"
                >
                  <div className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          router.pathname === `${item.href}`
                            ? "bg-cyan-800 text-white"
                            : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-6 pt-6"></div>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-grow bg-cyan-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/easywire-logo-cyan-300-mark-white-text.svg"
              alt="Easywire logo"
            />
          </div>
          <nav
            className="mt-5 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto"
            aria-label="Sidebar"
          >
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    router.pathname === `${item.href}`
                      ? "bg-cyan-800 text-white"
                      : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                    "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-cyan-200"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
            <div className="mt-6 pt-6"></div>
          </nav>
        </div>
      </div>
      <div className=" z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Search bar */}
        <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-10xl lg:mx-auto">
          <div className="flex-1 flex"></div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                    <span className="sr-only">Open user menu for </span>
                    Emilia Birch
                  </span>
                  <ChevronDownIcon
                    className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <button
                    type="button"
                    onClick={() => signOutNow()}
                    className="px-4 py-2 text-sm text-gray-700 z-50"
                  >
                    Logout
                  </button>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <main className="lg:absolute lg:z-0 lg:left-60 p-5 lg:px-10 lg:w-4/5">
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;