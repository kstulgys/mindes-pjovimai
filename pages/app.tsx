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
import { Layout } from "../components";
import { useAuthUser } from "../utils";
import { useStore } from "../store";
import { DragHandleIcon, CloseIcon } from "@chakra-ui/icons";
import { PDFDocument1D } from "../components/PDFDocument1D";
import XLSX from "xlsx";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ListStockItems } from "../components/ListStockItems";
import { ListCutItems } from "../components/ListCutItems";

// import { FiCheckSquare, FiSquare } from 'react-icons/fi'
function AppPage() {
  const [count, setCount] = React.useState(1);
  const { isLoading, user } = useAuthUser();
  const handleGetResult = useStore((store) => store.handleGetResult);
  const errors = useStore((store) => store.errors);
  // const handleOutdatedError = useStore((store) => store.handleOutdatedError);
  // const bladeSize = useStore((store) => store.bladeSize);
  // const inputSizes1D = useStore((store) => store.bladeSize);
  // const inputSizes1DOriginal = useStore((store) => store.inputSizes1DOriginal);
  const result = useStore((store) => store.result);
  // const stockSizes1D = useStore((store) => store.stockSizes1D);

  // const toast = useToast();

  // const toastInputMessageRef = React.useRef<any>(null);
  // const toastOutdatedMessageRef = React.useRef<any>(null);

  // React.useEffect(() => {
  //   // handleInputError()
  //   handleOutdatedError();
  // }, [bladeSize, inputSizes1D, inputSizes1DOriginal, stockSizes1D]);

  React.useEffect(() => {
    setCount((prev) => prev++);
  }, [result]);

  // React.useEffect(() => {
  //   if (!errors.inputMessage) {
  //     !!toastInputMessageRef?.current &&
  //       toast.close(toastInputMessageRef.current);
  //     // handleInputError()
  //     return null;
  //   }
  //   toastInputMessageRef.current = toast({
  //     title: errors.inputMessage,
  //     status: "warning",
  //     duration: null,
  //     position: "top",
  //     isClosable: false,
  //   });
  // }, [errors.inputMessage, toast]);

  // React.useEffect(() => {
  //   if (!errors.outdatedMessage) {
  //     toastOutdatedMessageRef.current &&
  //       toast.close(toastOutdatedMessageRef.current);
  //     // handleOutdatedError()
  //     return null;
  //   }
  //   toastOutdatedMessageRef.current = toast({
  //     title: errors.outdatedMessage,
  //     status: "warning",
  //     duration: null,
  //     position: "top",
  //     isClosable: false,
  //   });
  // }, [errors.outdatedMessage, toast]);

  if (isLoading) return null;

  return (
    <Layout>
      <Box as="main" mx="auto" width="full" py={["12"]} height="full">
        {/* <ButtonsSwitch1D2D /> */}
        <Stack direction={["column", "row"]} spacing="12" width="full">
          <Box width={["100%", "40%"]}>
            <Stack bg="white" p="6" rounded="md" boxShadow="base">
              <Cut1DInputs />
              <Text fontSize="lg" fontWeight="semibold">
                Cuts
              </Text>
              <ListCutItems />
              <Box width="full">
                <Button
                  isDisabled={!!errors.inputMessage}
                  onClick={handleGetResult}
                  width="32"
                  bg="gray.900"
                  color="white"
                  _hover={{}}
                >
                  Get Result
                </Button>
              </Box>
            </Stack>
          </Box>

          <Stack spacing="6" width={["100%", "60%"]} minH="100vh">
            <PDFViewer key={count} style={{ width: "100%", height: "100%" }}>
              <PDFDocument1D />
            </PDFViewer>
            {/* <ButtonsResultExport /> */}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

function Cut1DInputs() {
  const bladeSize = useStore((store) => store.bladeSize);
  const projectName = useStore((store) => store.projectName);

  const handleBladeSizeChange = useStore(
    (store) => store.handleBladeSizeChange
  );

  const handleProjectNameChange = useStore(
    (store) => store.handleProjectNameChange
  );

  return (
    <Stack spacing="6" pb="4">
      <Stack>
        <Text fontWeight="semibold" fontSize="lg">
          Project name
        </Text>
        <Input
          value={projectName}
          placeholder="project name"
          onChange={handleProjectNameChange}
        />
      </Stack>
      <Stack>
        <Text fontWeight="semibold" fontSize="lg">
          Blade Size
        </Text>
        <Input
          type="number"
          value={bladeSize}
          placeholder="blade size"
          onChange={handleBladeSizeChange}
        />
      </Stack>
      <Stack spacing="2">
        <Text fontWeight="semibold" fontSize="lg">
          Stock
        </Text>
        <ListStockItems />
      </Stack>
    </Stack>
  );
}

function ButtonsSwitch1D2D() {
  // const is1DView = useStore((store) => store.is1DView);
  // const handle1DViewSelect = useStore((store) => store.handle1DViewSelect);

  return (
    <>
      {/* <Box pb="6">
        <Text fontSize="3xl"> Mano projectas</Text>
      </Box> */}
      <Stack isInline spacing="4" mb="6" width="full">
        {/* <Box>
          <Button
            width="32"
            bg={is1DView ? "gray.900" : "white"}
            color={is1DView ? "white" : "gray.900"}
            boxShadow="base"
            _hover={{}}
            onClick={() => handle1DViewSelect(true)}
          >
            1D
          </Button>
        </Box> */}
        {/* <Box>
          <Button
            width="32"
            bg={is1DView ? "white" : "gray.900"}
            color={is1DView ? "gray.900" : "white"}
            boxShadow="base"
            _hover={{}}
            onClick={() => handle1DViewSelect(false)}
          >
            2D
          </Button>
        </Box> */}
        {/* <Box ml="auto">
          <Button width="32" bg="white" color="gray.900" boxShadow="base" _hover={{}}>
            Save Project
          </Button>
        </Box>
        <Box ml="auto">
          <Button width="32" bg="white" color="gray.900" boxShadow="base" _hover={{}}>
            New Project
          </Button>
        </Box> */}
      </Stack>
    </>
  );
}

function ButtonsResultExport() {
  const { result } = useStore();

  const ExportData = () => {
    if (!result.length) return;

    const data = result.map(
      ([key, { count, capacity, items, stockLength }]) => {
        const reducer = (acc, { name, size }, index) => {
          const innerText = name ? ` ([${name}] ${size}) ` : ` ${size} `;
          return acc.concat(innerText);
        };

        const cutList = items.reduce(reducer, "");

        return {
          Quantity: count,
          "Stock length": stockLength,
          "Cut list": cutList,
          "Waste (mm)": capacity,
        };
      }
    );
    const ws = XLSX.utils.json_to_sheet(data);
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

export default AppPage;
