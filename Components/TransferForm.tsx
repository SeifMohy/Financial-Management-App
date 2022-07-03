import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import useSWR from "swr";
import * as Yup from "yup";
import { Categories, TransferForm } from "../Types/index";

type Props = {
  userId: string;
  currentBalance: number | null | undefined;
};

const fetchCategories = (url: string) => axios.get(url).then((res) => res.data);

const TransferForm = ({ userId, currentBalance }: Props) => {
  const { data: categories } = useSWR<Categories>(
    `/api/categories`,
    fetchCategories
  );
  const [userErrorMessage, setUserErrorMessage] = useState(false);
  const initialValues = {
    email: "",
    amount: "",
    description: "",
    category: "Cost",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values: TransferForm) => {
      formik.resetForm();
      const res = await axios.put(`/api/transfer/${userId}`, values);
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("*Required"),
      amount: Yup.number()
        .max(
          currentBalance ? currentBalance : 0,
          "Cannot Exceed Avaiable Balance"
        )
        .typeError("*Enter a valid number")
        .required("*Required"),
      description: Yup.string().required("*Required"),
    }),
  });
  return (
    <div>
      {" "}
      <div className="bg-white shadow px-5 py-6 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Beneficiary Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.email}
                    </p>
                  ) : null}
                  {userErrorMessage ? (
                    <p className="text-xs italic text-red-300">
                      Email does not exist
                    </p>
                  ) : null}
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    placeholder="EGP"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.amount && formik.errors.amount ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.amount}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Reason for payment"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.description}
                    </p>
                  ) : null}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    className="mt-1 inline-flex justify-center z-15 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                    id="grid-state"
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                  >
                    {categories?.data.map((category) => {
                      return (
                        <option key={category.id}>{category.category}</option>
                      );
                    })}
                  </select>
                </div>
                <button
                  type="button"
                  className="mt-1 col-span-6 lg:col-span-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={() => formik.handleSubmit()}
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
