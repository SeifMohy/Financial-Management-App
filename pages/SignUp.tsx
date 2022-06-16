import React from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useFormik } from "formik";

export type SignUpInfo = {
  email: string;
  password: string;
  name: string;
};

const SignUp = () => {
  // const { user } = useUser();
  const router = useRouter();
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
    router.push("/Dashboard");
    console.log({ user, session, error });

  };

  const initialValues = {
    email: "",
    password: "",
    name: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values: SignUpInfo, resetForm: any) => {
      console.log(values);
      signUpWithEmail(values);
      resetForm()
    },
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
                <a
                  href="/SignIn"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Sign In
                </a>
              </p>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={formik.handleChange}
                  />
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
