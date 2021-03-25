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
  const sortedSizes = sizes.reduce((acc, [length, qty, name]) => {
    const formatted = Array(+qty)
      .fill(null)
      .map((_) => ({ size: +length, name }))
    return [...acc, ...formatted]
  }, [])
  sortedSizes.sort((a, b) => b.size - a.size)
  return sortedSizes
}

export const getResult1D = ({ inputSizes1D, stockSizes1D, bladeSize }) => {
  const result: any = bestFitDecreasing({ inputSizes1D, stockSizes1D, bladeSize })
  return getFormatedResult(result, bladeSize)
}

function bfd({ inputSizes1D, stockSizes1D, bladeSize }) {
  const allStockSizes = stockSizes1D.filter(({ isEnabled }) => Boolean(isEnabled))
  const allCutSizes = inputSizes1D.map((item) => ({ ...item }))

  allStockSizes.sort((a, b) => {
    if (a.size > b.size) return 1
    if (a.size < b.size) return -1

    if (a.count > b.count) return 1
    if (a.count < b.count) return -1
  })

  const data = []
  const usedIndexes = []

  allStockSizes.forEach(({ size: stockLength, count }, _) => {
    let countAvailable = count

    allCutSizes.forEach(({ size, name }, index) => {
      const isIndexUsed = usedIndexes.some((idx) => idx === index)
      if (isIndexUsed) return

      const entityFound = data
        .filter((obj) => obj.capacity >= size && obj.stockLength === stockLength)
        .sort((a, b) => a.capacity - b.capacity)[0]

      if (entityFound) {
        entityFound.capacity = Math.round(entityFound.capacity - size)
        entityFound.items.push({ size, name })

        if (entityFound.capacity >= bladeSize) {
          entityFound.capacity = Math.round(entityFound.capacity - bladeSize)
          entityFound.items.push({ size: bladeSize })
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
          item.items = [{ size, name }]
          item.id = uuid()

          if (item.capacity >= bladeSize) {
            item.capacity = Math.round(item.capacity - bladeSize)
            item.items.push({ size: bladeSize })
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

function getFormatedResult(stockCutResult, bladeSize) {
  const formattedResult = {}

  stockCutResult.forEach((entity: any) => {
    const key = `${JSON.stringify(entity.items)} - ${entity.stockLength}`

    if (formattedResult[key]) {
      formattedResult[key].count++
    } else {
      const items = entity.items.filter((item) => Boolean(item.name))
      formattedResult[key] = {
        ...entity,
        items,
        count: 1,
      }
    }
  })

  return Object.entries(formattedResult).sort(([key1, value1]: any, [key2, value2]: any) => {
    if (value2.stockLength > value1.stockLength) return 1
    if (value2.stockLength < value1.stockLength) return -1

    if (value2.count > value1.count) return 1
    if (value2.count < value1.count) return -1
  })
}

export function checkDouplicateName(sizes) {
  let name = null
  sizes.some(([len1, qty1, name1], idx1) =>
    sizes.some(([len2, qty2, name2], idx2) => {
      if (idx1 === idx2) return false
      if (name1 === name2) {
        name = name1
        return true
      }
      return false
    })
  )

  return name
}
