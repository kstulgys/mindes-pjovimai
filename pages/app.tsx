/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { Box, Stack, Button, Text, Input, Checkbox } from "@chakra-ui/react";
import { Layout } from "../components";
import XLSX from "xlsx";
import { StockSheet, CutsSheet } from "../components/sheets";
import dynamic from "next/dynamic";
import Script from "next/script";

//import { useWorker } from '../utils/hooks';
import { useWebworker } from "../utils/hooks/use-webworker";

const PDFDocument1DNOSSR = dynamic(
  () => import("../components/PDFDocument1D"),
  { ssr: false }, // NO Server side render
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
  const [isLoading, setIsLoading] = React.useState(false);
  const { result, run } = useWebworker();

  const defaultData = {
    bladeSize: bladeSize,
    projectName: projectName,
    groupIndentical: groupIndentical,
    showAngles: showAngles,
    showNames: showNames,
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      // @ts-ignore
      await run({
        stockItems,
        cutItems,
        bladeSize,
        constantD,
      });
      // console.log(result);
    } catch (e) {
      //setResult([]);
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></Script>
      <Script src="https://jsuites.net/v4/jsuites.js"></Script>
      {/* <Text marginTop="20px" marginBottom="5px" fontStyle="myriad-pro-1" fontSize="lg" fontWeight="semibold">
        YOMPTI Your optimisation tool 
      </Text> */}
      <Box as="main" mx="auto" width="full" py={["6"]} height="full">
        <Stack direction={["column", "row"]} spacing="6" width="full">
          <Box width={["100%", "40%"]}>
            <Stack bg="white" p="6" rounded="md" boxShadow="base">
              <Stack spacing="10px" direction="row">
                <Checkbox size="sm" isChecked={groupIndentical} onChange={(e) => setGroupIndentical(!groupIndentical)}>
                  {" "}
                  Group indentical parts{" "}
                </Checkbox>
                <Checkbox size="sm" isChecked={showAngles} onChange={(e) => setShowAngles(!showAngles)}>
                  {" "}
                  Show angles{" "}
                </Checkbox>
                <Checkbox size="sm" isChecked={showNames} onChange={(e) => setShowNames(!showNames)}>
                  {" "}
                  Show names{" "}
                </Checkbox>
              </Stack>
              <Box spacing="10px">
                <Text fontSize="lg" fontWeight="semibold">
                  Project Name
                </Text>
              </Box>
              <Input type="string" value={projectName} placeholder={projectName} onChange={(e) => setProjectName(e.target.value)} />
              <Text fontSize="lg" fontWeight="semibold">
                Blade size
              </Text>
              <Input type="number" value={bladeSize} onChange={(e) => setBladeSize(e.target.valueAsNumber)} />
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
                {/* <Button width="full" bg="gray.900" color="white" _hover={{}} margin="0px">
                  Get result
                </Button> */}
                <Button width="full" bg="gray.900" color="white" _hover={{}} onClick={handleClick} margin="0px">
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
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}
function ButtonsResultExport({ resultXLS, defaultData }) {
  const ExportData = () => {
    // angle1Item1,nameItem1,lengthItem1,quantityItem1,angle2Item1, cut 10,waste
    const dataB = () => {
      const transformedForXLS = [];
      function isPositive(e) {
        if (e < 0) return 0;
        return e;
      }
      resultXLS.forEach((element, index) => {
        let index2 = 1;
        transformedForXLS[index] = {
          stockName: element.stockName,
          stockLength: element.stockLength,
          quantity: element.quantity,
          waste: isPositive(element.waste),
          "cuts->": "",
        };
        element.items.forEach((item) => {
          if (!defaultData.groupIndentical) {
            for (let i = 0; i < item.cutQuantity; i++) {
              if (defaultData.showAngles) transformedForXLS[index]["cut" + index2 + "Angle1"] = item.angle1;
              if (defaultData.showNames) transformedForXLS[index]["cut" + index2 + "Name"] = item.cutName;
              transformedForXLS[index]["cut" + index2 + "Length"] = item.cutLength;
              if (defaultData.showAngles) transformedForXLS[index]["cut" + index2 + "Angle2"] = item.angle2;
              transformedForXLS[index]["cut" + index2 + " Blade"] = defaultData.bladeSize;
              index2++;
            }
          } else {
            if (defaultData.showAngles) transformedForXLS[index]["cut" + index2 + "Angle1"] = item.angle1;
            if (defaultData.showNames) transformedForXLS[index]["cut" + index2 + "Name"] = item.cutName;
            transformedForXLS[index]["cut" + index2 + "Length"] = item.cutLength;
            transformedForXLS[index]["cut" + index2 + "Quantity"] = item.cutQuantity;
            if (defaultData.showAngles) transformedForXLS[index]["cut" + index2 + "Angle2"] = item.angle2;
            transformedForXLS[index]["cut" + index2 + " Blade"] = defaultData.bladeSize;
            index2++;
          }
        });
      });
      return transformedForXLS;
    };
    const ws = XLSX.utils.json_to_sheet(dataB());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "stock_cut_result_" + Date.now().toString() + ".xlsx");
  };
  return (
    <Stack isInline spacing="10">
      <Box width="full" marginTop="10px">
        <Button onClick={ExportData} width="full" bg="gray.900" color="white" boxShadow="base" _hover={{}} margin="0px">
          Export XLS
        </Button>
      </Box>
    </Stack>
  );
}
