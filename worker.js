import { loopCalculation } from "./utils";

addEventListener('message', (event) => {
  try {
    const { stockItems, cutItems, bladeSize, constantD } = event.data;
    console.log({ stockItems, cutItems, bladeSize, constantD });
    const result = loopCalculation(stockItems, cutItems, bladeSize, constantD);
    postMessage(result);
  } catch (error) {
    postMessage({error:"error"})
  }
})
