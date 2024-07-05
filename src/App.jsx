import { useEffect, useState } from 'react'
import './App.css'
import ControlComponent from './component/ControlComponent/ControlComponent'
import Counter from './component/Counter/Counter'
import RoofComponent from './component/RoofComponent/RoofComponent'
import axios from 'axios'

const ip = 'localhost';

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
      console.log(e)
      console.log('bad connection')
    }
  }

  const stopEvents = () => {
    axios.get(`http://${ip}:4569/roof/none`);
  }

  useEffect(() => {
    getConfig();
  },[]);

  const finishEvent = () => {
    setActiveCounter(false);
    setTimeRoof(0);
    stopEvents();
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
      <RoofComponent/>
      <ControlComponent config={config} onEventRoof={(r, n) => eventRootApi(r, n)}/>
      {activeCounter && <Counter timeRoof={timeRoof} onFinish={finishEvent} />}
    </main>
  )
}

export default App
