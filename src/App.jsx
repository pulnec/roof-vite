import { useEffect, useState } from 'react'
import './App.css'
import ControlComponent from './component/ControlComponent/ControlComponent'
import Counter from './component/Counter/Counter'
import RoofComponent from './component/RoofComponent/RoofComponent'
import axios from 'axios'

const ip = '192.168.0.182';
//const ip = '192.168.0.101';

function App() {

  const [activeCounter, setActiveCounter] = useState(false);
  const [timeRoof, setTimeRoof] = useState(0); 
  const [config, setConfig] = useState(null);

  const getConfig = async () => {
    const { data } = await axios.get(`http://${ip}:4569/roof`);
    setConfig(data);
  }

  const eventRootApi = async (roof, nextPosition) => {
    try {
      const { data: { resAction }  } = await axios.post(`http://${ip}:4569/roof`, { nextPosition, roof });
      setActiveCounter(true);
      setTimeRoof(resAction.seconds);
    } catch (e) {
      if (e.response.data.e === 'BAD_ROOF_STATUS') {
        alert('One or more roofs are disconnected.')
      } else {
        alert('Action: Bad connection.')
      }
    }
  }

  const stopEvents = (notify = false) => {
    axios.get(`http://${ip}:4569/roof/none`).then(() => {
      if (notify) {
        alert('Roof stop events success');
      }
    }).catch((e) => {
      if (e.response.data.e === 'BAD_ROOF_STATUS') {
        alert('One or more roofs are disconnected.')
      } else {
        alert('Stop: Bad connection.')
      }
    });
  }

  const reset = async () => {
    try {
      await axios.get(`http://${ip}:4569/roof/reset`);
      getConfig();
      alert('Reset apply')
    } catch {
      alert('Error reset')
    }
  }

  useEffect(() => {
    getConfig();
  },[]);

  const finishEvent = () => {
    setActiveCounter(false);
    setTimeRoof(0);
    stopEvents();
    getConfig();
  }

  if (!config) {
    return (
      <main>
        <div>
          <p>Cargando...</p>
        </div>
      </main>
    )
  }
  
  return (
    <main>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Roof</h3>
      </div>
      <RoofComponent config={config} />
      <ControlComponent config={config} onEventRoof={(r, n) => eventRootApi(r, n)}/>
      {activeCounter && <Counter timeRoof={timeRoof} onFinish={finishEvent} />}
      <div className="flex gap-1 justify-center">
        <button className="mt-10 bg-slate-500 px-7 py-4 rounded-xl text-white font-bold" onClick={reset}>Reset</button>
        <button className="mt-10 bg-red-700 px-7 py-4 rounded-xl text-white font-bold" onClick={() => stopEvents(true)}>Stop</button>
      </div>
    </main>
  )
}

export default App
