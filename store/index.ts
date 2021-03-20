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
    },
    (set, get) => ({
      handleBladeSizeChange: (e) => {
        set({ bladeSize: e.target.valueAsNumber, result1D: [] })
      },
      handleAddStockSize: () => {
        const { stockSizes1D } = get()
        const { length, [length - 1]: lastItem } = stockSizes1D
        set({
          stockSizes1D: [...stockSizes1D, { ...lastItem, size: Math.round(lastItem.size + 100) }],
          result1D: [],
        })
      },
      handleRemoveStockSize: (index) => {
        const { stockSizes1D } = get()
        if (stockSizes1D.length === 1 && index === 0) return
        const newStockSizes1D = stockSizes1D.filter((item, idx) => idx !== index)
        set({ stockSizes1D: [...newStockSizes1D], result1D: [] })
      },
      handleStockSizeChange: (e, index) => {
        const { name, valueAsNumber } = e.target
        const { stockSizes1D } = get()
        const newStockSizes1D = stockSizes1D.map((item) => ({ ...item }))
        newStockSizes1D[index][name] = valueAsNumber || Infinity
        console.warn('handleStockSizeChange')
        console.log({ newStockSizes1D })
        set({ stockSizes1D: newStockSizes1D, result1D: [] })
      },
      handleSizesChange: (sizes) => {
        const sortedSizes = getSortedSizes(sizes)
        set({ inputSizes1D: sortedSizes, result1D: [] })
      },
      handleGetResult: () => {
        const { inputSizes1D, stockSizes1D, bladeSize } = get()
        const result1D = getResult1D({ inputSizes1D, stockSizes1D, bladeSize })
        console.log({ result1D })
        set({ result1D })
      },
    })
  )
)
