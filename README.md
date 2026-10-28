# Weather Website (React)

This project is the React version of my Weather Dashboard (Assignment 4). It is built with React and Vite, and it fetches real-time data from Open-Meteo (a free weather service that needs no account and no API key) to display the current weather for a city entered by the user.

## Project Goal

The app allows the user to type a city name, click the search button (or press Enter), and instantly see the current weather conditions, including:
- temperature
- city and country
- weather description
- humidity
- wind speed
- a matching weather icon

The page also loads a default city (Beirut) when it opens, so the user sees weather data immediately.

## Setup and Run

No API key and no account are needed, so there is nothing to configure.

1. Make sure Node.js is installed on your computer.
2. Install the dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the link shown in the terminal (usually http://localhost:5173).

## Project Structure

```
src/
  main.jsx                  -> starts the React app
  App.jsx                   -> main component, holds the state and does the fetch
  components/
    SearchBar.jsx           -> input + search button
    LoadingSpinner.jsx      -> "Loading..." message
    ErrorMessage.jsx        -> error message
    WeatherCard.jsx         -> the weather card
    WeatherDetail.jsx       -> one detail of the card (humidity or wind)
  styles/
    style.css               -> same design as Assignment 4
```

## Components

### `App.jsx`
The parent of everything. It contains:
- the state: `city`, `searchCount`, `weather`, `loading` and `error` (with `useState`)
- the `useEffect` that fetches the data from Open-Meteo every time `city` or `searchCount` changes (first it finds the city, then it gets its current weather)
- `handleSearch`, the function the search bar calls
- the conditional rendering of the loading message, the error message and the weather card

### `SearchBar.jsx`
Contains the input and the search button. It keeps what the user is typing in its own state (`inputValue`) and calls `onSearch` (a prop from `App`) when the user clicks the button or presses Enter. The button is disabled while loading.

### `LoadingSpinner.jsx`
Shows the loading message while the request is running.

### `ErrorMessage.jsx`
Shows the error text it receives in the `message` prop.

### `WeatherCard.jsx`
Receives the weather data in the `weather` prop and displays the temperature, city, description and the icon. The icon is chosen with a `getIconClass` function like in Assignment 4 (but it uses Open-Meteo weather codes), and `getDescription` turns the code into a text. It also renders two `WeatherDetail` components.

### `WeatherDetail.jsx`
Small reusable component used for humidity and wind speed (icon + value + label).

## State Management and Props

- `useState` is used in `App` (city, searchCount, weather, loading, error) and in `SearchBar` (inputValue).
- `useEffect` is used in `App` to fetch the weather. Its dependency array is `[city, searchCount]`, so it runs when the page opens and every time the user makes a new search. It also has a cleanup function that cancels the old request (`AbortController`) if the user searches again before it ends.
- Props go from parent to child: `App` -> `SearchBar` (`onSearch`, `disabled`), `App` -> `ErrorMessage` (`message`), `App` -> `WeatherCard` (`weather`) and `WeatherCard` -> `WeatherDetail` (`iconClass`, `value`, `label`).
- **Lifting state up:** the search result has to be shown by other components than the one where the user types, so `city`, `weather`, `loading` and `error` live in `App`, and `SearchBar` sends the typed city up with the `onSearch` function. Only `inputValue` stays inside `SearchBar` because nobody else needs it.
- **Prop drilling:** the data never goes deeper than two levels (`App` -> `WeatherCard` -> `WeatherDetail`), so no context or extra tool was needed.

## How the App Works

1. The user enters a city name into the input field.
2. `App` checks whether the value is empty.
3. The `useEffect` sends a request to find the city, then another one to get its weather, and the loading message is shown.
4. If the responses are successful, the weather card is displayed.
5. If there is a problem, it shows a message such as:
   - city not found
   - network error
   - rate limit reached
6. The search button is temporarily disabled while loading to prevent repeated requests.

## Security

Open-Meteo does not use an API key, so there is no secret to hide and nothing to keep out of GitHub.

## Notes

This project is used to practice:
- building a UI as a tree of React components
- managing state with `useState`
- fetching data with `useEffect`
- passing data with props
- displaying loading and error states
- building a responsive website

## Technologies Used

- React
- Vite
- JavaScript (JSX)
- CSS
- Open-Meteo API (weather + geocoding)
- Font Awesome
