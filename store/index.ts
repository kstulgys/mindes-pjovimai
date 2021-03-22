import create from 'zustand'
import { combine } from 'zustand/middleware'
import { getSortedSizes, getResult1D } from '../utils'

export const useStore = create(
  combine(
    {
      bladeSize: 10,
      stockSizes1D: [{ size: 6500, isEnabled: true, count: Infinity }],
      inputSizes1D: [],
      result1D: [],
      isOutdated: false,
      is1DView: true,
    },
    (set, get) => ({
      handle1DViewSelect: (bool) => {
        set({ is1DView: bool })
      },
      handleBladeSizeChange: (e) => {
        const { result1D } = get()
        set({ bladeSize: e.target.valueAsNumber, isOutdated: !!result1D.length })
      },
      handleAddStockSize: () => {
        const { stockSizes1D, result1D } = get()
        const { length, [length - 1]: lastItem } = stockSizes1D
        set({
          stockSizes1D: [...stockSizes1D, { ...lastItem, size: Math.round(lastItem.size + 100) }],
          isOutdated: !!result1D.length,
        })
      },
      handleRemoveStockSize: (index) => {
        const { stockSizes1D, result1D } = get()
        if (stockSizes1D.length === 1 && index === 0) return
        const newStockSizes1D = stockSizes1D.filter((item, idx) => idx !== index)
        set({ stockSizes1D: [...newStockSizes1D], isOutdated: !!result1D.length })
      },
      handleStockSizeChange: (e, index) => {
        const { stockSizes1D, result1D } = get()
        const { name, valueAsNumber } = e.target
        const newStockSizes1D = stockSizes1D.map((item) => ({ ...item }))
        newStockSizes1D[index][name] = valueAsNumber || Infinity
        set({ stockSizes1D: newStockSizes1D, isOutdated: !!result1D.length })
      },
      handleSizesChange: (sizes) => {
        const { result1D } = get()
        const sortedSizes = getSortedSizes(sizes)
        set({ inputSizes1D: sortedSizes, isOutdated: !!result1D.length })
      },
      handleGetResult: () => {
        const { inputSizes1D, stockSizes1D, bladeSize } = get()
        const result1D = getResult1D({ inputSizes1D, stockSizes1D, bladeSize })
        console.log({ result1D })
        set({ result1D, isOutdated: false })
      },
    })
  )
)
