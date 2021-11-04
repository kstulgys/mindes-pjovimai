import "../styles/globals.css";
//import "../styles/sheetStyles.css"
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";

// import Amplify from 'aws-amplify';
// import config from '../src/aws-exports';
// Amplify.configure({
//   ...config,
//   ssr: true,
// });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <title>Cutting stock optimisation App | yompti</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Cutting stock optimization App. Helps to solve 1D Cutting stock problem." />
        {/* <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
        <link rel="stylesheet" href="https://bossanova.uk/Jspreadsheet/v4/jexcel.css" type="text/css" /> */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v3/jexcel.css" type="text/css" />
        <link rel="stylesheet" href="https://jsuites.net/v3/jsuites.css" type="text/css" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
