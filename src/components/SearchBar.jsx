import { useState } from "react";

// User types the name of a city into the search bar.
// onSearch and disabled come from App .
function SearchBar({ onSearch, disabled }) {
    // what the user is typing right now, only the search bar needs it so it stays here.
    const [inputValue, setInputValue] = useState("");

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            onSearch(inputValue);
        }
    }

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Enter city name"
                spellCheck="false"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={() => onSearch(inputValue)} disabled={disabled}>
                <i className="fa fa-search"></i> {/* fa fa-search is for the search icon beside the input box */}
            </button>
        </div>
    );
}

export default SearchBar;
