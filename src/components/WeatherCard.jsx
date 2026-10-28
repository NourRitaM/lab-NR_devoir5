import WeatherDetail from "./WeatherDetail";

// Open-Meteo sends a weather code (number) instead of a text, this turns it into a description.
function getDescription(code) {
    if (code === 0) return "Clear sky";
    if (code === 1) return "Mainly clear";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code === 85 || code === 86) return "Snow showers";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
}

// Choose a Font Awesome icon based on the current weather condition.
function getIconClass(code, isDay) {
    if (code === 0 || code === 1) {
        return isDay ? "fa fa-sun-o weather-icon" : "fa fa-moon-o weather-icon";
    } else if (code === 2 || code === 3 || code === 45 || code === 48) {
        return "fa fa-cloud weather-icon";
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        return "fa fa-umbrella weather-icon";
    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        return "fa fa-snowflake-o weather-icon";
    } else if (code >= 95) {
        return "fa fa-bolt weather-icon";
    } else {
        return "fa fa-cloud weather-icon";
    }
}

// Display the weather data that App kept from the API.
function WeatherCard({ weather }) {
    return (
        <div className="weather">
            <i className={getIconClass(weather.code, weather.isDay)}></i> {/* the weather icon */}
            <h1 className="temp">{Math.round(weather.temp)}°C</h1>
            <h2 className="city">{weather.city}, {weather.country}</h2>
            {/* weather conditions description (e.g. clear sky, light rain) */}
            <p className="description">{getDescription(weather.code)}</p>
            <div className="details">
                {/* fa-tint is for the humidity icon */}
                <WeatherDetail
                    iconClass="fa fa-tint"
                    value={weather.humidity + "%"}
                    label="Humidity"
                />
                {/* fa-flag is for the wind icon, the API already gives the wind speed in km/h */}
                <WeatherDetail
                    iconClass="fa fa-flag"
                    value={Math.round(weather.wind) + " Km/h"}
                    label="Wind Speed"
                />
            </div>
        </div>
    );
}

export default WeatherCard;
