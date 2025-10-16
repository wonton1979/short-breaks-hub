const weatherCodesTable = {
    0:  { emoji: "☀️", description: "Clear sky" },
    1:  { emoji: "🌤️", description: "Mainly clear" },
    2:  { emoji: "⛅", description: "Partly cloudy" },
    3:  { emoji: "☁️", description: "Overcast" },
    45: { emoji: "🌫️", description: "Fog" },
    48: { emoji: "🌫️", description: "Rime fog" },
    51: { emoji: "🌦️", description: "Light drizzle" },
    53: { emoji: "🌦️", description: "Moderate drizzle" },
    55: { emoji: "🌧️", description: "Dense drizzle" },
    56: { emoji: "🌧️❄️", description: "Light freezing drizzle" },
    57: { emoji: "🌧️❄️", description: "Dense freezing drizzle" },
    61: { emoji: "🌧️", description: "Slight rain" },
    63: { emoji: "🌧️", description: "Moderate rain" },
    65: { emoji: "🌧️", description: "Heavy rain" },
    66: { emoji: "🌧️❄️", description: "Light freezing rain" },
    67: { emoji: "🌧️❄️", description: "Heavy freezing rain" },
    71: { emoji: "🌨️", description: "Slight snowfall" },
    73: { emoji: "🌨️", description: "Moderate snowfall" },
    75: { emoji: "❄️", description: "Heavy snowfall" },
    77: { emoji: "🌨️", description: "Snow grains" },
    80: { emoji: "🌦️", description: "Slight rain showers" },
    81: { emoji: "🌦️", description: "Moderate rain showers" },
    82: { emoji: "🌧️", description: "Violent rain showers" },
    85: { emoji: "🌨️", description: "Slight snow showers" },
    86: { emoji: "🌨️", description: "Heavy snow showers" },
    95: { emoji: "⛈️", description: "Thunderstorm" },
    96: { emoji: "⛈️🧊", description: "Thunderstorm with slight hail" },
    99: { emoji: "⛈️🧊", description: "Thunderstorm with heavy hail" }
};

export default function getWeatherDescriptionAndEmoji(code) {
    return weatherCodesTable[code] || { emoji: "❔", description: "Unknown Weather" };
}
