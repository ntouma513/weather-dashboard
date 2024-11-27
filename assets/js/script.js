// Fetch weather data from OpenWeather API
async function fetchWeatherData(city, apiKey) {
    try {
        // Geolocation API to get latitude and longitude
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        if (!geoRes.ok) throw new Error('City not found');
        const geoData = await geoRes.json();

        if (geoData.length === 0) throw new Error('City not found');

        const { lat, lon } = geoData[0];

        // Weather forecast API
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!weatherRes.ok) throw new Error('Weather data not found');
        const weatherData = await weatherRes.json();

        return weatherData;
    } catch (error) {
        console.error(error);
        alert(error.message);
        return null;
    }
}


function renderCurrentWeather(data) {
    const currentWeather = data.list[0];

    
    const cityName = data.city.name;
    const temp = currentWeather.main.temp;
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const iconCode = currentWeather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  
    document.getElementById('current-city').textContent = cityName;
    document.getElementById('current-temp').textContent = `Temperature: ${temp}°C`;
    document.getElementById('current-humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('current-wind').textContent = `Wind Speed: ${windSpeed} m/s`;
    document.getElementById('current-icon').src = iconUrl;
}


function renderForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

   
    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = day.main.temp;
        const humidity = day.main.humidity;
        const windSpeed = day.wind.speed;
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Create forecast card
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temp: ${temp}°C</p>
            <p>Wind: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Render search history
function renderHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear previous history

    history.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        historyList.appendChild(listItem);
    });
}

// Event handler for city search
async function handleSearch(city, apiKey) {
    const data = await fetchWeatherData(city, apiKey);
    if (data) {
        renderCurrentWeather(data);
        renderForecast(data);

        // Update search history
        const history = JSON.parse(localStorage.getItem('history')) || [];
        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
            renderHistory(history);
        }
    }
}

// Initialize app
function init() {
    const apiKey = 'dfba652334e2e8913614b5fd6b14cbf6'; 
    const history = JSON.parse(localStorage.getItem('history')) || [];

    // Render search history on load
    renderHistory(history);

    // Add event listeners
    document.getElementById('search-btn').addEventListener('click', () => {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            handleSearch(city, apiKey);
        } else {
            alert('Please enter a city name.');
        }
    });

    document.getElementById('history-list').addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            const city = event.target.textContent;
            handleSearch(city, apiKey);
        }
    });
}


init();
