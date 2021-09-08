import Head from "next/head";
import {
  Box,
  Stack,
  Button,
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
import {
  FiUser,
  FiSettings,
  FiFolder,
  FiLogOut,
  FiHome,
  FiAward,
  FiCoffee,
  FiInfo,
} from "react-icons/fi";
import { Auth } from "aws-amplify";

export function Layout({ children }) {
  return (
    <Box>
      <Stack
        fontFamily="Montserrat"
        isInline
        bg="gray.200"
        minH="100vh"
        // height="full"
        width="full"
        spacing="0"
      >
        <SideNavBar />
        <Box width="full" px={[4, 24]} minH="100vh">
          {children}
        </Box>
      </Stack>
      {/* <Box position='fixed' bottom='0' right='0'>
        <AmplifyChatbot/>
      </Box> */}
    </Box>
  );
}

function SideNavBar() {
  const router = useRouter();

  if (router.pathname === "/") return null;

  return (
    <Stack
      display={["none", "flex"]}
      width="16"
      boxShadow="base"
      bg="gray.900"
      alignItems="center"
      pt="10"
      color="orange.200"
      spacing="4"
    >
      {/* <ManuItemModal icon={FiFolder} title="Projects" />
      <ManuItemModal icon={FiSettings} title="Settings" />
      <ManuItemModal icon={FiUser} title="User" /> */}
      <Button onClick={() => router.push("/")} variant="unstyled">
        <Icon as={FiHome} fontSize="2xl" />
      </Button>
      <ManuItemModal icon={FiLogOut} title="Logout" />
      <ManuItemModal icon={FiInfo} title="Info" />
    </Stack>
  );
}

function ManuItemModal({ icon, title }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const handleLogout = async () => {
    await Auth.signOut();
    router.push("/");
  };

  return (
    <>
      <Button onClick={onOpen} variant="unstyled">
        <Icon as={icon} fontSize="2xl" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {title === "Logout"
              ? `Are you sure you want to logout ?`
              : ` This is how it started... 
              Let us know how did you enjoy our app: "info@yompti.com"`}
          </ModalBody>
          <ModalFooter>
            {title === "Logout" ? (
              <Button
                _hover={{}}
                bg="gray.900"
                color="white"
                mr={3}
                onClick={handleLogout}
              >
                Yes
              </Button>
            ) : (
              <>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
