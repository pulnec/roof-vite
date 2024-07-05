/* eslint-disable react/prop-types */
export default function ControlComponent(props) {
  return (
    <div className="w-full flex flex-wrap gap-1">
        {props.config.times.map((el, indx) => (
                <button disabled={el.level === props.config.currentPosition} onClick={() => props.onEventRoof(el, el.level)} key={indx} className={`w-[48%] h-[100px] rounded-xl ${el.level === props.config.currentPosition ? 'bg-black' : 'bg-lime-600'}  hover:bg-lime-500 text-2xl font-bold text-white`}>
                   {el.tag}
               </button>
        ))}
    </div>
  )
}
