import celsiusToFahrenheit from "../utils/celsiusToFahrenheit.js";

export default function DetailsCard({currentWeatherData,displayWeatherData,isFutureDateSelected,isCelsius}) {

    return (
        <div className="p-5 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{currentWeatherData?.city&& (
                        currentWeatherData?.city
                    )}</h2>
                    <p className="text-sm text-gray-500 mt-2">{displayWeatherData?.currentTime&& (
                        displayWeatherData.currentTime
                    )}
                    </p>
                </div>
                <div className="text-6xl">{displayWeatherData?.emoji && (
                    displayWeatherData.emoji
                )}</div>
            </div>

            <div className="mt-3 flex items-end gap-2">
                <p className="text-4xl font-bold text-gray-900">
                    {displayWeatherData?.currentTemperature && (
                        isCelsius ? displayWeatherData.currentTemperature : celsiusToFahrenheit(displayWeatherData.currentTemperature)
                    )}°
                </p>
                <p className={`text-4xl font-bold text-gray-900 ${isFutureDateSelected ? "block" : "hidden" }`}> / {displayWeatherData?.temperatureMin && (
                    isCelsius ? displayWeatherData.temperatureMin : celsiusToFahrenheit(displayWeatherData.temperatureMin)
                )}°</p>
                <p className="text-sm text-gray-600 mb-1">{displayWeatherData?.description && (
                    displayWeatherData.description
                )}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                <div className={`flex items-center gap-2 ${isFutureDateSelected ? "hidden" : "block" }`}>
                    🌡️ <span>Feels Like {displayWeatherData?.feelLike && (
                    isCelsius ? displayWeatherData.feelLike : celsiusToFahrenheit(displayWeatherData.feelLike))}°</span>
                </div>
                <div className="flex items-center gap-2">
                    💨 <span>Wind Speed {displayWeatherData?.windSpeed && (
                    displayWeatherData.windSpeed
                )} km/h</span>
                </div>
                <div className={`flex items-center gap-2 ${isFutureDateSelected ? "hidden" : "block" }`}>
                    💧 <span>Humidity  {displayWeatherData?.relativeHumidity && (
                    displayWeatherData.relativeHumidity
                )}%</span>
                </div>
                <div className="flex items-center gap-2">
                    🌦️ <span>Precipitation Probability  {displayWeatherData?.precipitationProbability && (
                    displayWeatherData.precipitationProbability
                )}%</span>
                </div>
                <div className="flex items-center gap-2">
                    🌅 <span>Sunrise Time {displayWeatherData?.sunrise && (
                    displayWeatherData.sunrise
                )}  / Sunset Time {displayWeatherData?.sunset && (
                    displayWeatherData.sunset
                )}</span>
                </div>
                <div className="flex items-center gap-2">
                    🌞 <span> UX Index {displayWeatherData?.uxIndex && (
                    displayWeatherData.uxIndex
                )}</span>
                </div>
            </div>
        </div>
    )
}