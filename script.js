const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherData = document.querySelector(".weather-data");

const API_KEY = "147bd36d0bc15ba5ccf35b49e89c4d2c";

// Function to fetch and display weather details
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=6&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.list || data.list.length === 0) {
                return alert("No weather data found!");
            }

            // Update current weather
            const currentWeather = data.list[0]; // Get first entry
            const { temp } = currentWeather.main;
            const { speed } = currentWeather.wind;
            const { humidity } = currentWeather.main;
            const weatherCondition = currentWeather.weather[0].description;
            const iconCode = currentWeather.weather[0].icon;

            document.querySelector(".current-weather .details h2").textContent = `${cityName} (${new Date().toISOString().split("T")[0]})`;
            document.querySelector(".current-weather .details h4:nth-child(2)").textContent = `Temperature: ${temp}°C`;
            document.querySelector(".current-weather .details h4:nth-child(3)").textContent = `Wind: ${speed} M/S`;
            document.querySelector(".current-weather .details h4:nth-child(4)").textContent = `Humidity: ${humidity}%`;
            document.querySelector(".current-weather .icon img").src = `https://openweathermap.org/img/wn/${iconCode}.png`;
            document.querySelector(".current-weather .icon h4").textContent = weatherCondition;

            // Update 5-day forecast
            const forecastHTML = data.list.slice(1).map(day => {
                const date = new Date(day.dt_txt).toISOString().split("T")[0];
                return `
                    <li class="card">
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather-icon" width="60px" height="60px">
                        <h3>${date}</h3>
                        <h4>Temp: ${day.main.temp}°C</h4>
                        <h4>Wind: ${day.wind.speed} M/S</h4>
                        <h4>Humidity: ${day.main.humidity}%</h4>
                    </li>
                `;
            }).join("");

            document.querySelector(".weather-cards").innerHTML = forecastHTML;
        })
        .catch(() => {
            alert("An error occurred while fetching the weather data!");
        });
};

// Function to get city coordinates
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return alert("Please enter a city name!");

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

// Event listener
searchButton.addEventListener("click", getCityCoordinates);
