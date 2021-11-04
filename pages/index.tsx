<<<<<<< HEAD
import React from "react";
import { Box, Stack, Button, Text, Image, AspectRatio } from "@chakra-ui/react";
import { Layout } from "../components";
import NextLink from "next/link";
=======
import React from 'react';
import { Box, Stack, Button, Text, Image, AspectRatio } from '@chakra-ui/react';
import { Layout } from '../components';
import NextLink from 'next/link';
import ReactGa from "react-ga"
import { useEffect } from 'react';
>>>>>>> origin/deploy-on-Netlify

export default function IndexPage() {
  useEffect(() => {
    ReactGa.initialize('UA-210625338-1');
    ReactGa.pageview('/'); // Landing page gets a pageview
  }, [])
  return (
    <Layout>
      <Stack alignItems={["center"]} justifyContent={["center"]} maxW="8xl" width="full" mx="auto" pt={[20, 48]} pb="10">
        <Box>
          <Text as="h1" maxW="xxl" textAlign="center" fontSize="5xl" fontWeight="bold">
            YOMPTI
          </Text>
        </Box>
        <Box>
          <Text as="h3" minW="30%" textAlign="center" fontSize="2xl">
            Web-based automatic stock cutting optimisation software. The cutting software can be used for obtaining optimal cutting layouts
            for one (1D) dimensional pieces, such as bars, pipes, tubes, steel bars, metal profiles, extrusions, tubes, lineal wood boards
            or other materials.
          </Text>
          <Text as="h3" maxW="xxl" textAlign="justify" fontSize="2xl"></Text>
        </Box>
        <Box pt="4">
          <NextLink href="/app" passHref={true}>
            {/* passHref */}
            <Button bg="gray.900" color="white" size="lg" _hover={{}}>
              TRY IT FOR FREE
            </Button>
          </NextLink>
        </Box>
      </Stack>
      <Stack isInline justifyContent="center" pb="20">
        <Box maxW="1000px">
          <Image src="/background_2021-09-26.jpg" objectFit="cover" />
          {/* <AspectRatio maxW="560px" ratio={1}> */}
          {/* <Box
                as="iframe"
                title="naruto"
                src="https://www.youtube.com/embed/QhBnZ6NPOY0"
                allowFullScreen
              /> */}
          {/* <video controls>
                <source src="/public/appVideo.mp4" type="video/mp4" ></source>
              </video> */}
          {/* </AspectRatio> */}
        </Box>
      </Stack>
    </Layout>
  );
}
