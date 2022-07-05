/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Link from "next/link";

export type SignUpInfo = {
  email: string;
  password: string;
  name: string;
};

const SignUp = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! || " ",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || " "
  );
  const signUpWithEmail = async (values: SignUpInfo) => {
    const { user, session, error } = await supabase.auth.signUp(
      {
        email: values.email,
        password: values.password,
      },
      {
        data: {
          name: values.name,
        },
      }
    );
    if (error) {
      setLoginError(error.message);
    }
    if (user) {
      const res = await axios.put("/api/Auth/user", user);
      router.push("/Dashboard");
    }
  };

  const initialValues = {
    email: "",
    password: "",
    name: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values: SignUpInfo) => {
      console.log(values);
      signUpWithEmail(values);
      formik.resetForm();
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("*Required"),
      password: Yup.string().min(6).required("*Required"),
      name: Yup.string().required("*Required"),
    }),
  });

  return (
    <div>
      <>
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-cyan-600.svg"
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create an Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account{" "}
                <Link href="/SignIn">
                  <a className="font-medium text-cyan-600 hover:text-cyan-500">
                    Sign In
                  </a>
                </Link>
              </p>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              {loginError ? (
                <p className="text-red-300 text-center">{loginError}</p>
              ) : null}
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="appearance-none rounded mt-1 mb-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-1">
                    Email Address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded mt-1 mb-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mt-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded mt-1 mb-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-xs italic text-red-300">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-cyan-500 group-hover:text-cyan-400"
                      aria-hidden="true"
                    />
                  </span>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </div>
  );
};

export default SignUp;
