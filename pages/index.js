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
} from "@chakra-ui/react";
import axios from "axios";
import { Layout } from "../components";
import { useRouter } from "next/router";
import { FiUser, FiSettings, FiFolder } from "react-icons/fi";
// import Amplify, { API } from "aws-amplify";
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

function getSortedSizes(sizes) {
  const sortedSizes = sizes.reduce((acc, [length, qty]) => {
    const res = Array(+qty)
      .fill(null)
      .map((_) => +length);
    return [...acc, ...res];
  }, []);
  sortedSizes.sort((a, b) => b - a);

  return sortedSizes;
}

function useExcel() {
  const [sortedSizes, setSizes] = React.useState([]);
  const jexcelRef = React.useRef(null);

  React.useEffect(() => {
    window.jexcel(jexcelRef.current, {
      data: [
        [1560, 3],
        [610, 4],
        [520, 2],
        // [700, 2],
        // [180, 0],
      ],
      // data: [
      //   [1560, 3],
      //   [610, 4],
      //   [520, 2],
      //   [700, 2],
      //   [180, 10],
      // ],
      minDimensions: [2, 3],
      defaultColWidth: 200,
      csvHeaders: true,
      tableOverflow: true,
      columns: [
        { type: "numeric", title: "Length" },
        { type: "numeric", title: "Quantity" },
      ],
      // updateTable: function (instance, cell, col, row, val, label, cellName) {
      //   console.log({ instance, cell, col, row, val, label, cellName });
      // },
      onafterchanges: () => {
        const sizes = jexcelRef.current.jexcel.getData();
        const sorted = getSortedSizes(sizes);
        setSizes(sorted);
      },
      onload: () => {
        const sizes = jexcelRef.current.jexcel.getData();
        const sorted = getSortedSizes(sizes);
        setSizes(sorted);
      },
    });
  }, []);

  return { jexcelRef, sortedSizes };
}

// const parts = [
//   { size: 1560, quantity: 3 },
//   { size: 610, quantity: 4 },
//   { size: 520, quantity: 2 },
//   { size: 700, quantity: 2 },
//   { size: 180, quantity: 10 },
// ];

function bestFit(binSize, sizes, bladeSize) {
  let bins = {};

  sizes.forEach((size, index) => {
    const foundBin =
      Object.entries(bins)
        .filter(([key, value], index) => value.capacity >= size)
        .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0] || null;

    if (foundBin) {
      const [key, value] = foundBin;
      bins[key].capacity = +(value.capacity - size).toFixed(2);
      bins[key].items.push(size);
      if (bins[key].capacity >= bladeSize) {
        bins[key].capacity = +(bins[key].capacity - bladeSize).toFixed(2);
        bins[key].items.push(bladeSize);
      }
    } else {
      const nextIdx = Object.values(bins).length;
      bins[nextIdx] = {
        capacity: +(binSize - size).toFixed(2),
        items: [size],
      };
      if (bins[nextIdx].capacity >= bladeSize) {
        bins[nextIdx].capacity = +(bins[nextIdx].capacity - bladeSize).toFixed(2);
        bins[nextIdx].items.push(bladeSize);
      }
    }
  });

  const wasteTotal = Object.values(bins).reduce((acc, { capacity }) => (acc += capacity), 0);
  bins.wasteTotal = wasteTotal;
  return bins;
}

function ManuItemModal({ icon, title }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant='unstyled'>
        <Icon as={icon} fontSize='2xl' />
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

// const appUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000/api/hello"
//     : "https://mindes-pjovimai.vercel.app/api/hello";

export default function Home() {
  const router = useRouter();
  // const [isLoading, setIsLoading] = React.useState(true);
  const [inputState, setInputState] = React.useState({
    bladeSize: 10,
    stockSizes1D: [{ size: 6500, cost: 1 }],
    input1D: [
      {
        size: 300,
        count: 5,
      },
    ],
  });
  const [resultState, setResultState] = React.useState({});
  const [worstState, setWorstState] = React.useState({});
  const permCount = React.useRef(0);

  const { jexcelRef, sortedSizes } = useExcel();

  const getResult = () => {
    // axios
    //   .post("https://gcrjr3orp9.execute-api.eu-central-1.amazonaws.com/dev/calculate", {
    //     sortedSizes,
    //   })
    //   .then(console.log)
    //   .catch((error) => console.log({ error }));

    let bestBins = bestFit(inputState.stockSizes1D[0].size, sortedSizes, inputState.bladeSize);

    setWorstState(bestBins);

    sortedSizes.forEach((size, index) => {
      const sizesWithoutOne = sortedSizes.filter((sizeItem, idx) => idx !== index);

      const currentBins = bestFit(
        inputState.stockSizes1D[0].size,
        sizesWithoutOne,
        inputState.bladeSize
      );

      const foundBin =
        Object.entries(currentBins)
          .filter(([key, value], index) => value.capacity >= size)
          .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0] || null;

      if (foundBin) {
        const [key, value] = foundBin;
        currentBins.wasteTotal -= size;
        currentBins[key].capacity -= size;
        currentBins[key].items.push(size);
      }

      if (currentBins.wasteTotal < bestBins.wasteTotal) {
        bestBins = currentBins;
      }
    });

    setResultState(bestBins);
  };

  return (
    <Layout>
      <Box as='main' maxW='7xl' mx='auto' width='full' py={["4", "16"]} position='relative'>
        <Stack position='absolute' top='0' left='-28' zIndex='20' pt='16'>
          <Stack width='16' boxShadow='base' rounded='md' bg='white' alignItems='center' py='4'>
            <ManuItemModal icon={FiFolder} title='Projects' />
            <ManuItemModal icon={FiSettings} title='Settings' />
            <ManuItemModal icon={FiUser} title='User' />
          </Stack>
        </Stack>
        <Stack direction={["column", "row"]} spacing='12' width='full'>
          <Stack width={["100%", "50%"]} bg='white' p='6' rounded='md' boxShadow='base'>
            <Cut1DInputs setInputState={setInputState} inputState={inputState} />
            <Text>Required Cuts</Text>
            <Box overflowX='auto'>
              <Box ref={jexcelRef} />
            </Box>
            <Box width='full'>
              <Button onClick={getResult} width='full'>
                Get Result
              </Button>
              <Button width='full' variant='unstyled'>
                Permutations checked: {permCount.current}
              </Button>
              <Button width='full' variant='unstyled'>
                Waste: {!resultState.wasteTotal ? 0 : resultState.wasteTotal.toFixed(2)}
              </Button>
            </Box>
          </Stack>
          <Stack spacing='6' width={["100%", "50%"]}>
            <Stack isInline spacing='6'>
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
            </Stack>
            <Stack>
              <Stack
                isInline
                fontSize='xs'
                bg='white'
                p='6'
                rounded='md'
                boxShadow='base'
                overflowX='auto'
              >
                <Stack isInline>
                  {/* {JSON.stringify(resultState, null, 2)} */}
                  {/* {Object.entries(resultState).map(([key, value], index) => {
                    return (
                      <Stack isInline py='1' spacing='0' alignItems='center'>
                        <Box width='8'>
                          <Text>{+key + 1}</Text>
                        </Box>
                        {value.items.map((item) => {
                          if (item === inputState.bladeSize) return null;
                          return (
                            <Box border='1px solid' px='2' py='1'>
                              <Text>{item}</Text>
                            </Box>
                          );
                        })}
                      </Stack>
                    );
                  })} */}

                  <Box Box as='pre' mr='20'>
                    <Text>BFD</Text>
                    {JSON.stringify(worstState, null, 2)}
                  </Box>
                  <Box Box as='pre'>
                    <Text>BFD improved</Text>
                    {JSON.stringify(resultState, null, 2)}

                    {/* {JSON.stringify(
                      Object.values(resultState).map((en, index) => ({
                        no: JSON.stringify(index + 1),
                        waste: JSON.stringify(en.capacity),
                        lengths: JSON.stringify(en.items),
                        summary: en.items.reduce((acc, next, idx) => {
                          acc["total-length"] =
                            acc["total-length"] === undefined ? next : acc["total-length"] + next;
                          acc["total-count"] =
                            acc["total-count"] === undefined ? 1 : acc["total-count"] + 1;
                          if (!acc[next]) {
                            acc[next] = 1;
                          } else {
                            acc[next] += 1;
                          }
                          return acc;
                        }, {}),
                      })),
                      null,
                      2
                    )} */}
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Layout>
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
        <Text>Stock Size</Text>
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
              {/* <Input
                name='cost'
                width='full'
                type='number'
                placeholder='cost'
                defaultValue={cost}
                onChange={handleChange}
              /> */}
            </Stack>
          );
        })}
        {/* <Box width='full'>
          <Button width='full' onClick={handleAddStock}>
            +
          </Button>
        </Box> */}
      </Stack>
      <Stack>
        {/* {inputState.input1D.map(({ size, count }, index) => {
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
        })} */}
        {/* <Box width='full'>
          <Button width='full' onClick={handleAddCut}>
            +
          </Button>
        </Box> */}
      </Stack>
    </Stack>
  );
}
