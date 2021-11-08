/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import ReactGa from 'react-ga'
import dynamic from 'next/dynamic';
import { Box, Stack, VStack, HStack, Button, Text, Input, Checkbox } from '@chakra-ui/react';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
const RenderPDFViewer = dynamic(() =>import('../components/PDFDocument1D') ,
 { ssr: false },);
import { PDFDocument } from '../components/PDFDocument1D'; // NO Server side render);
// const DownloadPDF = dynamic(() =>
// import('../components/PDFDocument1D/index').then((mod) => mod.DownloadPDF() ),
// { ssr: false }, // NO Server side render
// )
// const DynamicComponent = dynamic(() =>
//   import('../components/hello').then((mod) => mod.Hello)
// )
import { Layout } from '../components';
import XLSX from 'xlsx';
import { StockSheet, CutsSheet } from '../components/sheets';

import Script from 'next/script';
import '../node_modules/jspreadsheet-ce/dist/jspreadsheet.css';
import { useWebworker} from '../utils/hooks/use-webworker'
import { RiFileExcel2Line, RiCalculatorLine, RiFilePdfFill } from 'react-icons/ri';
import testNo1 from '../utils/tests';
import { todayDateEurope } from '../components/PDFDocument1D';
// const PDFDocument1DNOSSR = dynamic(
//   () => import("../components/PDFDocument1D"),
//   { ssr: false }, // NO Server side render
// );

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
  const {result, run} = useWebworker();
  const [timeInterval, setTimeInterval] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
 
  const defaultData = {
    bladeSize: bladeSize,
    projectName: projectName,
    groupIndentical: groupIndentical,
    showAngles: showAngles,
    showNames: showNames,
  };
  React.useEffect(() => {
    ReactGa.initialize('UA-210625338-1');
    ReactGa.pageview('/app'); // Sends a pageview to GA
    setIsClient(true)// No SSR
    const changeTableFonstSize = () =>{
      if(window.innerWidth<=1000){
        const aba =document.getElementsByTagName('td');
        for (const key in aba) {
          if (Object.prototype.hasOwnProperty.call(aba, key)) {
            const element = aba[key];
            element.style.fontSize="8px";
          }
        }
    } else {
        const aba =document.getElementsByTagName('td');
        for (const key in aba) {
          if (Object.prototype.hasOwnProperty.call(aba, key)) {
            const element = aba[key];
            element.style.fontSize="16px";
          }
        }
    }
   };
  //  const changeTableColumnWidth =() =>{
  //   const abi =document.getElementsByTagName('col');
  //   abi[1].style.width="40px"
  //   abi[2].style.width="40px"
  //   abi[4].style.width="20px"
  //   abi[6].style.width="40px"
  //   abi[7].style.width="40px"
  //   abi[11].style.width="20px"
     //console.log(abi);
  //  }
  const downloadPDF_GA=()=>{
    ReactGa.event({ // Sends data to GA
      category:'DownloadPDF',
      label:'DownloadPDF',
      action:'DownloadPDF',
    })
  }
    document.getElementById('downloadPDF').addEventListener("click", downloadPDF_GA);
    window.addEventListener("load", changeTableFonstSize);   
    //window.addEventListener("load", changeTableColumnWidth); 
    window.addEventListener("resize", changeTableFonstSize);
    //window.addEventListener("click", changeTableFonstSize);
  }, [])


  const handleClick = async () => {
    try {
      if(timeInterval){
        setTimeInterval(false);
        setIsLoading(true);
        // @ts-ignore
        const data ={
          stockItems,
          cutItems,
          bladeSize,
          constantD,
        }
        run(data);
        const stringifiedData=JSON.stringify(data)
        ReactGa.event({ // Sends data to GA
          category:'Calculate',
          label:'Calculate',
          action:stringifiedData,
        })
        setTimeout(() => {setTimeInterval(true)
        }, 3000);
      } 
    } catch (e) {
      //setResult([]);
      console.log(e);
      setIsLoading(false);
    }
  };
  // const handleTest1 = async () => {
  //   try {
  //     if(timeInterval){
  //       setTimeInterval(false);
  //       setIsLoading(true);
  //       // @ts-ignore
  //       const stockItems=testNo1().stockItems
  //       const cutItems=testNo1().cutItems
  //       const data1 ={
  //         stockItems,
  //         cutItems,
  //         bladeSize,
  //         constantD,
  //       }
  //       console.log(data1);
  //       run(data1);
  //       setTimeout(() => {setTimeInterval(true)
  //       }, 3000);
  //     } 
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Layout>
      <Script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></Script>
      <Script src="https://jsuites.net/v4/jsuites.js"></Script>
      <Box as="main" width="full" height="full">
        <Stack direction={["column", "row"]} width="full" height="full" p="3">
          <Box width={["100%", "50%"]} minWidth={"350px"} >
            <Stack bg="white" rounded="md" boxShadow="base" p="2">
              
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
                <Stack justifyContent="space-between" direction="row" >
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
              <Box disabled={isLoading} pb="5">
                <StockSheet setStockTableValues={setStockTableValues} />
              </Box>
              <Box disabled={isLoading}>
                <CutsSheet setCutsTableValues={setCutsTableValues} />
              </Box>
              <VStack direction="column" spacing="5px">  
                  <Button width="full" bg="gray.900" color="white" _hover={{}} onClick={handleClick} p="5" leftIcon={<RiCalculatorLine />}>
                    Calculate
                  </Button>
                  {/* <Button id="Test1" onClick={handleTest1}> Test1</Button> */}
                  <ButtonsResultExport resultXLS={result} defaultData={defaultData}></ButtonsResultExport>
                  <Button width="full" bg="gray.900" color="white" _hover={{}} margin="0px" leftIcon={<RiFilePdfFill/>}>
                    <Box id="downloadPDF"> 
                      <RenderPDFViewer something={result} defaultData={defaultData} buttonView={true}/>
                    </Box>
                  </Button>
              </VStack>  
            </Stack>
          </Box>
          <Stack width={['100%', '50%']} height={['700px', 'auto']} minH="full"maxH="1500px" >
            <RenderPDFViewer something={result} defaultData={defaultData} buttonView={false}/>
            {/* <>
              {isClient && <PDFViewer key={1} style={{ width: "100%", height: "100%", maxHeight: "2000px" }}>
               <PDFDocument1DNOSSR something={result} defaultData={defaultData} />
              </PDFViewer>}
            </> */}
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
      const dataUsed = JSON.stringify({
        groupIndentical:defaultData.groupIndentical,
        showAngles:defaultData.showAngles,
        showNames:defaultData.showNames
      })
        ReactGa.event({ // Sends data to GA
          category:'DownloadXLS',
          label:'DownloadXLS',
          action: dataUsed,
        })
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
    XLSX.writeFile(wb, "cut_result_" + todayDateEurope() + ".xlsx");
  };
  return (
    <Stack isInline width="full">
        <Button onClick={ExportData} width="full" bg="gray.900" color="white" boxShadow="base" _hover={{}} margin="0px"
        id="exportXls" leftIcon={<RiFileExcel2Line />}  >
          Download XLS
        </Button>
    </Stack>
  );
}
