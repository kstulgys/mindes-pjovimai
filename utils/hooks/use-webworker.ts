import {useState, useEffect, useRef} from 'react';
import {loopCalculation, skaiciavimams} from '../index';

const workerHandler = (fn) =>{
    onmessage=(event)=>{
    console.log('onmessage');
    const { stockItems, cutItems, bladeSize, constantD } = event.data;
    //console.log(event.data);
   // const result = loopCalculation(stockItems, cutItems, bladeSize, timeforCalculation);
    
    const result = fn(stockItems, cutItems, bladeSize, constantD);
    //console.log(result);
    postMessage(result);
    }
}

export const useWebworker = () =>{
    const [result, setResult]=useState([]);
    const workerRef = useRef(null);
    useEffect(() => {
        //const worker = new Worker(new URL('../../worker.tsx', import.meta.url));
        const worker = new Worker(
            URL.createObjectURL(new Blob([`(${workerHandler})(${skaiciavimams})`]))
        )
        workerRef.current = worker;
        worker.onmessage = (event) => {
            console.log('pagaliau kazkoks rezas');
            console.log(event.data);
            //setResult([{error:"tiesiog"}]);
            //setResult(event.data);
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