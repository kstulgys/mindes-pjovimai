import React from 'react'
import { Box } from '@chakra-ui/react'
import { useStore } from '../store'

declare global {
  interface Window {
    jspreadsheet: any
  }
}

function useExcel() {
  const [count, rerender] = React.useState(0)
  const jexcelRef = React.useRef(null)
  const [showTable, setShowTable] = React.useState(false)
  const intervalRef = React.useRef<null | ReturnType<typeof setTimeout>>(null)
  const handleSizesChange = useStore((state) => state.handleSizesChange)

  React.useEffect(() => {
    if (window.jspreadsheet && jexcelRef.current) {
      setShowTable(true)
      return () => {
        clearInterval(intervalRef.current)
      }
    }
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        console.count('rerendering')
        rerender((prev) => prev + 1)
      }, 200)
    }
  }, [count])

  React.useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  React.useEffect(() => {
    if (!showTable) return
    window.jspreadsheet(jexcelRef.current, {
      data: [
        [1560, 3, 'POS1', -45, 45],
        [610, 4, 'POS2', -45, 45],
        [520, 2, 'POS3', -45, 45],
        [700, 2, 'POS4', -45, 45],
        [180, 10, 'POS5', -45, 45],
      ],
      minDimensions: [2, 3],
      defaultColWidth: 100,
      csvHeaders: true,
      columns: [
        { type: 'number', title: 'Length' },
        { type: 'number', title: 'Quantity' },
        { type: 'text', title: 'Name' },
        { type: 'number', title: 'Angle1' },
        { type: 'number', title: 'Angle2' },
      ],
      // updateTable: function (instance, cell, col, row, val, label, cellName) {
      //   console.log({ instance, cell, col, row, val, label, cellName });
      // },
      onafterchanges: () => {
        if (!jexcelRef.current) return
        const sizes = jexcelRef.current.jexcel.getData()
        handleSizesChange(sizes)
      },
      onload: () => {
        const sizes = jexcelRef.current.jexcel.getData()
        handleSizesChange(sizes)
      },
    })
  }, [showTable])

  return { jexcelRef }
}

export function Jexcel() {
  const { jexcelRef } = useExcel()
  return <Box ref={jexcelRef} overflow="hidden" />
}
