import React from "react";
import { Box, Stack, Button, Text, Image } from "@chakra-ui/react";
import { Layout } from "../components";
import NextLink from "next/link";

export default function IndexPage() {
  return (
    <Layout>
      <Stack maxW="8xl" width="full" mx="auto" pt={[20, 48]} pb="10" alignItems="center">
        <Box>
          <Text as="h1" maxW="xxl" textAlign="center" fontSize="5xl" fontWeight="bold">
            Cutting stock optimisation App
          </Text>
        </Box>
        <Box>
          <Text as="h3" maxW="xxl" textAlign="center" fontSize="2xl">
            Created for Engineers by Engineers
          </Text>
        </Box>
        <Box pt="4">
          <NextLink href="/app" passHref>
            <Button bg="gray.900" color="white" size="lg" _hover={{}}>
              The App
            </Button>
          </NextLink>
        </Box>
      </Stack>
      <Stack isInline justifyContent="center" pb="20">
        <Box maxW="1000px">
          <Image src="/app-ui.png" objectFit="cover" />
        </Box>
      </Stack>
    </Layout>
  );
}
