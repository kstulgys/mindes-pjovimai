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

export const getResult1D = ({ inputSizes1D, stockSizes1D, bladeSize }) => {
  const result: any = bestFitDecreasing({ inputSizes1D, stockSizes1D, bladeSize })
  return getFormatedResult(result, bladeSize)
}

function bestFitDecreasing({ inputSizes1D, stockSizes1D, bladeSize }) {
  let result = {}
  let allStockSizes = stockSizes1D.map((item) => ({ ...item }))
  const allSizes = [...inputSizes1D]
  allSizes.sort((a, b) => b - a)
  allSizes.forEach((size, index) => {
    // Try to find stock item that has been already used
    // where we can best fit the current size
    const stockItem = findStockWithLowestCapacity(result, size)

    if (stockItem) {
      result = addSizeItem(result, stockItem, size)
      result = addBladeSize(result, stockItem, bladeSize)
      return
    }
    // Otherwise use a new stock item if possible

    // Sort stock items by count (lower - higher)
    // allStockSizes.sort((a, b) => a.count - b.count)
    // Try to find the next best stock item
    const stockItemFound = findNextBestStockItem(allStockSizes, size)
    // Return early if stock item can not be found
    if (!stockItemFound) return
    // Update stock sizes (count)
    allStockSizes = stockItemFound.allStockSizes
    const currentStockSize = stockItemFound.currentStockSize

    const nextIdx = Object.values(result).length
    const value = { capacity: currentStockSize.size, items: [] }
    result[nextIdx] = { ...value }
    result[nextIdx].stockSize = currentStockSize.size
    result = addSizeItem(result, [nextIdx, value], size)
    result = addBladeSize(result, [nextIdx, value], bladeSize)
  })

  return result
}

function findNextBestStockItem(allStockSizes, size) {
  let index
  const currentStockSize = allStockSizes.find((stock, idx) => {
    const res = stock.size >= size && stock.isEnabled && stock.count > 0
    if (res) index = idx
    return res
  })

  if (currentStockSize) {
    allStockSizes[index].count--
    return { allStockSizes, currentStockSize: allStockSizes[index] }
  }

  return null
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

function findStockWithLowestCapacity(result: any, size: any) {
  const stockItem = Object.entries(result)
    .filter(([key, value]: any, index) => value.capacity >= size)
    .sort(([key1, value1]: any, [key2, value2]: any) => value1.capacity - value2.capacity)[0]
  return stockItem
}

function getFormatedResult(bins, bladeSize) {
  const formattedResult = {}

  Object.entries(bins).forEach(([keyCurrent, values]: any) => {
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
  return Object.entries(formattedResult).sort(
    ([key1, value1]: any, [key2, value2]: any) => value2.stockSize - value1.stockSize
  )
}
