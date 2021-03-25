import create from 'zustand'
import { combine } from 'zustand/middleware'
import { getSortedSizes, getResult1D, checkDouplicateName } from '../utils'

const errors = {
  input: {},
  outdated: false,
}

export const useStore = create(
  combine(
    {
      bladeSize: 10,
      stockSizes1D: [
        { size: 2000, isEnabled: true, count: 5 },
        { size: 6500, isEnabled: true, count: Infinity },
        { size: 500, isEnabled: true, count: 2 },
      ],
      inputSizes1D: [],
      result1D: [],
      is1DView: true,
      inputSizes1DOriginal: [],
      errors: {
        inputMessage: null,
        outdatedMessage: null,
      },
      activeColumns: [
        { name: 'Length', isChecked: false },
        { name: 'Quantity', isChecked: false },
        { name: 'Name', isChecked: false },
        { name: 'Angle1', isChecked: false },
        { name: 'Angle2', isChecked: false },
      ],
    },
    (set, get) => ({
      handleToggleColumn: (index) => {
        const { activeColumns } = get()
        const newActiveColumns = activeColumns.map((c) => c)
        newActiveColumns[index].isChecked = !newActiveColumns[index].isChecked
        set({ activeColumns: newActiveColumns })
      },
      handleOutdatedError: () => {
        const { errors, result1D } = get()
        const message = !!result1D?.length && 'Result is outdated'
        set({ errors: { ...errors, outdatedMessage: message } })
      },
      handle1DViewSelect: (bool) => {
        set({ is1DView: bool })
      },
      handleBladeSizeChange: (e) => {
        set({ bladeSize: e.target.valueAsNumber })
      },
      handleAddStockSize: () => {
        const { stockSizes1D } = get()
        const { length, [length - 1]: lastItem } = stockSizes1D
        set({
          stockSizes1D: [...stockSizes1D, { ...lastItem, size: Math.round(lastItem.size + 100) }],
        })
      },
      handleRemoveStockSize: (index) => {
        const { stockSizes1D } = get()
        if (stockSizes1D.length === 1 && index === 0) return
        const newStockSizes1D = stockSizes1D.filter((item, idx) => idx !== index)
        set({ stockSizes1D: [...newStockSizes1D] })
      },
      handleStockSizeChange: (e, index) => {
        const { stockSizes1D } = get()
        const { name, valueAsNumber } = e.target
        const newStockSizes1D = stockSizes1D.map((item) => ({ ...item }))

        if (name === 'isEnabled') {
          newStockSizes1D[index][name] = !newStockSizes1D[index][name]
        } else {
          newStockSizes1D[index][name] = valueAsNumber || Infinity
        }

        set({ stockSizes1D: newStockSizes1D })
      },
      handleSizesChange: (sizes) => {
        const { errors } = get()
        const douplicateName = checkDouplicateName(sizes)
        if (douplicateName) {
          if (errors.inputMessage) return
          set({
            errors: { ...errors, inputMessage: `Douplicate stock name` },
          })
          return
        }
        const inputSizes1D = getSortedSizes(sizes)
        set({
          inputSizes1D,
          inputSizes1DOriginal: sizes,
          errors: { ...errors, inputMessage: null },
        })
      },
      handleGetResult: () => {
        const { inputSizes1D, stockSizes1D, bladeSize, errors } = get()
        if (errors.inputMessage) return
        const result1D = getResult1D({ inputSizes1D, stockSizes1D, bladeSize })
        set({ result1D, errors: { ...errors, outdatedMessage: null } })
      },
    })
  )
)
