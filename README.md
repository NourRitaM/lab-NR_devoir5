# Weather Website (React)

This is the React version of my Weather Dashboard from Assignment 4. You type a city, and the app shows its current weather: temperature, description, humidity, wind speed and an icon. It opens on Beirut by default so the page is never empty.

The data comes from [Open-Meteo](https://open-meteo.com/), which is free and needs no API key, so there is nothing to configure.

**GitHub:** <put your repository link here>

## Run it

You need Node.js installed.

```bash
npm install
npm run dev
```

Then open the link shown in the terminal (usually http://localhost:5173).

## How I split the app

```
src/
  main.jsx                 starts the app
  App.jsx                  parent: holds the state and does the fetching
  components/
    SearchBar.jsx          input + search button
    LoadingSpinner.jsx     "Loading..." message
    ErrorMessage.jsx       shows an error
    WeatherCard.jsx        the weather card
    WeatherDetail.jsx      one small block (humidity or wind)
  styles/style.css         same design as Assignment 4
```

`App` is the only component that talks to the API. It keeps `city`, `searchCount`, `weather`, `loading` and `error` in state, and decides what to show: the loading message, the error, or the weather card.

`SearchBar` keeps what the user is typing (`inputValue`) in its own state, because no other component needs it. When the user clicks the button or presses Enter, it calls `onSearch`, a function passed down from `App`.

`WeatherCard` receives the `weather` object and turns Open-Meteo's weather code into a text description and an icon. It then uses `WeatherDetail` twice, for humidity and wind.

## State, effect and props

- **useEffect:** it fetches the weather whenever `city` or `searchCount` changes. It first looks up the city's coordinates, then asks for the weather at those coordinates. It also cancels the previous request with an `AbortController` if the user searches again before the first one finishes.
- **Why `searchCount`?** If a search fails (for example no internet) and the user clicks again with the same city, `city` doesn't change, so the effect wouldn't run. Increasing `searchCount` on every search fixes that.
- **Lifting state up:** the result is displayed by components other than the one where the user types, so `weather`, `loading` and `error` live in `App`.
- **Prop drilling:** data never goes more than two levels deep (`App` -> `WeatherCard` -> `WeatherDetail`), so I didn't need context or any extra tool.

## Error handling

The app shows a message for an empty search, a city that doesn't exist, a network problem, or the API's rate limit. The search button is disabled while a request is running.

## Built with

React, Vite, plain CSS, Open-Meteo (weather + geocoding) and Font Awesome for the icons.