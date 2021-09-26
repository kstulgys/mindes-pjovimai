import Head from "next/head";
import {
  Text,
  Textarea,
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
      <Button onClick={() => router.push("/")} variant="unstyled" title="Home page">
        <Icon as={FiHome} fontSize="2xl" />
      </Button>
      <ManuItemModal icon={FiLogOut} title="Logout" buttonsText="Yes" text="Are you sure want to log out?"/>
      {/* <ManuItemModal icon={FiSettings} title="How to use it" buttonsText="" text="Watch the video to find out what you can do in the app"/> */}
      <ManuItemModal icon={FiCoffee} title="Contacts" buttonsText="Send message" text="Send us a message if you have any questions."/>
    </Stack>
  );
}

function ManuItemModal({ icon, title, buttonsText, text }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [symbolsNumber, setSymbolsNumber] = React.useState(0);
  const [messageText, setMessageText] = React.useState('');
 
  const handleLogout = async () => {
    await Auth.signOut();
    router.push("/");
  };

  function handleTextInsert(el){
    if(el.length<=250){setMessageText(el)
    setSymbolsNumber(el.length)};
  }
  return (
    <>
      <Button title={title} onClick={onOpen} variant="unstyled">
        <Icon as={icon} fontSize="2xl" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {text}

            {title=="Contacts"?(
              <>
              <Text>//Yompti team</Text>
              <Textarea onChange={(e)=>handleTextInsert(e.target.value)} value={messageText} placeholder="Hi..."></Textarea>
              <Text>{symbolsNumber}/250</Text>
              </>
              ):(<></>)}
          </ModalBody>
          <ModalFooter>

             

              {buttonsText?(
              <Button
                _hover={{}}
                bg="gray.900"
                color="white"
                mr={3}
                onClick={handleLogout}
              >
                {buttonsText}
              </Button>
              ):(<></>)}

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
