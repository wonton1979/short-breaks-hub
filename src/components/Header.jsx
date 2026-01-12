export default function Header({currentWeatherData,isCelsius,setIsCelsius,handleBackToCurrentWeather,isFutureDateSelected}) {
    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-800 truncate">
                    {currentWeatherData?.region && (
                        currentWeatherData.region
                    )} <span className="text-slate-400">•</span> {currentWeatherData?.country && (
                    currentWeatherData.country
                )}
                </h2>
            </div>

            {isFutureDateSelected && (
                <button
                    onClick={handleBackToCurrentWeather}
                    className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white cursor-pointer"
                    title="Back to Today's Weather"
                >
                    ⟳ Live
                </button>
            )}

            <div className="inline-flex rounded-lg border border-slate-500 overflow-hidden">
                <button
                    type="button"
                    aria-pressed={isCelsius}
                    data-active={isCelsius}
                    onClick={()=>setIsCelsius(true)}
                    className="px-3 py-1 text-sm font-medium data-[active=true]:bg-slate-900 data-[active=true]:text-white"
                    title="Switch Between Celsius and Fahrenheit"
                >
                    °C
                </button>
                <div className="w-px bg-slate-300" />
                <button
                    type="button"
                    aria-pressed={!isCelsius}
                    data-active={!isCelsius}
                    onClick={()=>setIsCelsius(false)}
                    className="px-3 py-1 text-sm font-medium data-[active=true]:bg-slate-900 data-[active=true]:text-white"
                    title="Switch Between Celsius and Fahrenheit"
                >
                    °F
                </button>
            </div>
        </header>
    )
}