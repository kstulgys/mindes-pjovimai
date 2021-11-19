import React from "react";
import { Box, Stack, Button, Text, Image } from "@chakra-ui/react";
import { Layout } from "../components";
import NextLink from "next/link";
import ReactGa from "react-ga";
import { useEffect } from "react";

export default function IndexPage() {
  useEffect(() => {
    ReactGa.initialize("UA-210625338-1");
    ReactGa.pageview("/"); // Landing page gets a pageview
  }, []);
  return (
    <Layout>
      <Box maxW="3xl" mx="auto" pt={[10, 20]} px={2}>
        <Stack alignItems={["center"]} pt={[5, 4]} pb="10">
          <Box>
            <Text as="h1" maxW="xxl" textAlign="center" fontSize="5xl" fontWeight="bold">
              YOMPTI
            </Text>
          </Box>
          <Box>
            <Text as="h3" minW="30%" textAlign="center" fontSize="xl">
              Web-based automatic stock cutting optimisation software. The cutting software can be used for obtaining optimal cutting
              layouts for one (1D) dimensional pieces, such as bars, pipes, tubes, steel bars, metal profiles, extrusions, tubes, lineal
              wood boards or other materials.
            </Text>
          </Box>
          <Box pt="4">
            <NextLink href="/app" passHref={true}>
              <Button bg="gray.900" color="white" size="lg" _hover={{}}>
                TRY IT FOR FREE
              </Button>
            </NextLink>
          </Box>
        </Stack>
      </Box>
      <Box>
        <Image mx="auto" src="background_2021-09-26.jpg" alt="app preview" />
      </Box>
    </Layout>
  );
}
