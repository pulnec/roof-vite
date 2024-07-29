import { useEffect, useState } from 'react'
import './App.css'
import ControlComponent from './component/ControlComponent/ControlComponent'
import Counter from './component/Counter/Counter'
import RoofComponent from './component/RoofComponent/RoofComponent'
import axios from 'axios'
import Swal from 'sweetalert2'

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

  const confirmEventRoof = (roof, nextPosition) => {
    const actionText = nextPosition > config.currentPosition ? 'Abrir' : 'Cerrar';
    Swal.fire({
      title: `Confirma la acción de ${actionText}`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        eventRootApi(roof, nextPosition);
      }
    })
  }

  const eventRootApi = async (roof, nextPosition) => {
    try {
      const { data: { resAction }  } = await axios.post(`http://${ip}:4569/roof`, { nextPosition, roof });
      setActiveCounter(true);
      setTimeRoof(resAction.seconds);
    } catch (e) {
      if (e.response.data.e === 'BAD_ROOF_STATUS') {
        Swal.fire({
          title: "Perdida de conexión",
          text: "Uno o varios de las unidades no poseen conexión verifique por favor.",
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Perdida de conexión",
          icon: "error"
        });
      }
    }
  }

  const notificationStopEmergency = () => {
    Swal.fire({
      title: `Se detuvieron todas las acciones`,
      text: 'Recuerde que ha usado el boton de emergencia, debe cerrar las unidades de forma manual y luego presionar el boton RESET',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
  }

  const stopEvents = (notify = false) => {
    axios.get(`http://${ip}:4569/roof/none`).then(() => {
      if (notify) {
        notificationStopEmergency();
      }
    }).catch((e) => {
      if (e.response.data.e === 'BAD_ROOF_STATUS') {
        Swal.fire({
          title: "Perdida de conexión",
          text: "Uno o varios de las unidades no poseen conexión verifique por favor.",
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Perdida de conexión",
          icon: "error"
        });
      }
    });
  }

  const resetNotification = () => {
    Swal.fire({
      title: "RESET completado",
      icon: "success"
    });
  }

  const reset = async () => {
    try {
      await axios.get(`http://${ip}:4569/roof/reset`);
      getConfig();
      resetNotification();
    } catch {
      Swal.fire({
        title: "RESET no puede sercompletado",
        icon: "error"
      });
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

  const stopEventEm = () => {
    stopEvents(true);
    setActiveCounter(false);
    setTimeRoof(0);
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
        <div className="text-2xl font-bold items-center flex justify-center">
          <img src="./src/assets/univiveros.png" width={150}/>
        </div>
      </div>
      <RoofComponent config={config} />
      <ControlComponent config={config} onEventRoof={(r, n) => confirmEventRoof(r, n)}/>
      {activeCounter && <Counter timeRoof={timeRoof} onFinish={finishEvent} onStop={stopEventEm} />}
      <div className="flex gap-1 justify-center">
        <button className="mt-10 bg-slate-500 px-7 py-4 rounded-xl text-white font-bold" onClick={reset}>Reset</button>
        <button className="mt-10 bg-red-700 px-7 py-4 rounded-xl text-white font-bold" onClick={() => stopEvents(true)}>Detener</button>
      </div>
    </main>
  )
}

export default App
