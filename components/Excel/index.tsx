import React from "react";
import { Box, Stack, Checkbox } from "@chakra-ui/react";

declare global {
  interface Window {
    jspreadsheet: any;
    jexcel: any;
  }
}

export function Excel({
  options,
  initialData,
  onAfterChange,
  listToggableColumns,
  toggablePair,
}) {
  const { columns } = options;
  const jRef = React.useRef(null);
  const [columnsDisabled, setColumnsDisaled] = React.useState([]);
  const [data, setData] = React.useState(() => initialData);

  React.useEffect(() => {
    const removedDisabledColumns = data.map((arr, index) => {
      const item = [...arr];
      columnsDisabled.forEach((idx) => {
        item[idx] = null;
      });
      return item;
    });
    onAfterChange(removedDisabledColumns);
  }, [data, columnsDisabled]);

  const toggleColumn = (index) => {
    const isToggablePair = toggablePair?.includes(index);
    const foundIndex = columnsDisabled.includes(index);
    if (foundIndex) {
      if (isToggablePair) {
        const [index1, index2] = toggablePair;
        return setColumnsDisaled(
          columnsDisabled.filter((idx) => idx !== index1 && idx !== index2)
        );
      }
      setColumnsDisaled(columnsDisabled.filter((idx) => idx !== index));
    } else {
      if (isToggablePair) {
        return setColumnsDisaled([...columnsDisabled, ...toggablePair]);
      }
      setColumnsDisaled([...columnsDisabled, index]);
    }
  };

  React.useEffect(() => {
    const jexcel = window.jspreadsheet(jRef.current, {
      data,
      columns,
      onload: ({ jexcel }, cell, col, row, val, label, cellName) => {
        // console.log("onload");
        const data = jexcel.getData();
        setData(data);
      },
      onafterchanges: ({ jexcel }, cell, col, row, val, label, cellName) => {
        // console.log("onafterchanges");
        const data = jexcel.getData();
        setData(data);
      },
      updateTable: ({ jexcel }, cell, col, row, val, label, cellName) => {
        // console.log("updateTable");
        if (columnsDisabled.includes(col)) {
          cell.style.pointerEvents = "none";
          cell.style.cursor = "not-allowed";
          cell.style.opacity = "0.3";
        }
      },
    });

    return () => jexcel.destroy();
  }, [columns, columnsDisabled]);

  const width = React.useMemo(
    () => `calc(100% / ${options.columns.length})`,
    [options.columns.length]
  );

  return (
    <Stack width="full">
      <Stack isInline spacing="0" width="full">
        <Box width={width} />
        <Stack isInline width="full" spacing="0">
          {options.columns.map((col, index) => {
            if (listToggableColumns.includes(index)) {
              return (
                <Stack
                  width={width}
                  spacing="0"
                  isInline
                  justifyContent="center"
                >
                  <Checkbox
                    size="lg"
                    colorScheme="gray"
                    isChecked={!columnsDisabled.includes(index)}
                    onChange={() => toggleColumn(index)}
                  />
                </Stack>
              );
            } else {
              return <Box width={width} />;
            }
          })}
        </Stack>
      </Stack>
      <Box ref={jRef} />
    </Stack>
  );
}
