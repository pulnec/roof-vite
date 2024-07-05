/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

export default function Counter(props) {

    // eslint-disable-next-line react/prop-types
    const [counter, setCounter] = useState(props.timeRoof);

    useEffect(() => {
      console.log(props.timeRoof);
      setCounter(props.timeRoof);
    },[props.timeRoof])

  // Second Attempts
  useEffect(() => {

    if (counter === 0) {
        props.onFinish();
    }
    
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <>
    <div className="absolute w-full h-full bg-stone-400  top-0 left-0 opacity-75" />
    <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="w-[200px] h-[100px] bg-stone-700 rounded-xl flex items-center justify-center flex-col">
            <p className="text-white font-bold text-2xl">{counter}</p>
            <span className="text-gray-400">Por favor espere...</span>
        </div>
    </div>
    </>
  )
}
