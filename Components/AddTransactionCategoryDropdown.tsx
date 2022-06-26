import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "axios";
import useSWR from "swr";
import { Categories } from "../Types/index";

type props = {
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetchCategories = (url: string) => axios.get(url).then((res) => res.data);

const AddTransactionCategoryDropdown = ({ setCategoryId }: props) => {
  const [displayedCategory, setdisplayedCategory] = useState<string>("Revenue");
  async function updateCategory(category: string, categoryId: string) {
    setdisplayedCategory(category);
    setCategoryId(categoryId);
  }
  const { data: categories } = useSWR<Categories>(
    `/api/categories`,
    fetchCategories
  );
  console.log(categories?.data);
  return (
    <Menu
      as="div"
      className="relative inline-block z-15 backdrop:
    
    text-left"
    >
      <div className="z-15">
        <Menu.Button className="inline-flex justify-center z-15 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {displayedCategory}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="origin-top-right absolute z-15 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {categories?.data.map((category) => {
              return (
                <Menu.Item key={category.category}>
                  {({ active }) => (
                    <a
                      onClick={() => {
                        updateCategory(
                          category.category as string,
                          category.id
                        );
                      }}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm z-15"
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
  );
};

export default AddTransactionCategoryDropdown;
