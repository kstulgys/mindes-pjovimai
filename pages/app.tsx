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
  Tr,
  Th,
  Td,
  useToast,
  Checkbox,
  Icon,
} from "@chakra-ui/react";
// import { Layout } from "../components";
// import { useAuthUser } from "../utils";
// import { useStore } from "../store";
// import { DragHandleIcon, CloseIcon } from "@chakra-ui/icons";
// import { PDFDocument1D } from "../components/PDFDocument1D";
// import XLSX from "xlsx";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import { ListStockItems } from "../components/ListStockItems";
// import { ListCutItems } from "../components/ListCutItems";
import fetch from "node-fetch";
import { StockSheet, CutsSheet } from "../components/sheets";
import "../node_modules/jspreadsheet-ce/dist/jexcel.css";

export default function App() {
  const [bladeSize, setBladeSize] = React.useState(10);
  const [constantD, setconstantD] = React.useState(3);
  const [stockItems, setStockTableValues] = React.useState([]);
  const [cutItems, setCutsTableValues] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const workerRef = React.useRef();

  React.useEffect(() => {
    workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
    workerRef.current.onmessage = (event) => setResult(event.data);
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      workerRef.current.postMessage({
        stockItems,
        cutItems,
        bladeSize,
        constantD,
      });
    } catch (e) {
      setResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Blade</h2>
      <input
        type="number"
        value={bladeSize}
        onChange={(e) => setBladeSize(e.target.valueAsNumber)}
      />
      <h2>Time limit for optimisation, s</h2>
      <input
        type="number"
        value={constantD}
        onChange={(e) => setconstantD(e.target.valueAsNumber)}
      />
      <h2>Stock (Max 20 rows)</h2>
      <StockSheet setStockTableValues={setStockTableValues} />
      <h2>Cuts (Max 100 rows)</h2>
      <CutsSheet setCutsTableValues={setCutsTableValues} />
      <div>
        <button onClick={handleClick}>Get result</button>
      </div>
      <h2>Result</h2>
      <div>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export function WorkerButton() {
  const workerRef = React.useRef();
  React.useEffect(() => {
    workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
    workerRef.current.onmessage = (evt) =>
      alert(`WebWorker Response => ${evt.data}`);
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const handleWork = React.useCallback(async () => {
    workerRef.current.postMessage(100000);
  }, []);

  return (
    <div>
      <p>Do work in a WebWorker!</p>
      <button onClick={handleWork}>Do Stuff</button>
    </div>
  );
}

// // import { FiCheckSquare, FiSquare } from 'react-icons/fi'
// function AppPage() {
//   const [count, setCount] = React.useState(1);
//   const { isLoading: isUserLoading, user } = useAuthUser();

//   const [bladeSize, setBladeSize] = React.useState(10);
//   const [constantD, setconstantD] = React.useState(3);
//   const [stockItems, setStockTableValues] = React.useState([]);
//   const [cutItems, setCutsTableValues] = React.useState([]);
//   const [result, setResult] = React.useState([]);
//   const [isLoading, setIsLoading] = React.useState(false);

//   const handleClick = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/calculate", {
//         method: "POST", // *GET, POST, PUT, DELETE, etc.
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ stockItems, cutItems, bladeSize, constantD }), // body data type must match "Content-Type"
//       });

//       const result = await response.json(); // parses JSON response into native JavaScript objects
//       // console.log({ result });
//       setResult(result);
//     } catch (e) {
//       setResult([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     setCount((prev) => prev++);
//   }, [result]);

//   if (isUserLoading) return null;

//   return (
//     <Layout>
//       <Box as="main" mx="auto" width="full" py={["12"]} height="full">
//         {/* <ButtonsSwitch1D2D /> */}
//         <Stack direction={["column", "row"]} spacing="12" width="full">
//           <Box width={["100%", "40%"]}>
//             <Stack bg="white" p="6" rounded="md" boxShadow="base">
//               <Cut1DInputs />
//               <Text fontSize="lg" fontWeight="semibold">
//                 Cuts
//               </Text>
//               <ListCutItems />
//               <Box width="full">
//                 <Button
//                   isDisabled={!!errors.inputMessage}
//                   onClick={handleGetResult}
//                   width="32"
//                   bg="gray.900"
//                   color="white"
//                   _hover={{}}
//                 >
//                   Get Result
//                 </Button>
//               </Box>
//             </Stack>
//           </Box>

//           <Stack spacing="6" width={["100%", "60%"]} minH="100vh">
//             <PDFViewer key={count} style={{ width: "100%", height: "100%" }}>
//               <PDFDocument1D />
//             </PDFViewer>
//             {/* <ButtonsResultExport /> */}
//           </Stack>
//         </Stack>
//       </Box>
//     </Layout>
//   );
// }

// function Cut1DInputs() {
//   const bladeSize = useStore((store) => store.bladeSize);
//   const projectName = useStore((store) => store.projectName);

//   const handleBladeSizeChange = useStore(
//     (store) => store.handleBladeSizeChange
//   );

//   const handleProjectNameChange = useStore(
//     (store) => store.handleProjectNameChange
//   );

//   return (
//     <Stack spacing="6" pb="4">
//       <Stack>
//         <Text fontWeight="semibold" fontSize="lg">
//           Project name
//         </Text>
//         <Input
//           value={projectName}
//           placeholder="project name"
//           onChange={handleProjectNameChange}
//         />
//       </Stack>
//       <Stack>
//         <Text fontWeight="semibold" fontSize="lg">
//           Blade Size
//         </Text>
//         <Input
//           type="number"
//           value={bladeSize}
//           placeholder="blade size"
//           onChange={handleBladeSizeChange}
//         />
//       </Stack>
//       <Stack spacing="2">
//         <Text fontWeight="semibold" fontSize="lg">
//           Stock
//         </Text>
//         <ListStockItems />
//       </Stack>
//     </Stack>
//   );
// }

// function ButtonsResultExport() {
//   const { result } = useStore();

//   const ExportData = () => {
//     if (!result.length) return;

//     const data = result.map(
//       ([key, { count, capacity, items, stockLength }]) => {
//         const reducer = (acc, { name, size }, index) => {
//           const innerText = name ? ` ([${name}] ${size}) ` : ` ${size} `;
//           return acc.concat(innerText);
//         };

//         const cutList = items.reduce(reducer, "");

//         return {
//           Quantity: count,
//           "Stock length": stockLength,
//           "Cut list": cutList,
//           "Waste (mm)": capacity,
//         };
//       }
//     );
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Data");
//     XLSX.writeFile(wb, "stock_cut_result_" + Date.now().toString() + ".xlsx");
//   };

//   return (
//     <Stack isInline spacing="4">
//       <Box>
//         <Button
//           onClick={ExportData}
//           width="32"
//           bg="gray.900"
//           color="white"
//           boxShadow="base"
//           _hover={{}}
//         >
//           Export XLS
//         </Button>
//       </Box>
//       {/* <Box>
//         <PDFDownloadLink
//           document={<PDFDocument1D />}
//           fileName={'stock_cut_result_' + Date.now().toString()}
//         >
//           <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
//             Export PDF
//           </Button>
//         </PDFDownloadLink>
//       </Box> */}
//     </Stack>
//   );
// }

// export default AppPage;
