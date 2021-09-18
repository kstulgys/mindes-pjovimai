import "../styles/globals.css";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import Amplify from "aws-amplify";
import config from "../src/aws-exports";
Amplify.configure({
  ...config,
  ssr: true,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <title>Cutting stock optimisation App | yompti</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Cutting stock optimisation App. Helps to solve 1D Cutting stock problem." />
        <script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js" />
        <script src="https://jsuites.net/v4/jsuites.js" />
        <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
        <link rel="stylesheet" href="https://bossanova.uk/Jspreadsheet/v4/jexcel.css" type="text/css" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
