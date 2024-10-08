// Select DOM elements
const container = document.querySelector('.container'); 
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found'); 
const cityHide = document.querySelector('.city-hide');

// Add event listener to the search button
searchButton.addEventListener('click', () => {

    const APIKey = '00c0c4564349142542d353837a52053f'; // Replace with your actual API key
    const city = document.querySelector('.search-box input').value.trim(); 

    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    // Fetch weather data from OpenWeatherMap API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            console.log('API Response:', json); // Debugging

            if (json.cod === '404') {
                cityHide.textContent = city;
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                console.log('City not found');
                return;
            }

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            if(cityHide.textContent.toLowerCase() === city.toLowerCase()) {
                console.log('Same city entered, not updating.');
                return;
            } else {
                cityHide.textContent = city;

                container.style.height = '555px';
                container.classList.add('active');
                weatherBox.classList.add('active');
                weatherDetails.classList.add('active');
                error404.classList.remove('active');

                // Removed the timeout that removes 'active' class from container
                /*
                setTimeout(()=>{
                    container.classList.remove('active');
                }, 2500);
                */

                // Update weather image based on condition
                const weatherMain = json.weather[0].main;
                console.log('Weather Main:', weatherMain); // Debugging

                const weatherIcons = {
                    'Clear': 'images/sun.png',
                    'Rain': 'images/rain.png',
                    'Snow': 'images/snowflake.png',
                    'Clouds': 'images/cloudy.png',
                    'Mist': 'images/haze.png',
                    'Haze': 'images/haze.png',
                    'Fog': 'images/haze.png',
                    // Add more conditions as needed
                };

                const iconSrc = weatherIcons[weatherMain] || 'images/cloudy.png';
                image.src = iconSrc;
                console.log(`Setting image to ${iconSrc}`);

                // Handle image loading errors
                image.onerror = () => {
                    console.error(`Failed to load image: ${image.src}`);
                    image.src = 'images/default.png'; // Ensure you have a default.png as fallback
                };

                // Update temperature
                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;

                // Update weather description
                description.innerHTML = `${json.weather[0].description}`;

                // Update humidity
                humidity.innerHTML = `${json.main.humidity}%`;

                // Update wind speed
                wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

                // Clone info elements (optional, ensure this logic is necessary)
                const infoWeather = document.querySelector('.info-weather');
                const infoHumidity = document.querySelector('.info-humidity');
                const infowind = document.querySelector('.info-wind');

                const elCloneInfoWeather = infoWeather.cloneNode(true);
                const elCloneInfoHumidity = infoHumidity.cloneNode(true);
                const elCloneInfowind = infowind.cloneNode(true);

                elCloneInfoWeather.id = 'clone-info-weather';
                elCloneInfoWeather.classList.add('active-clone');

                elCloneInfoHumidity.id = 'clone-info-humidity';
                elCloneInfoHumidity.classList.add('active-clone');

                elCloneInfowind.id = 'clone-info-wind';
                elCloneInfowind.classList.add('active-clone');

                setTimeout(() =>{
                    infoWeather.insertAdjacentElement("afterend", elCloneInfoWeather);
                    infoHumidity.insertAdjacentElement("afterend", elCloneInfoHumidity);
                    infowind.insertAdjacentElement("afterend", elCloneInfowind);
                },2200);

                const cloneInfoWeather = document.querySelectorAll('.info-weather + .active-clone');
                const totalCloneInfoWeather = cloneInfoWeather.length;
                const cloneInfoWeatherFirst = cloneInfoWeather[0];

                const cloneInfoHumidity = document.querySelectorAll('.info-humidity + .active-clone');
                const cloneInfoHumidityFirst = cloneInfoHumidity[0];

                const cloneInfowind = document.querySelectorAll('.info-wind + .active-clone');
                const cloneInfowindFirst = cloneInfowind[0];

                if(totalCloneInfoWeather > 0){
                    cloneInfoWeatherFirst.classList.remove('active-clone');
                    cloneInfoHumidityFirst.classList.remove('active-clone');
                    cloneInfowindFirst.classList.remove('active-clone');

                    setTimeout(() =>{
                        cloneInfoWeatherFirst.remove();
                        cloneInfoHumidityFirst.remove();
                        cloneInfowindFirst.remove();
                    },2200);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data.');
        });
});
