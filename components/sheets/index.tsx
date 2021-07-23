import React, { useRef, useEffect } from "react";

export function StockSheet({ setStockTableValues }) {
  const defaultOptions = {
    data: [
      [6000, 20, "a1", true],
      [4000, 20, "a2", true],
      [3000, 20, "a3", true],
      [2000, 4000, "a4", true],
    ],
    columns: [
      { type: "number", title: "Length", width: 80 },
      { type: "number", title: "Quantity", width: 80 },
      { type: "text", title: "Name", width: 120 },
      { type: "checkbox", title: "Use", width: 30 },
    ],
    onbeforeinsertrow: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      if (data.length >= 20) return false;
    },
    onbeforechange: (el, cell, x, y, value) => {
      if (["0", "1", 0, 1].includes(x) && +value) return value;
      if (["2", "3", 2, 3].includes(x)) return value;
      // console.log({ el, cell, x, y, value });
      return 0;
    },
    onchange: ({ jspreadsheet }) => {
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
  };

  const [options, setOptions] = React.useState(defaultOptions);
  const jRef = useRef(null);
  useJspreadsheet({ options, jRef });
  return <div ref={jRef} />;
}

export function CutsSheet({ setCutsTableValues }) {
  const defaultOptions = {
    data: [
      [1560, 25, -90, 90, "b1", true],
      [1200, 42, 0, 45, "b2", true],
      [1100, 12, 25, 90, "b3", true],
      [1000, 52, 0, 0, "b4", true],
    ],
    columns: [
      { type: "number", title: "Length", width: 80 },
      { type: "number", title: "Quantity", width: 80 },
      { type: "number", title: "Angle 1", width: 60 },
      { type: "number", title: "Angle 2", width: 60 },
      { type: "string", title: "Name", width: 120 },
      { type: "checkbox", title: "Use", width: 30 },
    ],
    onbeforeinsertrow: ({ jspreadsheet }) => {
      const data = jspreadsheet.getData();
      if (data.length >= 100) return false;
    },
    onbeforechange: (el, cell, x, y, value) => {
      if (["0", "1", "2", "3", 0, 1, 2, 3].includes(x) && +value) return value;
      if (["4", "5", 4, 5].includes(x)) return value;
      // console.log({ el, cell, x, y, value });
      return 0;
    },
    onchange: ({ jspreadsheet }) => {
      if (!jspreadsheet) return;
      const data = jspreadsheet.getData();
      const transformed = data.reduce(
        (acc, [length, quantity, angle1, angle2, name, use]) => {
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
        },
        []
      );
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
  };

  const [options, setOptions] = React.useState(defaultOptions);
  const jRef = useRef(null);
  useJspreadsheet({ options, jRef });
  return <div ref={jRef} />;
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
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!jspreadsheet.current) return;
    jspreadsheet.current(jRef.current, options);
    return () => {
      if (!jRef.current.jspreadsheet) return;
      jRef.current.jspreadsheet.destroy();
    };
  }, [options, count]);

  return { jRef, jspreadsheet: jspreadsheet.current };
}
