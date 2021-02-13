import React from "react";
import Head from "next/head";
import { Box, Stack, Button, Text, Input } from "@chakra-ui/react";
import axios from "axios";

const appUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/hello"
    : "https://mindes-pjovimai.vercel.app/api/hello";

export default function Home({ output1D, input }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputState, setInputState] = React.useState({
    bladeSize: 0.1,
    stockSizes1D: [{ size: 6500, cost: 1 }],
    input1D: [
      {
        size: 300,
        count: 1,
      },
    ],
  });
  const [resultState, setResultState] = React.useState({});

  const getResult = async () => {
    setIsLoading(true);
    await axios.post(appUrl, { inputState }).then(({ data }) => {
      setResultState(data);
      setIsLoading(false);
    });
  };
  console.log(process.env.NODE_ENV === "development");

  React.useEffect(() => {
    getResult();
  }, []);

  return (
    <Box>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

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
          <Box flex='1'></Box>
          <Button variant='unstyled'>Pricing</Button>
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
      <Box as='main' maxW='7xl' mx='auto' width='full' py='20'>
        <Stack isInline spacing='32'>
          <Stack flex='0.5'>
            <Cut1DInputs setInputState={setInputState} inputState={inputState} />
            <Stack py='10'>
              <Button isLoading={isLoading} onClick={getResult}>
                Get Result
              </Button>
            </Stack>
          </Stack>
          <Stack flex='0.5'>
            <Stack isInline spacing='20' fontSize='xs'>
              <Box>
                <Text fontSize='3xl' fontWeight='bold' pb='5'>
                  Input
                </Text>
                <pre>{JSON.stringify(inputState, null, 2)}</pre>
              </Box>
              <Box>
                <Text fontSize='3xl' fontWeight='bold' pb='5'>
                  Output
                </Text>
                <pre>{JSON.stringify(resultState, null, 2)}</pre>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function Cut1DInputs({ setInputState, inputState }) {
  const handleAddStock = () => {
    setInputState((prev) => ({
      ...prev,
      stockSizes1D: [...inputState.stockSizes1D, { size: 6500, cost: 1 }],
    }));
  };

  const handleAddCut = () => {
    setInputState((prev) => ({
      ...prev,
      input1D: [...inputState.input1D, { size: 300, count: 1 }],
    }));
  };
  return (
    <Stack>
      <Stack>
        <Text>Blade Size</Text>
        <Input
          type='number'
          defaultValue={inputState.bladeSize}
          placeholder='blade size'
          onChange={({ target: { value } }) =>
            setInputState((prev) => ({ ...prev, bladeSize: +value }))
          }
        />
      </Stack>
      <Stack>
        <Text>Stock Sizes</Text>
        {inputState.stockSizes1D.map(({ size, cost }, index) => {
          const handleChange = (e) => {
            const { name, value } = e.target;
            const copy = [...inputState.stockSizes1D];
            copy[index][name] = +value;
            setInputState((prev) => ({ ...prev, stockSizes1D: copy }));
          };
          return (
            <Stack isInline>
              <Input
                name='size'
                width='full'
                type='number'
                placeholder='size'
                defaultValue={size}
                onChange={handleChange}
              />
              <Input
                name='cost'
                width='full'
                type='number'
                placeholder='cost'
                defaultValue={cost}
                onChange={handleChange}
              />
            </Stack>
          );
        })}
        <Box width='full'>
          <Button width='full' onClick={handleAddStock}>
            +
          </Button>
        </Box>
      </Stack>
      <Stack>
        <Text>Required Cuts</Text>
        {inputState.input1D.map(({ size, count }, index) => {
          const handleChange = (e) => {
            const { name, value } = e.target;
            const copy = [...inputState.input1D];
            copy[index][name] = +value;
            setInputState((prev) => ({ ...prev, input1D: copy }));
          };
          return (
            <Stack isInline>
              <Input
                name='size'
                width='full'
                type='number'
                placeholder='size'
                defaultValue={size}
                onChange={handleChange}
              />
              <Input
                name='count'
                width='full'
                type='number'
                placeholder='count'
                defaultValue={count}
                onChange={handleChange}
              />
            </Stack>
          );
        })}
        <Box width='full'>
          <Button width='full' onClick={handleAddCut}>
            +
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}

// export async function getServerSideProps(context) {
//   let output1D = {};

//   const input = {
//     bladeSize: 0.1,
//     stockSizes1D: [{ size: 15, cost: 1 }],
//     input1D: [
//       { size: 7, count: 5 },
//       { size: 2, count: 4 },
//       { size: 3, count: 16 },
//     ],
//   };

//   // if (typeof window === "undefined") {
//   const { bladeSize, stockSizes1D, input1D } = input;
//   output1D = howToCutBoards1D({
//     stockSizes: stockSizes1D,
//     bladeSize,
//     requiredCuts: input1D,
//   });
//   // }

//   return {
//     props: { output1D, input }, // will be passed to the page component as props
//   };
// }
