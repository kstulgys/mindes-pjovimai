import React from "react";
import { Box, Stack, Button, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import { Layout } from "../components";
import { useRouter } from "next/router";

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
    // const foundBin = Object.entries(bins).find(([key, value], index) => value.capacity >= size);
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

  return bins;
}

// const parts = [
//   { size: 1560, quantity: 3 },
//   { size: 610, quantity: 4 },
//   { size: 520, quantity: 2 },
//   { size: 700, quantity: 2 },
//   { size: 180, quantity: 10 },
// ];

// const cutSize = 10;

// const binSize = 1000;

// const appUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000/api/hello"
//     : "https://mindes-pjovimai.vercel.app/api/hello";

export default function Home() {
  const router = useRouter();
  // const [isLoading, setIsLoading] = React.useState(true);
  const [inputState, setInputState] = React.useState({
    bladeSize: 0.1,
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

  return (
    <Layout>
      <Box as='main' maxW='7xl' mx='auto' width='full' py='20'>
        <Stack isInline spacing='32'>
          <Stack flex='0.5'>
            <Cut1DInputs setInputState={setInputState} inputState={inputState} />
            <Text>Required Cuts</Text>
            <Box ref={jexcelRef} />
            <Box width='full'>
              <Button width='full' variant='unstyled'>
                Loss: {resultLoss.toFixed(2)}
              </Button>
            </Box>
            {/* <Stack py='10'>
              <Button  onClick={getResult}>
                Get Result
              </Button>
            </Stack> */}
          </Stack>
          <Stack flex='0.5' overflowX='auto'>
            <Stack isInline spacing='20' fontSize='xs'>
              {/* <Box>
                <Text fontSize='3xl' fontWeight='bold' pb='5'>
                  Input
                </Text>
                <pre>{JSON.stringify(inputState, null, 2)}</pre>
              </Box> */}
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
