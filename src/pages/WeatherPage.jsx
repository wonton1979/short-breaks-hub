import locationFinder from "../utils/locationFinder.js";
import {useEffect, useState} from "react";
import celsiusToFahrenheit from "../utils/celsiusToFahrenheit.js";
import weatherDetails from "../utils/weatherDetails.js";
import getWeatherDescriptionAndEmoji from "../utils/weatherCodesTable.js";
import WeatherHourlySummary from "../components/WeatherHourlySummary.jsx";
import WeatherDailySummary  from "../components/WeatherDailySummary.jsx";
import Lottie from "lottie-react";
import LoadingAnimation from "../assets/Weather-app-animation.json";
import WeatherFooter from "../components/WeatherFooter.jsx";
import WeatherHeader from "../components/WeatherHeader.jsx";
import WeatherDetailsCard from "../components/WeatherDetailsCard.jsx";
import WeatherSearchBar from "../components/WeatherSearchBar.jsx";



export default function WeatherPage() {
    const [loading, setLoading] = useState(true);
    const [currentWeatherData, setCurrentWeatherData] = useState(null);
    const [twelveHoursWeatherSummary, setTwelveHoursWeatherSummary] = useState([]);
    const [sevenDaysWeatherSummary, setSevenDaysWeatherSummary] = useState([]);
    const [minDate, setMinDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]);
    const [maxDate, setMaxDate] = useState(new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0]);
    const [isCelsius,setIsCelsius] = useState(true);
    const [displayWeatherData,setDisplayWeatherData] = useState(null);
    const [isFutureDateSelected,setIsFutureDateSelected] = useState(false);
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [noLocationQueryResults, setNoLocationQueryResults] = useState(false);
    const [invalidDatePicked, setInvalidDatePicked] = useState(false);
    const [rawWeatherData, setRawWeatherData] = useState(null);
    const [isDataFetching, setIsDataFetching] = useState(false);

    function displayWeatherDetails(dayWeatherSummary) {
        setDisplayWeatherData(currentWeatherData=>({...currentWeatherData,
            currentTime:dayWeatherSummary.time,
            currentTemperature:dayWeatherSummary.temperatureMax,
            precipitationProbability:dayWeatherSummary.precipitationProbabilityMax,
            sunrise: dayWeatherSummary.sunrise,
            sunset: dayWeatherSummary.sunset,
            windSpeed: dayWeatherSummary.windSpeedMax,
            emoji: dayWeatherSummary.emoji,
            uxIndex: dayWeatherSummary.uxIndexMax,
            temperatureMin: dayWeatherSummary.temperatureMin,
        }));
        setIsFutureDateSelected(true);
    }

    function handleBackToCurrentWeather(){
        setIsFutureDateSelected(false);
        setDisplayWeatherData(currentWeatherData);
    }

    function handleLocationSearch(e){

        setNoLocationQueryResults(false)
        setIsDataFetching(true)
        const googleMapGeocodingApiKey = import.meta.env.VITE_GOOGLE_MAP_GEOCODING_API_KEY;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${googleMapGeocodingApiKey}`)
        .then(res => res.json()).then((data) => {
            if(data.status !== "ZERO_RESULTS"){
                let region;
                let country;
                if (data.results[0].address_components.length === 1){
                    region = data.results[0].address_components[0].long_name;
                    country = data.results[0].address_components[0].long_name;
                }
                else if(data.results[0].address_components.length === 2){
                    region = data.results[0].address_components[1].long_name;
                    country = data.results[0].address_components[1].long_name;
                }
                else if(data.results[0].address_components.length === 3){
                    region = data.results[0].address_components[1].long_name;
                    country = data.results[0].address_components[2].long_name;
                }
                else {
                    region = data.results[0].address_components[2].long_name;
                    country = data.results[0].address_components[3].long_name;
                }

                setCurrentWeatherData(current =>({...current,
                    city: data.results[0].address_components[0].long_name,
                    region:  region,
                    country: country,
                    latitude: data.results[0].geometry.location.lat,
                    longitude: data.results[0].geometry.location.lng,
                }));
                setIsFutureDateSelected(false);
            }
            else {
                setNoLocationQueryResults(true);
            }
        }).catch(err => setNoLocationQueryResults(true))
            .finally(() => {
                setIsDataFetching(false)
            })
    }


    function handleDateChange(){
        if (new Date(selectedDate) < new Date() || new Date(selectedDate) > new Date().setDate(new Date().getDate() + 14)){
            setInvalidDatePicked(true);
        }
        else{
            let dayIndex = 0;
            for(let eachDate of rawWeatherData.daily.time){
               if(new Date(selectedDate).toISOString().split("T")[0] === new Date(eachDate.toString().slice(4,15)).toLocaleString("en-CA").split(",")[0]){
                   break;
               }
               dayIndex++;
            }
            const timeRegexPattern =  /^[A-Za-z]{3}\s[A-Za-z]{3}\s[0-9]{2}\s[0-9]{4}/;
            const selectedDateWeatherSummary = {
                "day": rawWeatherData.daily.time[dayIndex].toString().split(" ")[0],
                "time": rawWeatherData.daily.time[dayIndex].toString().match(timeRegexPattern)[0],
                "emoji": getWeatherDescriptionAndEmoji(rawWeatherData.daily.weather_code[dayIndex]).emoji,
                "temperatureMax": Math.round(rawWeatherData.daily.temperature_2m_max[dayIndex]),
                "temperatureMin": Math.round(rawWeatherData.daily.temperature_2m_min[dayIndex]),
                "precipitationProbabilityMax": rawWeatherData.daily.precipitation_probability_max[dayIndex],
                "windSpeedMax": Math.round(rawWeatherData.daily.wind_speed_10m_max[dayIndex]),
                "sunrise": rawWeatherData.daily.sunrise[dayIndex].toString().split(" ")[4].slice(0, 5),
                "sunset": rawWeatherData.daily.sunset[dayIndex].toString().split(" ")[4].slice(0, 5),
                "uxIndexMax": rawWeatherData.daily.uv_index_max[dayIndex].toFixed(2),
            }
            displayWeatherDetails(selectedDateWeatherSummary);
            setInvalidDatePicked(false);
        }
    }

    useEffect(() => {
        (async () => {
           try {
               const result = await locationFinder()
               setCurrentWeatherData(result)
               setLoading(false);
           }
           catch(error) {
               console.error(error)
           }
        })()
    },[]);

    useEffect(() => {
        if(!currentWeatherData?.latitude || !currentWeatherData.longitude) return;
        setLoading(true);
        (async () => {
            try {
                const response = await weatherDetails(currentWeatherData.latitude, currentWeatherData.longitude);
                setRawWeatherData(response)
                const currentHour = parseInt(response.current.time.toString().split(" ")[4].split(":")[0]);
                setCurrentWeatherData(current => ({...current,
                    currentTime:response.current.time.toString().slice(0,25),
                    currentTemperature: Math.round(response.current.temperature_2m),
                    feelLike: Math.round(response.current.apparent_temperature),
                    relativeHumidity: response.current.relativeHumidity,
                    precipitationProbability: response.hourly.precipitation_probability[currentHour],
                    windSpeed: Math.round(response.current.wind_speed_10m),
                    sunrise: response.daily.sunrise.toString().split(" ")[4].slice(0,5),
                    sunset: response.daily.sunset.toString().split(" ")[4].slice(0,5),
                    description: getWeatherDescriptionAndEmoji(response.current.weather_code).description,
                    emoji: getWeatherDescriptionAndEmoji(response.current.weather_code).emoji,
                    uxIndex: response.hourly.uv_index[currentHour].toFixed(2),
                }));
                const hourlySummary = []
                for (let i = currentHour; i < currentHour + 12; i++) {
                    hourlySummary.push(
                        {
                            "time":response.hourly.time[i].toString().split(" ")[4].slice(0, 5),
                            "temperature": Math.round(response.hourly.temperature_2m[i]),
                            "emoji": getWeatherDescriptionAndEmoji(response.hourly.weather_code[i]).emoji
                        })
                }

                setTwelveHoursWeatherSummary(hourlySummary)

                const sevenDaysSummary = []
                const timeRegexPattern =  /^[A-Za-z]{3}\s[A-Za-z]{3}\s[0-9]{2}\s[0-9]{4}/;
                for(let i = 1; i < 8; i++){
                    sevenDaysSummary.push(
                        {
                            "day": response.daily.time[i].toString().split(" ")[0],
                            "time": response.daily.time[i].toString().match(timeRegexPattern)[0],
                            "emoji": getWeatherDescriptionAndEmoji(response.daily.weather_code[i]).emoji,
                            "temperatureMax": Math.round(response.daily.temperature_2m_max[i]),
                            "temperatureMin": Math.round(response.daily.temperature_2m_min[i]),
                            "precipitationProbabilityMax": response.daily.precipitation_probability_max[i],
                            "windSpeedMax": Math.round(response.daily.wind_speed_10m_max[i]),
                            "sunrise": response.daily.sunrise[i].toString().split(" ")[4].slice(0,5),
                            "sunset": response.daily.sunset[i].toString().split(" ")[4].slice(0,5),
                            "uxIndexMax": response.daily.uv_index_max[i].toFixed(2),
                        }
                    )
                }
                setSevenDaysWeatherSummary(sevenDaysSummary);

                setLoading(false)
            }
            catch(error) {
                console.error(error)
            }
        })()

    },[currentWeatherData?.latitude,currentWeatherData?.longitude]);

    useEffect(() => {
        console.log("currentWeatherData", currentWeatherData);
        setDisplayWeatherData(currentWeatherData)
    }, [twelveHoursWeatherSummary,sevenDaysWeatherSummary,currentWeatherData]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-white">
                <div className="w-[550px] h-[550px] mt-48 mx-auto">
                    <Lottie animationData={LoadingAnimation} loop={true} />
                </div>
            </div>
        )
    }

    return (
        <>
            <section className="rounded-xl border border-slate-500 bg-white shadow-sm overflow-hidden md:w-1/2 lg:w-1/3 mt-8 mx-auto">

                <div className="px-4 pb-4 mt-5">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Enter a Place Name</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder="eg. London"
                            className="w-full rounded-lg border
                            border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                        <button className={`rounded-lg ${isDataFetching ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900"}  px-3 py-1 text-sm font-semibold text-white`}
                                onClick={handleLocationSearch} disabled={isDataFetching}>{isDataFetching ? "Loading" : "Search"}</button>
                    </div>
                    {
                        noLocationQueryResults && (
                            <p className="text-red-600 text-[12px] mt-2">⚠️ Sorry, No Weather Data Was Found For Your Input.</p>
                        )
                    }
                </div>

                <div className="px-4 pb-4">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Pick a date</label>
                    <div className="flex gap-2">
                        <input type="date" value={selectedDate} min={minDate} max={maxDate} className="w-full rounded-lg border
                        border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                               onChange={e => setSelectedDate(e.target.value)} />
                        <button className="rounded-lg bg-slate-900 px-4 py-1 text-sm font-semibold text-white"
                                onClick={handleDateChange}>Show</button>
                    </div>
                    {
                        invalidDatePicked && (
                            <p className="text-red-600 text-[12px] mt-2">⚠️ Invalid Date Picked, Forecast Only Available Up To 14 Days From Today.</p>
                        )
                    }
                </div>

                <WeatherHeader currentWeatherData={currentWeatherData}
                               isCelsius={isCelsius}
                               handleBackToCurrentWeather={handleBackToCurrentWeather}
                               isFutureDateSelected={isFutureDateSelected}
                               setIsCelsius={setIsCelsius}
                />

                <WeatherDetailsCard currentWeatherData={currentWeatherData}
                                    isCelsius={isCelsius}
                                    displayWeatherData={displayWeatherData}
                                    isFutureDateSelected={isFutureDateSelected}
                />

                { !isFutureDateSelected && (
                    <div className="px-4 pb-4">
                        <p className="text-xs font-medium text-slate-500 mb-2">Next 12 hours</p>
                        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                            {twelveHoursWeatherSummary && twelveHoursWeatherSummary.map((eachHour)=>
                                (
                                    <
                                        WeatherHourlySummary
                                        key={eachHour.time}
                                        time={eachHour.time}
                                        emoji={eachHour.emoji}
                                        temperature={eachHour.temperature}
                                        isCelsius ={isCelsius}
                                    />
                                ))}
                        </div>
                    </div>
                )}


                <div className="px-4 pb-4">
                    <p className="text-xs font-medium text-slate-500 mb-2">Next 7 days</p>
                    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                        {sevenDaysWeatherSummary && sevenDaysWeatherSummary.map((eachDay)=>(
                            <
                                WeatherDailySummary
                                key={eachDay.day}
                                dayWeatherSummary={eachDay}
                                displayWeatherDetails={displayWeatherDetails}
                                isCelsius ={isCelsius}
                            />
                        ))}
                    </ul>
                </div>

            <WeatherFooter/>

            </section>

        </>
    )
}