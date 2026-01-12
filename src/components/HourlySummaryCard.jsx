import celsiusToFahrenheit from "../utils/celsiusToFahrenheit.js";

export default function HourlySummaryCard ({time,emoji,temperature,isCelsius}){
    return (
        <div className="w-16 shrink-0 rounded-lg border border-slate-400 p-2 text-center mb-3">
            <p className="text-[11px] text-slate-500">{time}</p>
            <div className="text-lg" aria-hidden="true">{emoji}</div>
            <p className="text-sm font-medium text-slate-700">{ isCelsius ? temperature : celsiusToFahrenheit(temperature)}°</p>
        </div>
    )
}