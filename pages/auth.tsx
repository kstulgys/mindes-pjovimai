import React from "react";
import { Auth, withSSRContext, Hub } from "aws-amplify";
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifyChatbot } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { useAuthUser } from "../utils";
import { Box, Button, Input, Stack, useToast, Text, FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@chakra-ui/react";

function AuthPage() {
  const [showLogin, setShowLogin] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showVerify, setVerify] = React.useState(false);
  const [userInput, setUserInput] = React.useState({
    email: "",
    password: "",
    code: "",
  });

  const router = useRouter();
  const toast = useToast();

  const redirectAuthUser = () => router.push("/app");

  React.useEffect(() => {
    Hub.listen("auth", ({ payload: { event } }) => {
      if (event === "signIn") return redirectAuthUser();
      setShowLogin(true);
    });

    Auth.currentAuthenticatedUser()
      .then(() => redirectAuthUser())
      .catch(() => setShowLogin(true));
  }, []);

  React.useEffect(() => {
    if (!error) return;
    toast({
      title: error,
      status: "warning",
      duration: 9000,
      isClosable: false,
    });
  }, [error]);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value.trim() }));
  };

  if (!showLogin) return null;

  return (
    <Stack bg="gray.200" height="100vh" isInline spacing="0">
      <Stack display={["none", "flex"]} width="50%" height="full" bg="gray.900" p="4"></Stack>
      <Stack width={["full", "50%"]} p="4" height="full" alignItems={["flex-start", "center"]} justifyContent={["flex-start", "center"]}>
        <Stack width={["full", "60%"]} pb="3">
          <Text fontSize="5xl" lineHeight="none" fontWeight="bold">
            Welcome back
          </Text>
          <Text fontSize="xl">Sign in to continue</Text>
        </Stack>

        <Stack width={["full", "60%"]} p="10" bg="white" rounded="md" boxShadow="base">
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input onChange={handleInputChange} name="email" value={userInput.email} size="lg" type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input onChange={handleInputChange} name="password" value={userInput.password} size="lg" type="password" />
          </FormControl>
          {showVerify && (
            <>
              <FormControl id="code">
                <FormLabel>Code</FormLabel>
                <Input onChange={handleInputChange} name="code" value={userInput.code} size="lg" type="text" />
              </FormControl>
              <Button variant="link" onClick={() => Auth.resendSignUp(userInput.email)}>
                Resend confirmation code
              </Button>
            </>
          )}
          <FormButtons userInput={userInput} showVerify={showVerify} setVerify={setVerify} setError={setError} />
        </Stack>
      </Stack>
    </Stack>
  );
}

function FormButtons({ userInput: { email, password, code }, showVerify, setVerify, setError }) {
  const toast = useToast();

  const signIn = () =>
    Auth.signIn(email, password)
      .then(() => {
        setError("");
      })
      .catch(({ message }) => {
        setError(message);
        if (message === "User is not confirmed.") {
          setVerify(true);
        } else {
          setVerify(false);
        }
        console.log({ message });
      });

  const signUp = () =>
    Auth.signUp({
      username: email,
      password: password,
    })
      .then(() => {
        toast({
          title: "Please check your inbox and add your verification code.",
          // description: "We've created your account for you.",
          status: "warning",
          duration: 9000,
          isClosable: false,
        });
        setError("");
        setVerify(true);
      })
      .catch(({ message }) => {
        setError(message);
        setVerify(false);
        console.log({ message });
      });

  const confirmSignUp = () =>
    Auth.confirmSignUp(email, code)
      .then(() => signIn())
      .catch(({ message }) => {
        setError(message);
      });

  if (showVerify) {
    return (
      <Stack isInline pt="4" spacing="4">
        <Button _hover={{}} bg="gray.900" color="white" size="lg" width="full" onClick={confirmSignUp}>
          Verify
        </Button>
      </Stack>
    );
  }

  return (
    <Stack isInline pt="4" spacing="4">
      <Button _hover={{}} bg="gray.900" color="white" size="lg" width="full" onClick={signIn}>
        Sign In
      </Button>
      <Button size="lg" width="full" onClick={signUp}>
        Sign up
      </Button>
    </Stack>
  );
}

export default AuthPage;
