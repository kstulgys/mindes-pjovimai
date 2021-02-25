import Head from "next/head";
import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  useDisclosure,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import { FiUser, FiSettings, FiFolder } from "react-icons/fi";
import NextLink from "next/link";

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
      {/* <Navigation /> */}
      <Stack isInline bg='gray.100' minH='100vh' width='full' spacing='0'>
        <SideNavBar />
        <Box width='full' px={[4, 24]}>
          {children}
        </Box>
      </Stack>
    </Box>
  );
}

function SideNavBar() {
  const router = useRouter();

  if (router.pathname === "/") return null;

  return (
    <Stack
      width='16'
      boxShadow='base'
      bg='gray.900'
      alignItems='center'
      py='5'
      pt='10'
      color='white'
    >
      <ManuItemModal icon={FiFolder} title='Projects' />
      <ManuItemModal icon={FiSettings} title='Settings' />
      <ManuItemModal icon={FiUser} title='User' />
    </Stack>
  );
}

function ManuItemModal({ icon, title }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant='unstyled'>
        <Icon as={icon} fontSize='3xl' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
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
