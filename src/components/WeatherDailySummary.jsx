import celsiusToFahrenheit from "../utils/celsiusToFahrenheit.js";

export default function WeatherDailySummary({dayWeatherSummary,displayWeatherDetails,isCelsius}) {
    return (
        <>
            <li className="grid grid-cols-5 items-center gap-2 px-3 py-2 text-sm cursor-pointer" onClick={()=>displayWeatherDetails(dayWeatherSummary)}>
                <span className="text-slate-700">{dayWeatherSummary.day}</span>
                <span className="text-xl" aria-hidden="true">{dayWeatherSummary.emoji}</span>
                <span className="text-slate-500">
                              <span className="font-semibold text-slate-800">{ isCelsius ? dayWeatherSummary.temperatureMax : celsiusToFahrenheit(dayWeatherSummary.temperatureMax)}°</span>
                              <span className="mx-1 text-slate-300">/</span>
                              <span>{ isCelsius ? dayWeatherSummary.temperatureMin : celsiusToFahrenheit(dayWeatherSummary.temperatureMin)}°</span>
                            </span>
                <span className="text-slate-500 col-span-2">Precipitation Probability {dayWeatherSummary.precipitationProbabilityMax}%</span>
            </li>
        </>
    )
}