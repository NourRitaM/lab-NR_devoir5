import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import WeatherCard from "./components/WeatherCard";

// Open-Meteo is free and does not need any API key.
// The first URL finds the city (name -> latitude and longitude).
// The second URL gives the current weather for those coordinates (temperature is in Celsius and wind in km/h by default).
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&name=";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day";

function App() {
    // city is the city we are showing right now (Beirut is the default one when the page opens).
    const [city, setCity] = useState("Beirut");
    // searchCount goes up at every search, so searching the same city again fetches again (ex: after a network error).
    const [searchCount, setSearchCount] = useState(0);
    // the data we keep from the API (null until we get something).
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch weather data every time the city changes (or a new search is made).
    useEffect(() => {
        // used to cancel the request if the user searches again before it finishes.
        const controller = new AbortController();

        async function checkWeather() {
            setError("");
            setLoading(true);

            try {
                // step 1: find the city
                const geoResponse = await fetch(GEO_URL + encodeURIComponent(city), { signal: controller.signal });

                if (geoResponse.status === 429) {
                    throw new Error("Too many requests (rate limit reached). Please wait a moment and try again.");
                } else if (!geoResponse.ok) {
                    throw new Error("Something went wrong (error " + geoResponse.status + "). Please try again later.");
                }

                const geoData = await geoResponse.json();

                // when the city does not exist the API sends no "results" at all.
                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error("City not found. Please check the spelling and try again.");
                }

                const place = geoData.results[0];

                // step 2: get the current weather of this city
                const weatherResponse = await fetch(
                    WEATHER_URL + "&latitude=" + place.latitude + "&longitude=" + place.longitude,
                    { signal: controller.signal }
                );

                if (weatherResponse.status === 429) {
                    throw new Error("Too many requests (rate limit reached). Please wait a moment and try again.");
                } else if (!weatherResponse.ok) {
                    throw new Error("Something went wrong (error " + weatherResponse.status + "). Please try again later.");
                }

                const weatherData = await weatherResponse.json();
                const current = weatherData.current;

                // keep only what the card needs.
                setWeather({
                    city: place.name,
                    country: place.country_code,
                    temp: current.temperature_2m,
                    humidity: current.relative_humidity_2m,
                    wind: current.wind_speed_10m,
                    code: current.weather_code,
                    isDay: current.is_day === 1,
                });

            } catch (err) {
                // the request was cancelled on purpose, nothing to show.
                if (err.name === "AbortError") {
                    return;
                }

                if (err.name === "TypeError") {
                    setError("Network error. Please check your internet connection.");
                } else {
                    setError(err.message);
                }
            } finally {
                // only stop the loading if this request was not cancelled by a newer one.
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        checkWeather();

        // cleanup: cancel the old request when the effect runs again.
        return () => controller.abort();
    }, [city, searchCount]);

    // Called by the SearchBar when the user clicks the button or presses Enter.
    function handleSearch(searchedCity) {
        if (searchedCity.trim() === "") {
            setError("Please enter a city name.");
            return;
        }

        setCity(searchedCity.trim());
        setSearchCount((count) => count + 1);
    }

    return (
        <div className="container">

            {/* search bar // city input */}
            {/* the button is disabled while a request is being processed */}
            <SearchBar onSearch={handleSearch} disabled={loading} />

            {/* message shown while the request is in progress */}
            {loading && <LoadingSpinner />}

            {/* error message (invalid city, network issue, etc.) */}
            {error && <ErrorMessage message={error} />}

            {/* the weather card is hidden when there is an error */}
            {weather && !error && <WeatherCard weather={weather} />}
        </div>
    );
}

export default App;
