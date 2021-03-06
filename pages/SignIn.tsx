/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export type SignInInfo = {
  email: string;
  password: string;
};

const SignIn = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || " ",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || " "
  );
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const loginWithEmail = async (values: SignInInfo) => {
    const { error, user } = await supabase.auth.signIn({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setLoginError(error.message);
    }
    if (user) {
      router.push("/Dashboard");
    }
  };
  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values: SignInInfo) => {
      loginWithEmail(values);
      formik.resetForm();
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("*Required"),
      password: Yup.string().required("*Required"),
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
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link href="/SignUp">
                  <a className="font-medium text-cyan-600 hover:text-cyan-500">
                    Sign Up
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
                    Email
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none mt-1 mb-2 rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none mt-1 mb-2 rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="text-xs italic text-red-300">
                      {formik.errors.password}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="#">
                    <a className="font-medium text-cyan-600 hover:text-cyan-500">
                      Forgot your password?
                    </a>
                  </Link>
                </div>
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
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </div>
  );
};

export default SignIn;
