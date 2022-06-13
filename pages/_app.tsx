import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QuickstartProvider } from "../Context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QuickstartProvider>
      <Component {...pageProps} />
    </QuickstartProvider>
  );
}

export default MyApp;
