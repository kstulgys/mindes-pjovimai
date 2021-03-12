import React from 'react'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/router'

export function useAuthUser() {
  const [user, setUser] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const router = useRouter()

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => router.push('/auth'))
      .finally(() => setIsLoading(false))
  }, [])
  return { isLoading, user }
}

export function getSortedSizes(sizes) {
  const sortedSizes = sizes.reduce((acc, [length, qty]) => {
    const res = Array(+qty)
      .fill(null)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map((_) => +length)
    return [...acc, ...res]
  }, [])
  sortedSizes.sort((a, b) => b - a)

  return sortedSizes
}

// function bestFit(stockSize, sizes, bladeSize) {
//   const bins = {}

//   sizes.forEach((size, index) => {
//     const foundBin =
//       Object.entries(bins)
//         .filter(([key, value], index) => value.capacity >= size)
//         .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0] || null

//     if (foundBin) {
//       const [key, value] = foundBin

//       bins[key].capacity = +(value.capacity - size).toFixed(2)
//       bins[key].items.push(size)
//       if (bins[key].capacity >= bladeSize) {
//         bins[key].capacity = +(bins[key].capacity - bladeSize).toFixed(2)
//         bins[key].items.push(bladeSize)
//       }
//       bins[key].stockLength = stockSize
//       bins[key].capacityPercent = Math.round((value.capacity * 100) / stockSize)
//     } else {
//       const nextIdx = Object.values(bins).length
//       bins[nextIdx] = {
//         capacity: +(stockSize - size).toFixed(2),
//         items: [size],
//       }
//       if (bins[nextIdx].capacity >= bladeSize) {
//         bins[nextIdx].capacity = +(bins[nextIdx].capacity - bladeSize).toFixed(2)
//         bins[nextIdx].items.push(bladeSize)
//       }
//       bins[nextIdx].stockLength = stockSize
//       bins[nextIdx].capacityPercent = Math.round((bins[nextIdx].capacity * 100) / stockSize)
//     }
//   })

//   return bins
// }

export const getResult1D = (sizes, stockSize, bladeSize) => {
  let bestBins = bestFitDecreasing(stockSize, sizes, bladeSize)

  sizes.forEach((size, index) => {
    const sizesWithoutOne = sizes.filter((sizeItem, idx) => idx !== index)
    const currentBins = bestFitDecreasing(stockSize, sizesWithoutOne, bladeSize)
    const foundBin = findStockWithLowestCapacity(currentBins, size)

    if (foundBin) {
      const [key, value] = foundBin
      currentBins.wasteTotal -= size
      currentBins[key].capacity -= size
      currentBins[key].items.push(size)
    }

    if (currentBins.wasteTotal < bestBins.wasteTotal) {
      bestBins = currentBins
    }
  })

  return bestBins
}

function getFormatedResult(bins, bladeSize) {
  const formattedResult = {}

  Object.entries(bins).forEach(([keyCurrent, values]) => {
    if (formattedResult[JSON.stringify(values.items)]) {
      formattedResult[JSON.stringify(values.items)].count++
    } else {
      if (!values.items) return
      formattedResult[JSON.stringify(values.items)] = {
        ...values,
        items: values.items.filter((item) => item !== bladeSize),
        count: 1,
      }
    }
  })
  return formattedResult
}

function getSummary(data) {
  const result = getFormatedResult(data)
  return Object.entries(result).reduce(
    (acc, [key, { count, capacity, items, stockLength, capacityPercent }]) => {
      acc.totalCount += count
      acc.stocks[stockLength] = acc.stocks[stockLength] ? acc.stocks[stockLength] + count : count
      acc.wastePercent[stockLength] = acc.wastePercent[stockLength]
        ? acc.wastePercent[stockLength] + capacityPercent
        : capacityPercent
      acc.wasteLength[stockLength] = acc.wasteLength[stockLength]
        ? acc.wasteLength[stockLength] + capacity
        : capacity

      return acc
    },
    { totalCount: 0, stocks: {}, wastePercent: {}, wasteLength: {} }
  )
}

function bestFitDecreasing(stockSize, sizes, bladeSize) {
  let result = {}
  // go through each size
  sizes.forEach((size, index) => {
    const stockItem = findStockWithLowestCapacity(result, size)

    if (stockItem) {
      result = addSizeItem(result, stockItem, size)
      result = addBladeSize(result, stockItem, bladeSize)
    } else {
      // if used stock is not found then create one and add size item to it
      const nextIdx = Object.values(result).length
      const value = { capacity: stockSize, items: [] }
      result[nextIdx] = { ...value }
      result[nextIdx].stockSize = stockSize
      result = addSizeItem(result, [nextIdx, value], size)
      result = addBladeSize(result, [nextIdx, value], bladeSize)
    }
  })

  result.wasteTotal = Object.values(result).reduce((acc, { capacity }) => (acc += capacity), 0)
  return result
}

function addSizeItem(result, stockItem, size) {
  const [key, value] = stockItem
  result[key].capacity = +(value.capacity - size).toFixed(2)
  result[key].items.push(size)
  return result
}

function addBladeSize(result, stockItem, bladeSize) {
  const [key, value] = stockItem
  if (result[key].capacity >= bladeSize) {
    result[key].capacity = +(result[key].capacity - bladeSize).toFixed(2)
    result[key].items.push(bladeSize)
  }
  return result
}

function findStockWithLowestCapacity(result, size) {
  const stockItem = Object.entries(result)
    .filter(([key, value], index) => value.capacity >= size)
    .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0]
  return stockItem
}
