export function renderCurrentWeather(data) {
    document.getElementById('current-city').textContent = data.name;
    document.getElementById('current-date').textContent = new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('current-temp').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('current-humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('current-wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

export function renderForecast(forecast) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    forecast.forEach(day => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>Temp: ${day.main.temp}°C</p>
            <p>Wind: ${day.wind.speed} m/s</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;
        container.appendChild(div);
    });
}

export function renderHistory(history) {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        list.appendChild(li);
    });
}
