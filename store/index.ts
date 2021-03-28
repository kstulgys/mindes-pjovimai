import create from "zustand";
import { combine } from "zustand/middleware";
import {
  getResult,
  checkDouplicateName,
  formatStockItems,
  formatCutItems,
} from "../utils";
import { v4 as uuid } from "uuid";

const errors = {
  input: {},
  outdated: false,
};

export const useStore = create(
  combine(
    {
      stockItems: [],
      cutItems: [],
      bladeSize: 10,
      projectName: "Project-1",
      result: [],
      errors: {
        inputMessage: null,
        outdatedMessage: null,
      },
    },
    (set, get) => ({
      handleBladeSizeChange: (e) => {
        set({ bladeSize: e.target.valueAsNumber });
      },
      handleProjectNameChange: (e) => {
        set({ projectName: e.target.value });
      },
      updateStockItems: (items) => {
        const stockItems = formatStockItems(items);
        set({ stockItems });
      },
      updateCutItems: (items) => {
        const cutItems = formatCutItems(items);
        set({ cutItems });
      },
      handleGetResult: () => {
        const { stockItems, cutItems, bladeSize, errors } = get();
        console.log({ stockItems, cutItems, bladeSize, errors });
        if (errors.inputMessage) return;
        const result = getResult({ stockItems, cutItems, bladeSize });
        // console.log({ result });
        set({ result, errors: { ...errors, outdatedMessage: null } });
      },

      // handleOutdatedError: () => {
      //   const { errors, result } = get();
      //   const message = !!result?.length && "Result is outdated";
      //   set({ errors: { ...errors, outdatedMessage: message } });
      // },

      // handleSizesChange: (sizes) => {
      //   const { errors } = get();
      //   const douplicateName = checkDouplicateName(sizes);
      //   if (douplicateName) {
      //     if (errors.inputMessage) return;
      //     set({
      //       errors: { ...errors, inputMessage: `Douplicate stock name` },
      //     });
      //     return;
      //   }
      //   const inputSizes1D = getSortedSizes(sizes);
      //   set({
      //     inputSizes1D,
      //     inputSizes1DOriginal: sizes,
      //     errors: { ...errors, inputMessage: null },
      //   });
      // },
    })
  )
);
