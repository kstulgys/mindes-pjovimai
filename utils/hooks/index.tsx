import React from 'react';
//import '../../worker';

export function useOnClickOutside(ref, handler) {
  React.useEffect(
    () => {
      const listener = (event: any): any => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export function useWorker() {
  const workerRef = React.useRef<Worker>(null);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    workerRef.current = new Worker(new URL('../../worker.tsx', import.meta.url));
    workerRef.current.onmessage = (event) => {
      setData(event.data);
    };
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const handlePostMessage = ({ stockItems, cutItems, bladeSize, constantD }) => {
    workerRef.current.postMessage({
      stockItems,
      cutItems,
      bladeSize,
      constantD,
    });
  };

  return { handlePostMessage, data };
}
