import React from 'react'
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
  Checkbox,
  Grid,
  Alert,
  AlertIcon,
  Divider,
  Link,
} from '@chakra-ui/react'
import { Layout } from '../components'
import { useRouter } from 'next/router'
import { useAuthUser } from '../utils'
import { Jexcel } from '../components/Jexcel'
import { useStore } from '../store'
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
// import { IconName } from "react-icons/fi";
import XLSX from 'xlsx'
import {
  Page,
  Text as TextPDF,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Font,
} from '@react-pdf/renderer'

// Font.register({
//   family: 'Montserrat',
//   src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
// })

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: '2rem',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Montserrat',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
})

function TableHead() {
  const result1D = useStore((store) => store.result1D)
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 12,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: '15%' }}>Quantity</TextPDF>
      <TextPDF style={{ width: '20%' }}>Stock length</TextPDF>
      <TextPDF style={{ width: '45%' }}>Cut list</TextPDF>
      <TextPDF style={{ width: '20%' }}>Waste (mm)</TextPDF>
    </View>
  )
}
function TableRow({ count, stockLength, items, capacity, index }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 12,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        borderTopWidth: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: '15%' }}>{count}</TextPDF>
      <TextPDF style={{ width: '20%' }}>{stockLength}</TextPDF>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '45%' }}>
        {items.map((item, index) => (
          <TextPDF key={index}> [{item}] </TextPDF>
        ))}
      </View>
      <TextPDF style={{ width: '20%' }}>{capacity}</TextPDF>
    </View>
  )
}

function MyDocument() {
  const result1D = useStore((store) => store.result1D)
  // if (!result1D.length) return null
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <TableHead />
        {result1D.map(([key, item], index) => {
          return <TableRow key={key} {...item} index={index} />
        })}

        {/* <pre>{JSON.stringify(result1D, null, 2)}</pre> */}
        {/* <Table size="sm"> */}
        {/* <Thead>
              <Tr>
                <Th>Quantity</Th>
                <Th>Stock length</Th>
                <Th>Cut list</Th>
                <Th>Waste (mm)</Th>
              </Tr>
            </Thead> */}
        {/* <Tbody>
              {result1D.map(([key, { count, capacity, items, stockSize, capacityPercent }]) => {
                return (
                  <Tr key={key}>
                    <Td>{count}</Td>
                    <Td>{stockSize}</Td>
                    <Td px="1" display="flex" flexWrap="wrap">
                      {items.map((item, idx) => {
                        return (
                          <Box
                            key={idx}
                            rounded="sm"
                            border="1px solid"
                            m="1"
                            px="1"
                            borderColor="gray.600"
                            color="gray.600"
                          >
                            {item}
                          </Box>
                        )
                      })}
                    </Td>
                    <Td>{capacity}</Td>
                  </Tr>
                )
              })}
            </Tbody> */}
        {/* </Table> */}
        <TextPDF
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

function AppPage() {
  const { isLoading, user } = useAuthUser()
  const handleGetResult = useStore((store) => store.handleGetResult)
  const isOutdated = useStore((store) => store.isOutdated)
  const result1D = useStore((store) => store.result1D)
  const is1DView = useStore((store) => store.is1DView)

  if (isLoading) return null

  return (
    <Layout>
      <Box as="main" mx="auto" width="full" py={['12']}>
        <ButtonsSwitch1D2D />
        {/* <PDFDownloadLink document={<MyDocument />} fileName="hello world">
          <Text>Download PDF</Text>
        </PDFDownloadLink> */}

        {is1DView ? (
          <Stack direction={['column', 'row']} spacing="6" width="full">
            <Stack width={['100%', '40%']} bg="white" p="6" rounded="md" boxShadow="base">
              <Cut1DInputs />
              <Text fontWeight="medium">Required Cuts</Text>
              <Box overflowX="auto">
                <Jexcel />
              </Box>
              <Box width="full">
                <Button
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
            <Stack spacing="6" width={['100%', '60%']}>
              {isOutdated && (
                <Alert status="warning" rounded="md" boxShadow="base">
                  <AlertIcon />
                  The result is outdated
                </Alert>
              )}
              {/* <ResultStats /> */}
              {/* <pre>{JSON.stringify(result1D, null, 4)}</pre> */}

              {!result1D.length ? (
                <Text textAlign="center" fontWeight="medium" color="gray.500" fontSize="lg">
                  No results
                </Text>
              ) : (
                <>
                  {/* <ResultView /> */}
                  <PDFViewer style={{ width: '100%', height: '100%' }}>
                    <MyDocument />
                  </PDFViewer>
                  <ButtonsResultExport />
                </>
              )}
            </Stack>
          </Stack>
        ) : (
          <Box>
            <Text fontSize="2xl">Coming soon...</Text>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

function Cut1DInputs() {
  const { handleAddStockSize, handleBladeSizeChange, bladeSize, stockSizes1D } = useStore()

  const [activeIndex, setActiveIndex] = React.useState(null)
  const ref = React.useRef()
  useOnClickOutside(ref, () => onItemFocus(null))

  const onItemFocus = (idx) => setActiveIndex(idx)

  return (
    <Stack spacing="6" pb="4">
      <Stack>
        <Text fontWeight="medium">Blade Size</Text>
        <Input
          type="number"
          value={bladeSize}
          placeholder="blade size"
          onChange={handleBladeSizeChange}
        />
      </Stack>
      <Stack spacing="0">
        <Stack isInline width="full" px="2">
          <Box>
            <Box width="10" />
          </Box>
          <Box width="full">
            <Text fontWeight="medium" textAlign="center">
              Stock length
            </Text>
          </Box>
          <Box>
            <Box width="10" />
          </Box>
          <Box width="full">
            <Text fontWeight="medium" textAlign="center">
              Count
            </Text>
          </Box>
          <Box>
            <Box width="10" />
          </Box>
        </Stack>
        <Stack spacing="0" ref={ref}>
          {stockSizes1D.map((item, index) => {
            return (
              <StockSizeItem
                key={index}
                {...item}
                index={index}
                isActive={activeIndex === index}
                onItemFocus={onItemFocus}
              />
            )
          })}
        </Stack>
        <Stack isInline spacing="0" pt="2">
          <Box px="2">
            <Box width="10" />
          </Box>
          <Box>
            <Button bg="gray.900" color="white" width="16" onClick={handleAddStockSize} _hover={{}}>
              +
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

function StockSizeItem({ size, isEnabled, count, isActive, index, onItemFocus }) {
  const handleStockSizeChange = useStore((store) => store.handleStockSizeChange)
  const handleRemoveStockSize = useStore((store) => store.handleRemoveStockSize)

  return (
    <Stack
      rounded="md"
      width="full"
      isInline
      p="2"
      bg={isActive ? 'gray.200' : 'white'}
      alignItems="center"
    >
      <Button
        bg={isActive ? 'gray.200' : 'white'}
        _hover={{}}
        transition="none"
        _active={{ bg: isActive ? 'gray.300' : 'white' }}
        // onClick={() => {}}
      >
        {isActive && <DragHandleIcon fontSize="lg" />}
      </Button>
      <Input
        onFocus={() => onItemFocus(index)}
        name="size"
        width="full"
        type="number"
        placeholder="size"
        value={size}
        onChange={(e) => handleStockSizeChange(e, index)}
        bg="white"
      />
      <Box>
        <Text width="10" textAlign="center" fontWeight="medium">
          x
        </Text>
      </Box>
      <Input
        onFocus={() => onItemFocus(index)}
        name="count"
        width="full"
        type="number"
        placeholder="infinity"
        onChange={(e) => handleStockSizeChange(e, index)}
        bg="white"
        value={count}
      />
      <Button
        bg={isActive ? 'gray.200' : 'white'}
        _hover={{}}
        transition="none"
        _active={{ bg: isActive ? 'gray.300' : 'white' }}
        onClick={() => {
          if (!isActive) return
          handleRemoveStockSize(index)
        }}
      >
        {isActive && <CloseIcon fontSize="xs" />}
      </Button>
    </Stack>
  )
}

function ButtonsSwitch1D2D() {
  const is1DView = useStore((store) => store.is1DView)
  const handle1DViewSelect = useStore((store) => store.handle1DViewSelect)

  return (
    <>
      {/* <Box pb="6">
        <Text fontSize="3xl"> Mano projectas</Text>
      </Box> */}
      <Stack isInline spacing="4" mb="6" width="full">
        <Box>
          <Button
            width="32"
            bg={is1DView ? 'gray.900' : 'white'}
            color={is1DView ? 'white' : 'gray.900'}
            boxShadow="base"
            _hover={{}}
            onClick={() => handle1DViewSelect(true)}
          >
            1D
          </Button>
        </Box>
        <Box>
          <Button
            width="32"
            bg={is1DView ? 'white' : 'gray.900'}
            color={is1DView ? 'gray.900' : 'white'}
            boxShadow="base"
            _hover={{}}
            onClick={() => handle1DViewSelect(false)}
          >
            2D
          </Button>
        </Box>
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
  )
}

function ResultStats() {
  return (
    <Stack isInline spacing="6" width="full">
      <Box width="33%" height="32" bg="white" rounded="md" boxShadow="base" />
      <Box width="33%" height="32" bg="white" rounded="md" boxShadow="base" />
      <Box width="33%" height="32" bg="white" rounded="md" boxShadow="base" />
    </Stack>
  )
}

function ResultView() {
  const result1D = useStore((store) => store.result1D)
  return (
    <Stack isInline fontSize="xs" bg="white" p="6" rounded="md" boxShadow="base" overflowX="auto">
      <Stack width="full">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Quantity</Th>
              <Th>Stock length</Th>
              <Th>Cut list</Th>
              <Th>Waste (mm)</Th>
              {/* <Th>Waste (%)</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {/* <pre>{JSON.stringify(result1D, null, 2)}</pre> */}
            {result1D.map(([key, { count, capacity, items, stockSize, capacityPercent }]) => {
              return (
                <Tr key={key}>
                  <Td>{count}</Td>
                  <Td>{stockSize}</Td>
                  <Td px="1" display="flex" flexWrap="wrap">
                    {items.map((item, idx) => {
                      return (
                        <Box
                          key={idx}
                          rounded="sm"
                          border="1px solid"
                          m="1"
                          px="1"
                          borderColor="gray.600"
                          color="gray.600"
                        >
                          {item}
                        </Box>
                      )
                    })}
                  </Td>
                  <Td>{capacity}</Td>
                  {/* <Td>{capacityPercent} %</Td> */}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  )
}

function ButtonsResultExport() {
  const { result1D } = useStore()

  const ExportData = () => {
    if (!result1D.length) return
    const data = result1D.map(([key, { count, capacity, items, stockSize, capacityPercent }]) => {
      const reducer = (acc, next, index) => {
        const item = index === 0 ? `[${next}]` : `  [${next}]`
        return acc.concat(item)
      }

      const cutList = items.reduce(reducer, '')

      return {
        Quantity: count,
        'Stock length': stockSize,
        'Cut list': cutList,
        'Waste (mm)': capacity,
      }
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, 'stock_cut_result_' + Date.now().toString() + '.xlsx')
  }

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
      <Box>
        {/* <PDFDownloadLink
          document={<MyDocument />}
          fileName={'stock_cut_result_' + Date.now().toString()}
        >
          <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
            Export PDF
          </Button>
        </PDFDownloadLink> */}
      </Box>
    </Stack>
  )
}
function useOnClickOutside(ref, handler) {
  React.useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }

        handler(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  )
}
export default AppPage
