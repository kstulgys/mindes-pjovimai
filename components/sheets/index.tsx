import React, { useRef, useEffect, useState } from "react";
import { Box, Stack, HStack, Button, Text, Input, Checkbox } from "@chakra-ui/react";
import { FcDeleteRow, FcAddRow } from "react-icons/fc";
import { getDefaultLibFileName } from "typescript";

export function StockSheet({ setStockTableValues }) {
  const defaultOptions = {
    columnResize: false,
    data: [
      [6000, 20, "a1", true],
      [4000, 20, "a2", true],
      [3000, 20, "a3", true],
      [2000, 4000, "a4", true],
    ],
    columns: [
      { type: "number", title: "Length" },
      { type: "number", title: "Quantity" },
      { type: "text", title: "Name" },
      { type: "checkbox", title: "Use" },
    ],
    onbeforeinsertrow: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      if (data.length >= 20) return false;
    },
    onbeforeinsertcolumn: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      //console.log(data);
      if (data[0].length > 3) return false;
    },
    onbeforechange: (el, cell, x, y, value) => {
      //console.log('onbeforechange');
      if (["0", "1", 0, 1].includes(x) && +value) return value;
      if (["2", "3", 2, 3].includes(x)) return value;
      // console.log({ el, cell, x, y, value });
      return 0;
    },
    onchange: ({ jspreadsheet }, cell, col, row, val, label, cellName) => {
      //console.log('onchangeaaaa');
      if (!jspreadsheet) return;
      const data = jspreadsheet.getData();
      const transformed = data.reduce((acc, [length, quantity, name, use]) => {
        if (use)
          return [
            ...acc,
            {
              length: +length,
              quantity: +quantity,
              name,
              use,
            },
          ];
        return acc;
      }, []);
      setStockTableValues(transformed);
    },
    onload: ({ jspreadsheet }) => {
      //console.log('onload');
      if (!jspreadsheet) return;
      const datajson = jspreadsheet.getJson();
      const transformed = datajson.map((obj) => ({
        length: +obj[0],
        quantity: +obj[1],
        name: obj[2],
        use: obj[3],
      }));
      setStockTableValues(transformed);
    },
    updateTable: ({ jspreadsheet }, cell, col, row, val, label, cellName) => {
      //console.log('updateTable');
      if (!jspreadsheet.getData()[row][3]) {
        cell.style.opacity = "0.3";
      } else {
        cell.style.opacity = "1";
      }
    },
  };
  const [options, setOptions] = React.useState(defaultOptions);
  const jRef = useRef(null);

  useJspreadsheet({ options, jRef });

  const addRow = () => {
    jRef.current.jexcel.insertRow([, , , true]);
  };
  const deleteRow = () => {
    jRef.current.jexcel.deleteRow();
  };
  const clearTable = () => {
    const clearedData = jRef.current.jexcel.getData().map((x) => [, , , true]);
    jRef.current.jexcel.setData(clearedData);
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          Stock (Max 20 rows)
        </Text>
        <Button size="xs" variant="outline" className="testas" onClick={clearTable}>
          Clear table
        </Button>
      </HStack>
      <div ref={jRef} />
      <HStack justifyContent="space-between">
        <Button size="xs" variant="outline" className="testas" onClick={addRow} leftIcon={<FcAddRow />}>
          Row +
        </Button>
        <Button size="xs" variant="outline" className="testas" onClick={deleteRow} leftIcon={<FcDeleteRow />}>
          Row -
        </Button>
      </HStack>
    </>
  );
}

export function CutsSheet({ setCutsTableValues }) {
  const defaultOptions = {
    columnResize: false,
    style: {
      // A1:'background-color: red;',
    },
    data: [
      [1560, 25, -90, 90, "b1", true],
      [1200, 42, 0, 45, "b2", true],
      [1100, 12, 25, 90, "", true],
      [1000, 52, 0, 0, "", true],
    ],
    columns: [
      { type: "number", title: "Length", width: 60 },
      { type: "number", title: "Quantity", width: 120 },
      { type: "number", title: "Angle1" },
      { type: "number", title: "Angle2" },
      { type: "string", title: "Name" },
      { type: "checkbox", title: "Use" },
    ],
    onbeforeinsertrow: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      if (data.length >= 100) return false;
    },
    onbeforeinsertcolumn: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      if (data[0].length > 5) return false;
    },
    onbeforechange: (el, cell, x, y, value) => {
      if (["0", "1", "2", "3", 0, 1, 2, 3].includes(x) && +value) return value;
      if (["4", "5", 4, 5].includes(x)) return value;
      // console.log('onbeforechange');
      // console.log({ el, cell, x, y, value });
      return 0;
    },
    onchange: ({ jspreadsheet }, cell, row) => {
      if (!jspreadsheet) return;
      const data = jspreadsheet.getData();
      const transformed = data.reduce((acc, [length, quantity, angle1, angle2, name, use]) => {
        if (use)
          return [
            ...acc,
            {
              length: +length,
              quantity: +quantity,
              angle1: +angle1,
              angle2: +angle2,
              name,
              use,
            },
          ];
        return acc;
      }, []);
      setCutsTableValues(transformed);
    },
    onload: ({ jspreadsheet }) => {
      if (!jspreadsheet) return;
      const datajson = jspreadsheet.getJson();
      const transformed = datajson.map((obj) => ({
        length: +obj[0],
        quantity: +obj[1],
        angle1: +obj[2],
        angle2: +obj[3],
        name: obj[4],
        use: +obj[5],
      }));
      setCutsTableValues(transformed);
    },
    updateTable: ({ jspreadsheet }, cell, col, row, val, label, cellName) => {
      //console.log('updateTable');
      if (!jspreadsheet.getData()[row][5]) {
        // If USE unchecked
        cell.style.opacity = "0.3";
      } else {
        cell.style.opacity = "1";
      }
    },
    oninsertrow: ({ jspreadsheet }, cell, col, row, val, label, cellName, ha) => {},
  };

  const [options, setOptions] = React.useState(defaultOptions);
  const jRef = useRef(null);

  useJspreadsheet({ options, jRef });

  const addRow = () => {
    jRef.current.jexcel.insertRow([, , , , , true]);
  };
  const deleteRow = () => {
    jRef.current.jexcel.deleteRow();
  };
  const clearTable = () => {
    const clearedData = jRef.current.jexcel.getData().map((x) => [, , , , , true]);
    jRef.current.jexcel.setData(clearedData);
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          Cuts (Max 100 rows)
        </Text>
        <Button size="xs" variant="outline" className="testas" onClick={clearTable}>
          Clear table
        </Button>
      </HStack>
      <div ref={jRef} />
      <HStack justifyContent="space-between">
        <Button size="xs" variant="outline" className="testas" onClick={addRow} leftIcon={<FcAddRow />}>
          Row +
        </Button>
        <Button size="xs" variant="outline" className="testas" onClick={deleteRow} leftIcon={<FcDeleteRow />}>
          Row -
        </Button>
      </HStack>
    </>
  );
}

// Hook

function useJspreadsheet({ options, jRef }) {
  const jspreadsheet = useRef(null);
  const [count, rerender] = React.useReducer((s, a = 1) => s + a, 0);

  async function importJsp() {
    return (await import("jspreadsheet-ce")).default;
  }

  React.useEffect(() => {
    try {
      importJsp()
        .then((jsp) => {
          jspreadsheet.current = jsp;
        })
        .then(() => rerender());
    } catch (e) {
      console.log({ e });
    }
  }, []);

  useEffect(() => {
    if (!jspreadsheet.current) return;
    jspreadsheet.current(jRef.current, options);
    return () => {
      if (!jRef.current?.jspreadsheet) return;
      jRef.current.jspreadsheet.destroy();
    };
  }, [options, count]);

  return { jRef, jspreadsheet: jspreadsheet.current };
}
