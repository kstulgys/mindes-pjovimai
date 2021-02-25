import React from "react";
import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { Layout } from "../components";
import { useRouter } from "next/router";
import { FiUser, FiSettings, FiFolder } from "react-icons/fi";
import NextLink from "next/link";

export default function IndexPage() {
  return (
    <Layout>
      <Stack maxW='8xl' width='full' mx='auto' py='64'>
        <Box>
          <Text textAlign='center' fontSize='5xl' fontWeight='bold'>
            Try the best Stock Cutting Optimisation App
          </Text>
        </Box>
        <Box textAlign='center' pt='6'>
          <NextLink href='/app' passHref>
            <Button bg='gray.900' color='white' size='lg' _hover={{}}>
              Try the App
            </Button>
          </NextLink>
        </Box>
      </Stack>
    </Layout>
  );
}
