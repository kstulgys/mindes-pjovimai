import React from "react";
import {
  Slider,
  Image,
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
import { Layout } from "../components";
import { useAuthUser } from "../utils";
import { useStore } from "../store";
import { DragHandleIcon, CloseIcon } from "@chakra-ui/icons";
import XLSX from "xlsx";
import fetch from "node-fetch";
import { ListCutItems } from "../components/ListCutItems";
import { StockSheet, CutsSheet } from "../components/sheets";
import "../node_modules/jspreadsheet-ce/dist/jexcel.css";
import dynamic from "next/dynamic";
import { arrayMove } from "@dnd-kit/sortable";
const PDFDocument1DNOSSR = dynamic(
  () => import("../components/PDFDocument1D"),
  { ssr: false } // NO Server side render
);

//PDFDocument1D
export default function App() {
  const [groupIndentical, setGroupIndentical] = React.useState(true);
  const [showNames, setShowNames] = React.useState(true);
  const [showAngles, setShowAngles] = React.useState(true);
  const [count, setCount] = React.useState(1);
  const [projectName, setProjectName] = React.useState("Project-01");
  const [bladeSize, setBladeSize] = React.useState(10);
  const [constantD, setconstantD] = React.useState(4); // Time limit for calculation, s
  const [stockItems, setStockTableValues] = React.useState([]);
  const [cutItems, setCutsTableValues] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const workerRef = React.useRef();
  const defaultData={
    bladeSize:bladeSize,
    projectName:projectName,
    groupIndentical:groupIndentical,
    showAngles:showAngles,
    showNames:showNames};

  React.useEffect(() => {
    workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
    workerRef.current.onmessage = (event) => {
      console.log(event.data);
      setResult(event.data);
      setIsLoading(false);
    };
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
      setIsLoading(false);
    }
  };

  return (

    <Layout>
      {/* <Text marginTop="20px" marginBottom="5px" fontStyle="myriad-pro-1" fontSize="lg" fontWeight="semibold">
        YOMPTI Your optimisation tool 
      </Text> */}
      <Box as="main" mx="auto" width="full" py={["6"]} height="full">
        <Stack direction={["column", "row"]} spacing="6" width="full">
          <Box width={["100%", "40%"]} >
            <Stack bg="white" p="6" rounded="md" boxShadow="base">
              <Stack spacing="10px" direction="row">
                <Checkbox size="sm" isChecked={groupIndentical} onChange={(e) => setGroupIndentical(!groupIndentical)} fontSize="lg"> Group indentical parts  </Checkbox>
                <Checkbox size="sm" isChecked={showAngles} onChange={(e) => setShowAngles(!showAngles)}> Show angles  </Checkbox>
                <Checkbox size="sm"  isChecked={showNames} onChange={(e) => setShowNames(!showNames)} > Show names  </Checkbox>
              </Stack>
              <Box spacing="10px">
              <Text fontSize="lg" fontWeight="semibold" >Project Name</Text> 
              </Box>
                <Input
                type="string"
                  value={projectName}
                  placeholder={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Text fontSize="lg" fontWeight="semibold">Blade size</Text>
                <Input
                  type="number"
                  value={bladeSize}
                  onChange={(e) => setBladeSize(e.target.valueAsNumber)}
                />
                {/* <h2>Time limit for optimisation, s</h2>
                <input
                  type="number"
                  value={constantD}
                  onChange={(e) => setconstantD(e.target.valueAsNumber)}
                /> */} 

                <Text fontSize="lg" fontWeight="semibold">
                  Stock (Max 20 rows)
                </Text>
                {/* <ListCutItems></ListCutItems> */}
                <Box disabled={isLoading}>
                  <StockSheet setStockTableValues={setStockTableValues} /> 
                </Box>
                <Text fontSize="lg" fontWeight="semibold">
                  Cuts (Max 100 rows)
                </Text>
                <Box disabled={isLoading}>
                  <CutsSheet setCutsTableValues={setCutsTableValues} />
                </Box>

                <Box width="full">
                  <Button
                    width="45"
                    bg="gray.900"
                    color="white"
                    _hover={{}}
                    onClick={handleClick}
                    margin="5px"
                  >
                    Get result
                  </Button>
                  
                  <ButtonsResultExport resultXLS={result} defaultData={defaultData}></ButtonsResultExport>
                </Box>
                {/* <h2>Result</h2>
                <div>
                   {isLoading ? (
                    <h1>Loading...</h1>
                  ) 
                  : (
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  )
                  }
                </div> */}
             
            </Stack>
          </Box>
          <Stack spacing="2" width={["100%", "60%"]} minH="100vh">
            {/* <PDFViewer style={{ width: "100%", height: "100%" }}> */}
            {/* key={count} */}
          
            <PDFDocument1DNOSSR something={result} defaultData={defaultData} /> 
            {/* something={JSON.stringify(result, null, 2)}
            {/* something={isLoading ? (
                    <h1></h1>
                  ) : (
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  )}/> */}
            {/* </PDFViewer>  */}
            {/* <ButtonsResultExport /> */}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

// export function WorkerButton() {
//   const workerRef = React.useRef();
//   React.useEffect(() => {
//     workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
//     workerRef.current.onmessage = (evt) =>
//       alert(`WebWorker Response => ${evt.data}`);
//     return () => {
//       workerRef.current.terminate();
//     };
//   }, []);

//   const handleWork = React.useCallback(async () => {
//     workerRef.current.postMessage(100000);
//   }, []);

//   return (
//     <div>
//       <p>Do work in a WebWorker!</p>
//       <button onClick={handleWork}>Do Stuff</button>
//     </div>
//   );
// }

// // import { FiCheckSquare, FiSquare } from 'react-icons/fi'

// export default App;
// function App() {
//   const [count, setCount] = React.useState(1);
//   const { isLoading: isUserLoading, user } = useAuthUser();

//   const [bladeSize, setBladeSize] = React.useState(10);
//   const [constantD, setconstantD] = React.useState(3);
//   const [stockItems, setStockTableValues] = React.useState([]);
//   const [cutItems, setCutsTableValues] = React.useState([]);
//   const [result, setResult] = React.useState([]);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const workerRef = React.useRef();

//   React.useEffect(() => {
//     workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
//     workerRef.current.onmessage = (event) => {
//       console.log(" on message from worker");
//       setResult(event.data);
//       setIsLoading(false);
//     };
//     return () => {
//       workerRef.current.terminate();
//     };
//   }, []);

//   const handleClick = async () => {
//     try {
//       setIsLoading(true);
//       workerRef.current.postMessage({
//         stockItems,
//         cutItems,
//         bladeSize,
//         constantD,
//       });
//     } catch (e) {
//       setResult([]);
//       setIsLoading(false);
//     }
//   };
//   // React.useEffect(() => {
//   //   setCount((prev) => prev++);
//   // }, [result]);

//   if (isUserLoading) return null;

//   return (
//     <Layout>
//       <Box as="main" mx="auto" width="full" py={["12"]} height="full">
//         {/* <ButtonsSwitch1D2D /> */}
//         <Stack direction={["column", "row"]} spacing="12" width="full">
//           <Box width={["100%", "40%"]}>
//             <Stack bg="white" p="6" rounded="md" boxShadow="base">
//               {/* <Cut1DInputs /> */}
//               <Text fontSize="lg" fontWeight="semibold">
//                 Cuts
//               </Text>
//               <ListCutItems />
//               <Box width="full">
//                 <Button
//                   // isDisabled={!!errors.inputMessage}
//                   onClick={handleClick}
//                   //{handleGetResult}
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

function ButtonsResultExport({resultXLS, defaultData}) {
  const ExportData = () => {
  // angle1Item1,nameItem1,lengthItem1,quantityItem1,angle2Item1, cut 10,waste
  const dataB = () =>{
    const transformedForXLS = [];
    function isPositive(e){if(e<0) return 0; return e}
    resultXLS.forEach((element,index) => {
      let index2=1;
      transformedForXLS[index]={
      stockName:element.stockName,
      stockLength:element.stockLength,
      quantity:element.quantity,
      waste:isPositive(element.waste),
      "cuts->":""
      };
      element.items.forEach((item) => {
        if(!defaultData.groupIndentical){
          for (let i = 0; i < item.cutQuantity; i++) {
            if(defaultData.showAngles)transformedForXLS[index]["cut"+index2+"Angle1"]=item.angle1;
            if(defaultData.showNames)transformedForXLS[index]["cut"+index2+"Name"]=item.cutName;
            transformedForXLS[index]["cut"+index2+"Length"]=item.cutLength;
            if(defaultData.showAngles)transformedForXLS[index]["cut"+index2+"Angle2"]=item.angle2;
            transformedForXLS[index]["cut"+index2+" Blade"]=defaultData.bladeSize;
            index2++;
          }
        } else {
          if(defaultData.showAngles)transformedForXLS[index]["cut"+index2+"Angle1"]=item.angle1;
          if(defaultData.showNames)transformedForXLS[index]["cut"+index2+"Name"]=item.cutName;
          transformedForXLS[index]["cut"+index2+"Length"]=item.cutLength;
          transformedForXLS[index]["cut"+index2+"Quantity"]=item.cutQuantity;
          if(defaultData.showAngles)transformedForXLS[index]["cut"+index2+"Angle2"]=item.angle2;
          transformedForXLS[index]["cut"+index2+" Blade"]=defaultData.bladeSize;
          index2++;
          }
      });
    });
    return transformedForXLS;
  }
    const ws = XLSX.utils.json_to_sheet(dataB());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "stock_cut_result_" + Date.now().toString() + ".xlsx");
  };

  return (
    <Stack isInline spacing="4">
      <Box>
        <Button
          onClick={ExportData}
          width="32"
          bg="gray.900"
          color="white"
          boxShadow="base"
          _hover={{}}
          margin="5px"
        >
          Export XLS
        </Button>
      </Box>
      {/* <Box>
        <PDFDownloadLink
          document={<PDFDocument1D />}
          fileName={'stock_cut_result_' + Date.now().toString()}
        >
          <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
            Export PDF
          </Button>
        </PDFDownloadLink>
      </Box> */}
    </Stack>
  );
}

// export default AppPage;
