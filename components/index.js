import Head from "next/head";
import { Box, Stack, Button, Text, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";

export function Layout({ children }) {
  return (
    <Box>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <script src='https://bossanova.uk/jexcel/v4/jexcel.js'></script>
        <script src='https://jsuites.net/v3/jsuites.js'></script>
        <link rel='stylesheet' href='https://jsuites.net/v3/jsuites.css' type='text/css' />
        <link rel='stylesheet' href='https://bossanova.uk/jexcel/v4/jexcel.css' type='text/css' />

        {/* <script src='https://bossanova.uk/jspreadsheet/v4/jexcel.js'></script>
        <script src='https://jsuites.net/v4/jsuites.js'></script>
        <link rel='stylesheet' href='https://jsuites.net/v4/jsuites.css' type='text/css' />
        <link
          rel='stylesheet'
          href='https://bossanova.uk/Jspreadsheet/v4/jexcel.css'
          type='text/css'
        /> */}
      </Head>
      <Navigation />
      <Box>{children}</Box>
    </Box>
  );
}

export function Navigation() {
  const router = useRouter();

  return (
    <Stack as='nav' bg='gray.900'>
      <Stack
        maxW='7xl'
        mx='auto'
        width='full'
        color='white'
        spacing='6'
        isInline
        boxShadow='base'
        p='4'
        bg='gray.900'
      >
        <Stack isInline flex='1'>
          <Button variant='unstyled' onClick={() => router.push("/")}>
            Hello World
          </Button>
        </Stack>
        <Button variant='unstyled' onClick={() => router.push("/pricing")}>
          Pricing
        </Button>
        <Button
          variant='outline'
          borderWidth='2px'
          _hover={{
            color: "gray.900",
            bg: "white",
          }}
        >
          Log in
        </Button>
      </Stack>
    </Stack>
  );
}

// export function Navigation() {}
