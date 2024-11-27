export async function fetchWeatherData(city, apiKey) {
    try {
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        if (!geoRes.ok) throw new Error('City not found');
        const geoData = await geoRes.json();
        const { lat, lon } = geoData[0];

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!weatherRes.ok) throw new Error('Weather data not found');
        const weatherData = await weatherRes.json();

        const current = weatherData.list[0];
        const forecast = weatherData.list.slice(1, 6);
        return { current, forecast };
    } catch (error) {
        alert(error.message);
        return null;
    }
}
