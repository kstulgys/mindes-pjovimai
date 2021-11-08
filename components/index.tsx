import Head from "next/head";
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
import { FiUser, FiSettings, FiFolder, FiLogOut, FiHome, FiAward, FiCoffee, FiInfo, FiSave } from 'react-icons/fi';
import {AiOutlineLike, AiOutlineDislike} from 'react-icons/ai';
import { Auth } from 'aws-amplify';
import ReactGa from 'react-ga'
import { getByTitle } from "@testing-library/react";

export function Layout({ children }) {
  
  return (
    <Box>
      <Stack
        fontFamily="Montserrat"
        //isInline
        bg="gray.200"
        height="full"
        width="full"
        //minWidth="500px" // to have nice jspreadsheets
        spacing="0"
        color="gray.900"
      >
        <SideNavBar />
        <Box width="full">
        
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
    <Stack direction={"row"} height = "14" boxShadow="base" bg="gray.900"  color="white" px="2%" alignItems="center">
      {/* <ManuItemModal icon={FiFolder} title="Projects" display={["none", "flex"]} alignItems="center"/>
      <ManuItemModal icon={FiSettings} title="Settings" />
      <ManuItemModal icon={FiUser} title="User" /> */}
      {/* <Button onClick={() => router.push('/')} variant="unstyled" title="Home page" _hover={{ bg: 'blue.500' }}>
        <Icon as={FiHome} fontSize="2xl" />
      </Button> */}
       <Text textAlign="center" fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r,blue.100,gray.100)" bgClip="text" pl="2%">
        {/* Y <br />O<br />M<br />P<br />T<br />I */}
        Yompti
      </Text>
      <Stack width={'full'} alignItems={"Left"} direction={"row"} justify={"right"} spacing="10%" pl="10%">
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
          title="Contacts"
          buttonsText="Send a message"
          text="How did you enjoy the app? Send us a message!"
        />
        {/* <ManuItemModal icon={FiSave} title="Save Result" buttonsText="Yes" text="Are you sure want to save result?" /> */}
      </Stack>
    </Stack>
  );
}

function ManuItemModal({ icon, title, buttonsText, text }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [IconTitle, setIconTitle] = React.useState('');
  const [symbolCount, setSymbolCount] = React.useState(0);
  const [messageText, setMessageText] = React.useState('');
  const [liked, setLiked]= React.useState(true);

  const handleLogout = async () => {
    //await Auth.signOut();
    router.push('/');
  };
  const handleOnOpen = () =>{
    onOpen();
    ReactGa.modalview(title); // Sends a pageview to GA 
  }
 React.useEffect(() => {
  if(window.innerWidth>=600){
    setIconTitle(title)
  }
  const showIconNames=()=>{
    if(window.innerWidth>=600){
      setIconTitle(title)
    } else{
      setIconTitle('')
    }
  }
  window.addEventListener("resize", showIconNames);
  window.addEventListener("onload", showIconNames);
 }, [])

 function handleTextInsert(el) {
  if (el.length <= 250) {
    setMessageText(el);
    setSymbolCount(el.length);
  }
}
function sendAMessage() {
  //console.log("This message has been sent: "+ messageText);
  ReactGa.event({ // Sends data to GA
    category:'Message',
    label:'Message',
    action: messageText,
  })
  setMessageText('Your message has been sent!')
}
const sendLike=()=>{
  setLiked(false);
  ReactGa.event({ // Sends data to GA
    category:'LikeButton',
    label:'Liked',
    action: 'Liked',
  })
}
const sendDislike=()=>{
  setLiked(false);
  ReactGa.event({ // Sends data to GA
    category:'DislikeButton',
    label:'Disliked',
    action: 'Disliked',
  })
}


  return (
    <>
      <Button title={title} onClick={handleOnOpen} variant="unstyled" _hover={{ bg: 'blue.200' }}>
        <Stack direction={"row"}>
            <Icon as={icon} fontSize="2xl" />
            <Text justify="center">{IconTitle}
             </Text>
        </Stack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {text}
            {title == 'Contacts' ? (
              <>
                {/* <Text>Yompti team</Text> */}
                <Textarea onChange={(e)=>handleTextInsert(e.target.value)} value={messageText} placeholder={"Hi..."}></Textarea>
                <Text mr="1">{symbolCount}/250</Text>
              </>
            ) : (
              <></>
            )}
            {title == "Info" ? (
              <>
                <Text>◉ What is Yompti?</Text>
                <Text>
                  Web-based automatic stock cutting optimisation software. The cutting software can be used for obtaining optimal cutting
                  layouts for one (1D) dimensional pieces, such as bars, pipes, tubes, steel bars, metal profiles, extrusions, tubes, lineal
                  wood boards or other materials.
                </Text>
                <Text>◉ How it works?</Text>
                <Text>
                  It generates optimized cutting patterns based on the available stock sheets by nesting the required cuts. Cut and stock
                  information can be copied directly to the input sheets from any spreadsheet software. The results can be exported in XLS
                  and PDF formats in your preferred grouping.
                </Text>
              </>
            ) : (
              <></>
            )}
            
            {title=="Contacts"&& liked ?(
                <Stack justifyContent="space-evenly" direction="row" py="3" width ="full ">
                <Button variant="ghost" leftIcon={<AiOutlineLike size={42}/>} onClick={sendLike}/>
                <Button variant="ghost" leftIcon={<AiOutlineDislike size={42}/>} onClick={sendDislike}/>
                </Stack>
                ):
                (<></>)
            }
            {title=="Contacts"&& !liked ?(
                <Stack justifyContent="space-evenly" direction="row" py="3" width ="full ">
                <Text> Thank you!
                </Text>
                </Stack>
                ):
                (<></>)
            }
             
          </ModalBody>
          <ModalFooter >
            

            {buttonsText ? (
              <Button
                _hover={{}}
                bg="gray.900"
                color="white"
                
                onClick={title == 'Contacts' ? sendAMessage : handleLogout}
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
