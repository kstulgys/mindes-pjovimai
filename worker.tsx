import { loopCalculation } from './utils/calculation';

onmessage = function (event){
  try {
    const { stockItems, cutItems, bladeSize, constantD } = event.data;
    console.log({ stockItems, cutItems, bladeSize, constantD });
    const result = loopCalculation(stockItems, cutItems, bladeSize, constantD);
    postMessage(result);
    //postMessage ({ error: 'Apeinama skaiciavimu funkcija' })
  } catch (error) {
    postMessage({ error: 'error' });
  }
};
// addEventListener('message', (event) => {
//   try {
//     const { stockItems, cutItems, bladeSize, constantD } = event.data;
//     console.log({ stockItems, cutItems, bladeSize, constantD });
//     const result = loopCalculation(stockItems, cutItems, bladeSize, constantD);
//     postMessage(result);
//   } catch (error) {
//     postMessage({ error: 'error' });
//   }
// });
