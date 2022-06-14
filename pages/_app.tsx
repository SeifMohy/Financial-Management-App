import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QuickstartProvider } from "../Context";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <QuickstartProvider>
        <Component {...pageProps} />
      </QuickstartProvider>
    </UserProvider>
  );
}

export default MyApp;
