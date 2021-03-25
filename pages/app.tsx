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
  Tr,
  Th,
  Td,
  useToast,
  Checkbox,
  Icon,
} from '@chakra-ui/react'
import { Layout } from '../components'
import { useAuthUser } from '../utils'
import { useOnClickOutside } from '../utils/hooks'
import { Jexcel } from '../components/Jexcel'
import { useStore } from '../store'
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
import { PDFDocument1D } from '../components/PDFDocument1D'
import XLSX from 'xlsx'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { FiCheckSquare, FiSquare } from 'react-icons/fi'

function AppPage() {
  const [count, setCount] = React.useState(1)
  const { isLoading, user } = useAuthUser()
  const handleGetResult = useStore((store) => store.handleGetResult)
  const is1DView = useStore((store) => store.is1DView)
  const errors = useStore((store) => store.errors)
  // const handleInputError = useStore((store) => store.handleInputError)
  const handleOutdatedError = useStore((store) => store.handleOutdatedError)
  const bladeSize = useStore((store) => store.bladeSize)
  const inputSizes1D = useStore((store) => store.bladeSize)
  const inputSizes1DOriginal = useStore((store) => store.inputSizes1DOriginal)
  const result1D = useStore((store) => store.result1D)
  const stockSizes1D = useStore((store) => store.stockSizes1D)

  const toast = useToast()

  const toastInputMessageRef = React.useRef<any>(null)
  const toastOutdatedMessageRef = React.useRef<any>(null)

  React.useEffect(() => {
    // handleInputError()
    handleOutdatedError()
  }, [bladeSize, inputSizes1D, inputSizes1DOriginal, stockSizes1D])

  React.useEffect(() => {
    setCount((prev) => prev++)
  }, [result1D])

  React.useEffect(() => {
    if (!errors.inputMessage) {
      !!toastInputMessageRef?.current && toast.close(toastInputMessageRef.current)
      // handleInputError()
      return null
    }
    toastInputMessageRef.current = toast({
      title: errors.inputMessage,
      status: 'warning',
      duration: null,
      position: 'top',
      isClosable: false,
    })
  }, [errors.inputMessage, toast])

  React.useEffect(() => {
    if (!errors.outdatedMessage) {
      toastOutdatedMessageRef.current && toast.close(toastOutdatedMessageRef.current)
      // handleOutdatedError()
      return null
    }
    toastOutdatedMessageRef.current = toast({
      title: errors.outdatedMessage,
      status: 'warning',
      duration: null,
      position: 'top',
      isClosable: false,
    })
  }, [errors.outdatedMessage, toast])

  if (isLoading) return null

  return (
    <Layout>
      <Box as="main" mx="auto" width="full" py={['12']}>
        <ButtonsSwitch1D2D />
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
            <Stack spacing="6" width={['100%', '60%']}>
              <PDFViewer key={count} style={{ width: '100%', height: '100%' }}>
                <PDFDocument1D />
              </PDFViewer>
              <ButtonsResultExport />
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
      onClick={() => onItemFocus(index)}
    >
      <Stack isInline width="10" justifyContent="center">
        <Checkbox
          borderColor="gray.800"
          display={isActive ? 'flex' : 'none'}
          name="isEnabled"
          size="lg"
          bg="white"
          colorScheme={'orange'}
          isChecked={isEnabled}
          onChange={(e) => handleStockSizeChange(e, index)}
        />
      </Stack>
      <Box>
        <Input
          name="size"
          width="full"
          type="number"
          placeholder="size"
          value={size}
          onChange={(e) => handleStockSizeChange(e, index)}
          bg="white"
          color={isEnabled ? 'gray.600' : 'gray.300'}
          _placeholder={{
            color: isEnabled ? 'gray.600' : 'gray.300',
          }}
        />
      </Box>

      <Box>
        <Text
          color={isEnabled ? 'gray.600' : 'gray.300'}
          width="10"
          textAlign="center"
          fontWeight="medium"
        >
          x
        </Text>
      </Box>
      <Box>
        <Input
          name="count"
          width="full"
          type="number"
          placeholder="infinity"
          onChange={(e) => handleStockSizeChange(e, index)}
          bg="white"
          value={count === Infinity ? '' : count}
          color={isEnabled ? 'gray.600' : 'gray.300'}
          _placeholder={{
            color: isEnabled ? 'gray.600' : 'gray.300',
          }}
        />
      </Box>

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

function ButtonsResultExport() {
  const { result1D } = useStore()

  const ExportData = () => {
    if (!result1D.length) return

    const data = result1D.map(([key, { count, capacity, items, stockLength }]) => {
      const reducer = (acc, { name, size }, index) => {
        const innerText = name ? ` ([${name}] ${size}) ` : ` ${size} `
        return acc.concat(innerText)
      }

      const cutList = items.reduce(reducer, '')

      return {
        Quantity: count,
        'Stock length': stockLength,
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
  )
}

export default AppPage
