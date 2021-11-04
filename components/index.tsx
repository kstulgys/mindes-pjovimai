import Head from 'next/head';
import {
  Text,
  Textarea,
  Heading,
  Input,
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
  Spacer,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FiUser, FiSettings, FiFolder, FiLogOut, FiHome, FiAward, FiCoffee, FiInfo } from 'react-icons/fi';
import { Auth } from 'aws-amplify';
import ReactGa from 'react-ga'

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
        minWidth="1500px" // to have nice jspreadsheets
        spacing="0"
      >
        <SideNavBar />
        <Box width="full" px={[2, 6]} minH="100vh">
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

  if (router.pathname === '/') return null;

  return (
    <Stack
      display={['none', 'flex']}
      width="16"
      boxShadow="base"
      bg="gray.900"
      alignItems="center"
      pt="10"
      color="white"
      spacing="8"
    >
      {/* <ManuItemModal icon={FiFolder} title="Projects" />
      <ManuItemModal icon={FiSettings} title="Settings" />
      <ManuItemModal icon={FiUser} title="User" /> */}
      {/* <Button onClick={() => router.push('/')} variant="unstyled" title="Home page" _hover={{ bg: 'blue.500' }}>
        <Icon as={FiHome} fontSize="2xl" />
      </Button> */}
      <ManuItemModal icon={FiHome} title="Home page" buttonsText="Yes" text="Are you sure want to go back?" />
      {/* <ManuItemModal icon={FiSettings} title="How to use it" buttonsText="" text="Watch the video to find out what you can do in the app"/> */}
      <ManuItemModal
        icon={FiInfo}
        title="Info"
        buttonsText=""
        text="
   "
      />
      <ManuItemModal
        icon={FiCoffee}
        title="Contact Yompti team!"
        buttonsText=""
        text="Our email address: hello@kastproductions.com"
      />
      <Text
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        bgGradient="linear(to-r,blue.300,gray.100)"
        bgClip="text"
      >
        Y <br />O<br />M<br />P<br />T<br />I
      </Text>
    </Stack>
  );
}

function ManuItemModal({ icon, title, buttonsText, text }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  
  const handleLogout = async () => {
    //await Auth.signOut();
    router.push('/');
  };
  const handleOnOpen = () =>{
    onOpen();
    ReactGa.modalview(title); // Sends a pageview to GA 
  }
  return (
    <>
      <Button title={title} onClick={handleOnOpen} variant="unstyled" _hover={{ bg: 'blue.500' }}>
        <Icon as={icon} fontSize="2xl" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {text}

            {title == 'Info' ? (
              <>
                <Text>◉ What is Yompti?</Text>
                <Text>Web-based automatic stock cutting optimisation software. 
                  The cutting software can be used for obtaining optimal cutting layouts for one (1D) dimensional pieces, 
                such as bars, pipes, tubes, steel bars, metal profiles, extrusions, tubes, lineal wood boards or other materials.</Text>
                <Text>◉ How it works?</Text>
                <Text>It generates optimized cutting patterns based on the available stock sheets by nesting the required cuts. 
                Cut and stock information can be copied directly to the input sheets from any spreadsheet software.
                The results can be exported in XLS and PDF formats in your preferred grouping.</Text>
              </>
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            {buttonsText ? (
              <Button
                _hover={{}}
                bg="gray.900"
                color="white"
                mr={3}
                onClick={handleLogout}
              >
                {buttonsText}
              </Button>
            ) : (
              <></>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
