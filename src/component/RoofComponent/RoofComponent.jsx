import config from '../../config/config.json'

export default function RoofComponent() {

  return (
    <>
      <div className="w-full flex justify-around">
        {config.roof.map((_, index) => (
          <div key={index} className="w-10 h-10 rounded-full bg-lime-600 items-center justify-center flex">
            <span className="text-white font-bold">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-4" />
    </>
  );
}
