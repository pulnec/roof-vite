import config from '../../config/config.json'

function maskIPAddress(ip) {
  // Match the first three sets of numbers and replace them with '***'
  return ip.replace(/(\d+\.\d+\.\d+)\./, '.');
}


export default function RoofComponent() {

  return (
    <>
      <div className="w-full flex justify-around">
        {config.roof.map((el, index) => (
          <div key={index} className="w-10 h-10 rounded-full bg-lime-600 items-center justify-center flex">
            <span className="text-white font-bold">{maskIPAddress(el)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4" />
    </>
  );
}
