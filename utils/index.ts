import React from 'react'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

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

// Sort stock items by count (lower - higher)
// allStockSizes.sort((a, b) => a.count - b.count)
function bfd({ inputSizes1D, stockSizes1D, bladeSize }) {
  const allStockSizes = stockSizes1D.map((item) => ({ ...item }))
  const allSizes = [...inputSizes1D]

  const data = []
  const usedIndexes = []

  allStockSizes.forEach(({ size: stockLength, count }, _) => {
    let countAvailable = count

    allSizes.forEach((size, index) => {
      const isIndexUsed = usedIndexes.some((idx) => idx === index)
      if (isIndexUsed) return
      const entityFound = data
        .map((_) => ({ ..._ }))
        .filter((obj) => obj.capacity >= size && obj.stockLength === stockLength)
        .sort((a, b) => a.capacity - b.capacity)[0]

      if (entityFound) {
        entityFound.capacity = Math.round(entityFound.capacity - size)
        entityFound.items.push(size)

        if (entityFound.capacity >= bladeSize) {
          entityFound.capacity = Math.round(entityFound.capacity - bladeSize)
          entityFound.items.push(bladeSize)
        }
        const lengthIndex = data.findIndex((item) => item.id === entityFound.id)
        data[lengthIndex] = { ...entityFound }
        usedIndexes.push(index)
      } else {
        const isPossibleToAddStockItem = stockLength >= size

        if (isPossibleToAddStockItem && !!countAvailable) {
          const item: any = {}
          item.stockLength = stockLength
          item.capacity = Math.round(stockLength - size)
          item.items = [size]
          item.id = uuid()

          if (item.capacity >= bladeSize) {
            item.capacity = Math.round(item.capacity - bladeSize)
            item.items.push(bladeSize)
          }
          data.push(item)
          countAvailable--
          usedIndexes.push(index)
        }
      }
    })
  })

  return data
}

function bestFitDecreasing({ inputSizes1D, stockSizes1D, bladeSize }) {
  return bfd({ inputSizes1D, stockSizes1D, bladeSize })
  // let result = {}
  // const allStockSizes = stockSizes1D.map((item) => ({ ...item }))
  // const allSizes = [...inputSizes1D]
  // // allSizes.sort((a, b) => b - a)

  // allSizes.forEach((size, index) => {
  //   // Try to find stock item that has been already used
  //   // where we can best fit the current size
  //   const stockItem = findStockWithLowestCapacity(result, size)
  //   const stockItemNextBest = findNextBestStockItem(allStockSizes, size)

  //   if (stockItem) {
  //     result = addSizeItem(result, stockItem, size)
  //     result = addBladeSize(result, stockItem, bladeSize)
  //     return
  //   }
  //   // Otherwise use a new stock item if possible

  //   // Try to find the next best stock item
  //   const stockItemFound = findNextBestStockItem(allStockSizes, size)
  //   console.log({ stockItemFound })
  //   console.log({ size })

  //   // Return early if stock item can not be found
  //   if (!stockItemFound) return
  //   // Update stock sizes (count)
  //   // allStockSizes = stockItemFound.allStockSizes
  //   const currentStockSize = stockItemFound.currentStockSize

  //   const nextIdx = Object.values(result).length
  //   const value = { capacity: currentStockSize.size, items: [] }
  //   result[nextIdx] = { ...value }
  //   result[nextIdx].stockSize = currentStockSize.size
  //   result = addSizeItem(result, [nextIdx, value], size)
  //   result = addBladeSize(result, [nextIdx, value], bladeSize)
  // })
  // console.log({ allStockSizes })
  // return result
}

function findNextBestStockItem(allStockSizes, size) {
  let index

  const currentStockSize = allStockSizes.find((stock, idx) => {
    const res = stock.size >= size && stock.isEnabled && stock.count > 0
    if (res) index = idx
    return res
  })

  // Sort stock items by count (lower - higher)
  // allStockSizes.sort((a, b) => a.count - b.count)

  if (currentStockSize) {
    allStockSizes[index].count--
    return { currentStockSize: allStockSizes[index] }
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

  bins.forEach((entity: any) => {
    const itemInResult = JSON.stringify(entity.items) + JSON.stringify(entity.stockLength)
    if (formattedResult[itemInResult]) {
      formattedResult[itemInResult].count++
    } else {
      formattedResult[itemInResult] = {
        ...entity,
        items: entity.items.filter((item) => item !== bladeSize),
        count: 1,
      }
    }
  })

  return Object.entries(formattedResult).sort(
    ([key1, value1]: any, [key2, value2]: any) => value2.stockSize - value1.stockSize
  )
}
// const formattedResult = {}

// Object.entries(bins).forEach(([keyCurrent, values]: any) => {
//   if (formattedResult[JSON.stringify(values.items)]) {
//     formattedResult[JSON.stringify(values.items)].count++
//   } else {
//     if (!values.items) return
//     formattedResult[JSON.stringify(values.items)] = {
//       ...values,
//       items: values.items.filter((item) => item !== bladeSize),
//       count: 1,
//     }
//   }
// })
// return Object.entries(formattedResult).sort(
//   ([key1, value1]: any, [key2, value2]: any) => value2.stockSize - value1.stockSize
// )
// }
