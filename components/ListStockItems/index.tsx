export default {};

// import React from "react";
// import { useStore } from "../../store";
// import { Excel } from "../Excel";

// export function ListStockItems() {
//   const updateStockItems = useStore((store) => store.updateStockItems);

//   return (
//     <Excel
//       options={{
//         columns: [
//           { type: "numeric", title: "Stock length" },
//           { type: "numeric", title: "Quantity" },
//           { type: "text", title: "Name" },
//           { type: "checkbox", title: "Active" },
//         ],
//       }}
//       initialData={[
//         [2000, 3, "POS1", true],
//         [500, 1, "POS2", true],
//         [400, 3, "POS3", true],
//       ]}
//       listToggableColumns={[2]}
//       toggablePair={[]}
//       onAfterChange={updateStockItems}
//     />
//   );
// }
