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
      <Stack maxW='8xl' width='full' mx='auto' py={[20, 64]} alignItems='center'>
        <Box>
          <Text maxW='xl' textAlign='center' fontSize='5xl' fontWeight='bold'>
            Stock Cutting Optimisation App
          </Text>
        </Box>
        <Box pt='4'>
          <NextLink href='/app' passHref>
            <Button bg='gray.900' color='white' size='lg' _hover={{}}>
              try the App
            </Button>
          </NextLink>
        </Box>
      </Stack>
    </Layout>
  );
}
