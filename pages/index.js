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
        [700, 2],
        [180, 10],
      ],
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

  const getData = () => {
    jexcelRef.current.jexcel.getData();
  };

  return { jexcelRef, sortedSizes };
}

// const JexcelComponent = (props) => {
//   const jexcelRef = React.useRef(null);

//   React.useEffect(() => {
//     var data = [
//       ["800", "3"],
//       ["300", "9"],
//       ["500", "2"],
//     ];
//     window.jexcel(jexcelRef.current, {
//       data: data,
//       minDimensions: [2, 3],
//       defaultColWidth: 200,
//       csvHeaders: true,
//       tableOverflow: true,
//       columns: [
//         { type: "numeric", title: "Length" },
//         { type: "numeric", title: "Quantity" },
//       ],
//       updateTable: function (instance, cell, col, row, val, label, cellName) {
//         console.log({ instance, cell, col, row, val, label, cellName });
//       },
//     });
//   }, []);

//   const addRow = () => {
//     jexcelRef.current.jexcel.insertRow();
//   };

//   const download = () => {
//     jexcelRef.current.jexcel.download();
//   };

//   return (
//     <Box>
//       <Box ref={jexcelRef} />
//       <Stack>
//         {/* <Box>
//           <Button onClick={addRow}>Add Row</Button>
//         </Box> */}
//         <Box mt='6'>
//           <Button onClick={download}>Download</Button>
//         </Box>
//       </Stack>
//     </Box>
//   );
// };

import dynamic from "next/dynamic";

const ReactDataGrid = dynamic(() => import("react-data-grid"), { ssr: false });
// function main() {
//   let binSize = 10;
//   let sizes = [6, 1, 5, 5, 5, 4, 2, 2, 7];
//   const result = bestFit(binSize, sizes);
// }

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
  { key: "count", name: "Count" },
];

const rows = [
  { id: 0, title: "row1", count: 20 },
  { id: 1, title: "row1", count: 40 },
  { id: 2, title: "row1", count: 60 },
];

function bestFit(binSize, sizes, bladeSize) {
  const bins = {};

  sizes.forEach((size, index) => {
    const foundBin =
      Object.entries(bins)
        .filter(([key, value], index) => value.capacity >= size) // => visi kandidatai = > []
        .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0] || null; // => []

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

  return bins;
}

// const parts = [
//   { size: 1560, quantity: 3 },
//   { size: 610, quantity: 4 },
//   { size: 520, quantity: 2 },
//   { size: 700, quantity: 2 },
//   { size: 180, quantity: 10 },
// ];

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
  const [resultLoss, setResultLoss] = React.useState(0);

  const { jexcelRef, sortedSizes } = useExcel();

  React.useEffect(() => {
    console.log({ sortedSizes });
    const bins = bestFit(inputState.stockSizes1D[0].size, sortedSizes, inputState.bladeSize);
    setResultState(bins);
  }, [inputState, sortedSizes]);

  React.useEffect(() => {
    const loss = Object.values(resultState).reduce((acc, next) => {
      return (acc += next.capacity);
    }, 0);
    setResultLoss(loss);
  }, [resultState]);

  // FiUser, FiSettings, FiFolder

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
              <Button width='full' variant='unstyled'>
                Loss: {resultLoss.toFixed(2)}
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
                <Box>
                  {/* {JSON.stringify(resultState, null, 2)} */}
                  {Object.entries(resultState).map(([key, value], index) => {
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
                  })}
                  {/* <Box Box as='pre'>
                    {JSON.stringify(
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
                    )}
                  </Box> */}
                </Box>
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
