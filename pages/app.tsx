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
} from '@chakra-ui/react'
import { Layout } from '../components'
import { useRouter } from 'next/router'
import { useAuthUser } from '../utils'
import { Jexcel } from '../components/Jexcel'
import { useStore } from '../store'

// const parts = [
//   { size: 1560, quantity: 3 },
//   { size: 610, quantity: 4 },
//   { size: 520, quantity: 2 },
//   { size: 700, quantity: 2 },
//   { size: 180, quantity: 10 },
// ];

const defaultInputState = {
  bladeSize: 10,
  stockSizes1D: [{ size: 6500, enabled: true }],
  input1D: [
    {
      size: 300,
      count: 5,
    },
  ],
}

function AppPage() {
  const { isLoading, user } = useAuthUser()
  const { handleGetResult } = useStore()

  if (isLoading) return null

  return (
    <Layout>
      <Box as="main" mx="auto" width="full" py={['12']}>
        <ButtonsSwitch1D2D />
        <Stack direction={['column', 'row']} spacing="6" width="full">
          <Stack width={['100%', '40%']} bg="white" p="6" rounded="md" boxShadow="base">
            <Cut1DInputs />
            <Text>Required Cuts</Text>
            <Box overflowX="auto">
              <Jexcel />
            </Box>
            <Box width="full">
              <Button onClick={handleGetResult} width="32" bg="gray.900" color="white" _hover={{}}>
                Get Result
              </Button>
            </Box>
          </Stack>
          <Stack spacing="6" width={['100%', '60%']}>
            {/* <ResultStats /> */}
            <ResultView />
            {/* <ButtonsResultExport /> */}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  )
}

function Cut1DInputs() {
  const {
    handleAddStockSize,
    handleBladeSizeChange,
    handleStockSizeChange,
    bladeSize,
    stockSizes1D,
  } = useStore()

  return (
    <Stack>
      <Stack>
        <Text>Blade Size</Text>
        <Input
          type="number"
          value={bladeSize}
          placeholder="blade size"
          onChange={handleBladeSizeChange}
        />
      </Stack>
      <Stack>
        <Text>Stock Size</Text>
        <Grid
          display="grid"
          gap="5"
          rowGap="3"
          gridTemplateColumns="repeat(auto-fit, minmax(125px, 1fr))"
        >
          {stockSizes1D.map(({ size, enabled }, index) => {
            return (
              <Stack rounded="md" isInline key={index} width="full" alignItems="center">
                <Box>
                  <Checkbox size="lg" colorScheme="gray" defaultChecked={enabled} />
                </Box>
                <Input
                  borderTopLeftRadius="none"
                  borderBottomLeftRadius="none"
                  name="size"
                  width="full"
                  type="number"
                  placeholder="size"
                  defaultValue={size}
                  onChange={(e) => handleStockSizeChange(e, index)}
                  bg="white"
                />
              </Stack>
            )
          })}
        </Grid>
        <Box>
          <Button bg="gray.500" color="white" width="32" onClick={handleAddStockSize} _hover={{}}>
            +
          </Button>
        </Box>
      </Stack>
      <Stack></Stack>
    </Stack>
  )
}

function ButtonsSwitch1D2D() {
  return (
    <Stack isInline spacing="4" mb="6">
      <Box>
        <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
          1D
        </Button>
      </Box>
      <Box>
        <Button width="32" bg="white" color="gray.900" boxShadow="base" _hover={{}}>
          2D
        </Button>
      </Box>
    </Stack>
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
  const { result1D } = useStore()
  return (
    <Stack isInline fontSize="xs" bg="white" p="6" rounded="md" boxShadow="base" overflowX="auto">
      <Stack width="full">
        <pre> {JSON.stringify(result1D, null, 4)}</pre>
        {/* <Table size="sm">
          <Thead>
            <Tr>
              <Th px="2">Quantity</Th>
              <Th px="2">Stock length</Th>
              <Th px="2">Cut list</Th>
              <Th px="2">Waste</Th>
              <Th px="2"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(getFormatedResult(resultState, inputState.bladeSize)).map(
              ([key, { count, capacity, items, stockLength, capacityPercent }]) => {
                return (
                  <Tr key={key}>
                    <Td px="2">{count}</Td>
                    <Td px="2">{stockLength}</Td>
                    <Td px="1" maxW="md" display="flex" flexWrap="wrap">
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
                    <Td px="2">{capacity}</Td>
                    <Td px="2">{capacityPercent} %</Td>
                  </Tr>
                )
              }
            )}
          </Tbody>

          <Tfoot>
            <Tr>
              {Object.entries(summary.stocks).map(([key, value]) => {
                return (
                  <>
                    <Th px="2">
                      <Text>
                        {value} x {key}
                      </Text>
                    </Th>
                    <Th px="2">
                      <Text>{Math.round(+value * +key)}</Text>
                    </Th>
                  </>
                )
              })}
              <Th px="2"></Th>
              {Object.entries(summary.wasteLength).map(([key, value]) => {
                return (
                  <Th px="2">
                    <Text>
                      {key} - {value}
                    </Text>
                    <Text>
                      {Math.round((value * 200) / (+key * +summary.stocks[key]))}
                      /200m
                    </Text>
                  </Th>
                )
              })}
              {Object.entries(summary.wastePercent).map(([key, value]) => {
                return (
                  <Th px="2">
                    <Text>
                      {key} - {value} %
                    </Text>
                  </Th>
                )
              })}
            </Tr>
          </Tfoot>
        </Table> */}
      </Stack>
    </Stack>
  )
}

function ButtonsResultExport() {
  return (
    <Stack isInline spacing="4">
      <Box>
        <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
          Export XLS
        </Button>
      </Box>
      <Box>
        <Button width="32" bg="gray.900" color="white" boxShadow="base" _hover={{}}>
          Export PDF
        </Button>
      </Box>
    </Stack>
  )
}

export default AppPage
