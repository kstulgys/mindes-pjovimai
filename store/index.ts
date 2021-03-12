import create from 'zustand'
import { combine } from 'zustand/middleware'
import { getSortedSizes, getResult1D } from '../utils'

export const useStore = create(
  combine(
    {
      bladeSize: 10,
      stockSizes1D: [{ size: 6500, enabled: true }],
      inputSizes1D: [],
      result1D: {},
    },
    (set, get) => ({
      handleBladeSizeChange: (e) => {
        set({ bladeSize: e.target.valueAsNumber })
      },
      handleAddStockSize: () => {
        const { stockSizes1D } = get()
        set({ stockSizes1D: [...stockSizes1D, { size: 0, enabled: false }] })
      },
      handleStockSizeChange: (e, index) => {
        const { stockSizes1D } = get()
        const copy = [...stockSizes1D]
        copy[index].size = e.target.valueAsNumber
        set({ stockSizes1D: copy })
      },
      handleSizesChange: (sizes) => {
        const sortedSizes = getSortedSizes(sizes)
        set({ inputSizes1D: sortedSizes })
      },
      handleGetResult: () => {
        const { inputSizes1D, stockSizes1D, bladeSize } = get()
        const result1D = getResult1D(inputSizes1D, stockSizes1D[0].size, bladeSize)
        console.log({ inputSizes1D })
        set({ result1D })
      },
    })
  )
)
