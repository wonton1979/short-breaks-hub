import {fetchWeatherApi} from 'openmeteo';

export default async function  openMeteoApi (latitude, longitude) {

    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["sunset", "sunrise", "weather_code", "temperature_2m_min", "temperature_2m_max", "precipitation_probability_max", "wind_speed_10m_max", "uv_index_max"],
        "hourly": ["temperature_2m", "weather_code", "precipitation_probability", "apparent_temperature",
            "wind_speed_10m", "wind_direction_10m", "rain", "showers", "snowfall", "visibility", "relative_humidity_2m",
            "uv_index"],
        "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "rain", "precipitation", "apparent_temperature", "wind_direction_10m", "showers", "snowfall", "wind_gusts_10m", "is_day"],
        "timezone": "auto",
        "forecast_days": 16,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];


    const utcOffsetSeconds = response.utcOffsetSeconds() - 3600;
    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();


    const sunset = daily.variables(0);
    const sunrise = daily.variables(1);


    return {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0).value(),
            relativeHumidity: current.variables(1).value(),
            weather_code: current.variables(2).value(),
            wind_speed_10m: current.variables(3).value(),
            rain: current.variables(4).value(),
            precipitation: current.variables(5).value(),
            apparent_temperature: current.variables(6).value(),
            wind_direction_10m: current.variables(7).value(),
            showers: current.variables(8).value(),
            snowfall: current.variables(9).value(),
            wind_gusts_10m: current.variables(10).value(),
            is_day: current.variables(11).value(),
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0).valuesArray(),
            weather_code: hourly.variables(1).valuesArray(),
            precipitation_probability: hourly.variables(2).valuesArray(),
            apparent_temperature: hourly.variables(3).valuesArray(),
            wind_speed_10m: hourly.variables(4).valuesArray(),
            wind_direction_10m: hourly.variables(5).valuesArray(),
            rain: hourly.variables(6).valuesArray(),
            showers: hourly.variables(7).valuesArray(),
            snowfall: hourly.variables(8).valuesArray(),
            visibility: hourly.variables(9).valuesArray(),
            relativeHumidity: hourly.variables(10).valuesArray(),
            uv_index: hourly.variables(11).valuesArray(),
        },
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),

            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),

            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            weather_code: daily.variables(2).valuesArray(),
            temperature_2m_min: daily.variables(3).valuesArray(),
            temperature_2m_max: daily.variables(4).valuesArray(),
            precipitation_probability_max: daily.variables(5).valuesArray(),
            wind_speed_10m_max: daily.variables(6).valuesArray(),
            uv_index_max: daily.variables(7).valuesArray(),
        },
    };
};