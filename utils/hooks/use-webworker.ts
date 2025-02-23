import {useState, useEffect, useRef} from 'react';
//import {loopCalculation} from '../calculation';

// const workerHandler = (fn) =>{
//     onmessage=(event)=>{
//     console.log('onmessage');
//     console.log(Date.now());
//     const { stockItems, cutItems, bladeSize, constantD } = event.data;
//     const result = fn(stockItems, cutItems, bladeSize, 10);
//     postMessage(result);
//     }
// }

export const useWebworker = () =>{
    const [result, setResult]=useState([]);
    const workerRef = useRef(null);
    useEffect(() => {
        const worker = new Worker(new URL('../../worker.tsx', import.meta.url));
        // const worker = new Worker(
        //     URL.createObjectURL(new Blob([`(${workerHandler})(${loopCalculation})`]))
        // )
        workerRef.current = worker;
        worker.onmessage = async(event) => {
            //console.log('pagaliau kazkoks rezas');;
            //await console.log(event.data);
            await setResult(event.data);
        }
        return ()=>{
            worker.terminate()
        }
    }, [])

    return {
        result,
        run:(value)=>{
            workerRef.current.postMessage(value)
        },
    }
}