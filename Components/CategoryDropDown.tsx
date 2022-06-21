import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Category, Transaction } from "@prisma/client";
import { Categories, transactionWCategory } from "../Types/index";
import axios from "axios";
import useSWR from "swr";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetchCategories = (url: string) => axios.get(url).then((res) => res.data);

function determineType(amount: number) {
  if (amount < 0) {
    return "debit";
  } else {
    return "credit";
  }
}

const CategoryDropDown = ({ transaction }: transactionWCategory) => {
  const { data: categories } = useSWR<Categories>(
    `/api/categories`,
    fetchCategories
  );
  console.log(categories);
  useEffect(() => {
    const category = determineType(transaction.amount);
    setType(category);
  }, []);
  const [type, setType] = useState("credit");

  const [displayedCategory, setdisplayedCategory] = useState<string>(
    transaction?.category?.category as string
  );

  const options = categories?.data.filter((category) => {
    return category.type === type;
  });

  async function updateCategory(category: string, categoryId: string) {
    setdisplayedCategory(category);
    const res = await axios.put(`api/categories/${transaction.id}`, categoryId);
    console.log(res);
  }

  return (
    <div>
      <Menu as="div" className="inline-block text-left z-200">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500">
            {displayedCategory}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
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
          <Menu.Items className="origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {options?.map((category) => {
                return (
                  <Menu.Item key={category.category}>
                    {({ active }) => (
                      <a
                        onClick={() =>
                          updateCategory(
                            category.category as string,
                            category.id
                          )
                        }
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {category.category}
                      </a>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default CategoryDropDown;
