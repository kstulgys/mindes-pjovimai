import React from "react";
import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import axios from "axios";
import { Layout } from "../components";
import { useRouter } from "next/router";
import { FiUser, FiSettings, FiFolder } from "react-icons/fi";
import { Auth } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifyChatbot } from '@aws-amplify/ui-react'




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
    if(!Boolean(window.jexcel)) return
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

      // const foundSameItems = Object.entries(bins).find(
      //   ([key, { items }], index) => JSON.stringify(items) === JSON.stringify(value.items)
      // );

      // if (foundSameItems){

      // }

      bins[key].capacity = +(value.capacity - size).toFixed(2);
      bins[key].items.push(size);
      if (bins[key].capacity >= bladeSize) {
        bins[key].capacity = +(bins[key].capacity - bladeSize).toFixed(2);
        bins[key].items.push(bladeSize);
      }
      bins[key].stockLength = binSize;
      bins[key].capacityPercent = Math.round((value.capacity * 100) / binSize);
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
      bins[nextIdx].stockLength = binSize;
      bins[nextIdx].capacityPercent = Math.round((bins[nextIdx].capacity * 100) / binSize);
    }
  });

  //   const wasteTotal = Object.values(bins).reduce((acc, { capacity }) => (acc += capacity), 0);
  return bins;
}

// const appUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000/api/hello"
//     : "https://mindes-pjovimai.vercel.app/api/hello";

function AppPage() {
  const user = useProtectedClient()
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

  if (!user){
    return (
      <Box bg='gray.900'>
        <AmplifyAuthenticator/>
      </Box>
    )
  }


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

  function getFormatedResult(bins, bladeSize) {
    let formattedResult = {};

    Object.entries(bins).forEach(([keyCurrent, values]) => {
      if (formattedResult[JSON.stringify(values.items)]) {
        formattedResult[JSON.stringify(values.items)].count++;
      } else {
        if (!values.items) return;
        formattedResult[JSON.stringify(values.items)] = {
          ...values,
          items: values.items.filter((item) => item !== bladeSize),
          count: 1,
        };
      }
    });
    return formattedResult;
  }

  function getSummary(data) {
    const result = getFormatedResult(data);
    return Object.entries(result).reduce(
      (acc, [key, { count, capacity, items, stockLength, capacityPercent }]) => {
        acc.totalCount += count;
        acc.stocks[stockLength] = acc.stocks[stockLength] ? acc.stocks[stockLength] + count : count;
        acc.wastePercent[stockLength] = acc.wastePercent[stockLength]
          ? acc.wastePercent[stockLength] + capacityPercent
          : capacityPercent;
        acc.wasteLength[stockLength] = acc.wasteLength[stockLength]
          ? acc.wasteLength[stockLength] + capacity
          : capacity;

        return acc;
      },
      { totalCount: 0, stocks: {}, wastePercent: {}, wasteLength: {} }
    );
  }

  const summary = getSummary(resultState);

  return (
    <Layout>
      <Box as='main' mx='auto' width='full' py={["12"]}>
        <Stack direction={["column", "row"]} spacing='6' width='full'>
          <Stack width={["100%", "40%"]} bg='white' p='6' rounded='md' boxShadow='base'>
            <Cut1DInputs setInputState={setInputState} inputState={inputState} />
            <Text>Required Cuts</Text>
            <Box overflowX='auto'>
              <Box ref={jexcelRef} />
            </Box>
            <Box width='full'>
              <Button onClick={getResult} width='full' bg='gray.900' color='white' _hover={{}}>
                Get Result
              </Button>
            </Box>
          </Stack>
          <Stack spacing='6' width={["100%", "60%"]}>
            <Stack isInline spacing='6' width='full'>
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
              <Box width='33%' height='32' bg='white' rounded='md' boxShadow='base' />
            </Stack>
            <Stack
              isInline
              fontSize='xs'
              bg='white'
              p='6'
              rounded='md'
              boxShadow='base'
              overflowX='auto'
            >
              <Stack width='full'>
                <Table size='sm' id='table-to-xls'>
                  <Thead>
                    <Tr>
                      <Th px='2'>Quantity</Th>
                      <Th px='2'>Stock length</Th>
                      <Th px='2'>Cut list</Th>
                      <Th px='2'>Waste</Th>
                      <Th px='2'></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(getFormatedResult(resultState, inputState.bladeSize)).map(
                      ([key, { count, capacity, items, stockLength, capacityPercent }]) => {
                        let level = 0;
                        const tr = items.reduce((acc, next, idx) => {
                          if ((idx + 1) % 9 === 0) {
                            level++;
                          }
                          if (!acc[level]) {
                            acc[level] = [next];
                          } else {
                            acc[level].push(next);
                          }
                          return acc;
                        }, []);

                        return (
                          <Tr key={key}>
                            <Td px='2'>{count}</Td>
                            <Td px='2'>{stockLength}</Td>
                            {/* <Td px='2' maxW='xs'>
                              <Box display='inline-flex' flexWrap='wrap'> */}
                            <Td px='2' pb='1'>
                              {tr.map((itemArr, idx) => {
                                return (
                                  <Tr key={idx} p='0'>
                                    {itemArr.map((item) => {
                                      return (
                                        <Td p='0' m='0'>
                                          <Box
                                            px='1'
                                            mb='1'
                                            mr='1'
                                            border='1px solid'
                                            borderColor='gray.900'
                                            rounded='sm'
                                          >
                                            <Text>{item}</Text>
                                          </Box>
                                        </Td>
                                      );
                                    })}
                                  </Tr>
                                );
                              })}
                            </Td>
                            <Td px='2'>{capacity}</Td>
                            <Td px='2'>{capacityPercent} %</Td>
                          </Tr>
                        );
                      }
                    )}
                  </Tbody>

                  <Tfoot>
                    <Tr>
                      {Object.entries(summary.stocks).map(([key, value]) => {
                        return (
                          <>
                            <Th px='2'>
                              <Text>
                                {value} x {key}
                              </Text>
                            </Th>
                            <Th px='2'>
                              <Text>{Math.round(+value * +key)}</Text>
                            </Th>
                          </>
                        );
                      })}
                      <Th px='2'></Th>
                      {Object.entries(summary.wasteLength).map(([key, value]) => {
                        return (
                          <Th px='2'>
                            <Text>
                              {key} - {value}
                            </Text>
                            <Text>
                              {Math.round((value * 200) / (+key * +summary.stocks[key]))}%/200m
                            </Text>
                          </Th>
                        );
                      })}
                      {Object.entries(summary.wastePercent).map(([key, value]) => {
                        return (
                          <Th px='2'>
                            <Text>
                              {key} - {value} %
                            </Text>
                          </Th>
                        );
                      })}
                    </Tr>
                  </Tfoot>
                </Table>
              </Stack>
            </Stack>
            <Stack isInline spacing='4'>
              <Box>
                <Button bg='gray.900' color='white' boxShadow='base' _hover={{}}>
                  Export XLS
                </Button>
              </Box>
              <Box>
                <Button bg='gray.900' color='white' boxShadow='base' _hover={{}}>
                  Export PDF
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {/* <AmplifyChatbot
        botName="yourBotName"
        botTitle="My ChatBot"
        welcomeMessage="Hello, how can I help you?"
      /> */}
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

function useProtectedClient(){
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
      Auth.currentAuthenticatedUser()
        .then(user => setUser(user))
        .catch(() => setUser(null))
    }, [])

  return user
}

// function withAuth(WrappedComponent) {
//   const user = useProtectedClient()

//   if (!user){
//     return (
//       <AmplifyAuthenticator>
//         <div>
//           My App
//           <AmplifySignOut />
//         </div>
//       </AmplifyAuthenticator>
//     )
//   }

//   return <WrappedComponent/>
// } 

//   return <WrappedComponent/>
  // return class extends React.Component {
  //   componentDidUpdate(prevProps) {
  //     console.log('Current props: ', this.props);
  //     console.log('Previous props: ', prevProps);
  //   }
  //   render() {
  //     // Wraps the input component in a container, without mutating it. Good!
  //     return <WrappedComponent {...this.props} />;
  //   }
  // }

export default AppPage