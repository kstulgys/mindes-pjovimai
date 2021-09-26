export default {};

import React from "react";
import { useStore } from "../../store";
import { Excel } from "../Excel";

export function ListCutItems() {
  //const updateCutItems = useStore((store) => store.updateCutItems);
  const updateCutItems = [1];
  return (
    <Excel
      options={{
        columns: [
          { type: "text", title: "Length" },
          { type: "text", title: "Quantity" },
          { type: "text", title: "Name" },
          { type: "text", title: "Angle1" },
          { type: "text", title: "Angle2" },
          { type: "checkbox", title: "Active" },
        ],
      }}
      initialData={[
        [1560, 3, "POS1", -45, 45, false],
        [610, 4, "POS2", -45, 45, true],
        [520, 2, "POS3", -45, 45, true],
        [700, 2, "POS4", -45, 45, true],
        [180, 10, "POS5", -45, 45, true],
      ]}
      listToggableColumns={[2, 3, 4]}
      toggablePair={[3, 4]}
      onAfterChange={updateCutItems}
    />
  );
}
