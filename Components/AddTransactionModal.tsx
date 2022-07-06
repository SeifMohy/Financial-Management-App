import React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import axios from "axios";
import useSWR, { KeyedMutator } from "swr";
import {
  Categories,
  AddTransactionModal,
  DBTransactions,
} from "../Types/index";
import * as Yup from "yup";
import parse from "date-fns/parse";

type Props = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  mutate: KeyedMutator<DBTransactions>;
};
const fetchCategories = (url: string) => axios.get(url).then((res) => res.data);
const AddTransactionModal = ({
  openModal,
  setOpenModal,
  userId,
  mutate,
}: Props) => {
  const today = new Date().toLocaleDateString("en-CA");
  const { data: categories } = useSWR<Categories>(
    `/api/categories`,
    fetchCategories
  );
  console.log(userId);
  const initialValues = {
    date: "",
    amount: "",
    description: "",
    category: "Revenue",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values: AddTransactionModal) => {
      setOpenModal(false);
      const res = await axios.put(`/api/addTransaction/${userId}`, values);
      formik.resetForm();
      mutate();
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .min(10, "*Enter a valid date")
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return value;
          }
          const result = parse(originalValue, "dd/mm/yyyy", new Date());
          return result;
        })
        .typeError("*Enter a valid date")
        .required("*Required"),
      amount: Yup.number()
        .typeError("*Enter a valid number")
        .required("*Required"),
      description: Yup.string().required("*Required"),
    }),
  });
  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all">
                <div className="lg:flex">
                  <div className="m-2">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="date"
                        id="date"
                        placeholder="DD/MM/YYYY"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.date}
                        className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {formik.touched.date && formik.errors.date ? (
                        <p className="text-xs italic text-red-300">
                          {formik.errors.date}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="m-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="EGP"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {formik.touched.amount && formik.errors.amount ? (
                        <p className="text-xs italic text-red-300">
                          {formik.errors.amount}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="m-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Name or Reason"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <p className="text-xs italic text-red-300">
                          {formik.errors.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="m-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        className="inline-flex justify-center z-15 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                        id="grid-state"
                        name="category"
                        onChange={formik.handleChange}
                      >
                        {categories?.data.map((category) => {
                          return (
                            <option key={category.id}>
                              {category.category}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm"
                    onClick={() => formik.handleSubmit()}
                  >
                    Add Transaction
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddTransactionModal;
