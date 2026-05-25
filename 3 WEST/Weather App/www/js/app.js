document.addEventListener('deviceready', onDeviceReady, false);

// For browser testing when not on device
if (!window.cordova) {
    document.addEventListener('DOMContentLoaded', onDeviceReady, false);
}

function onDeviceReady() {
    console.log('Device is ready');
    
    // Set current date
    setCurrentDate();
    
    // Add event listeners
    document.getElementById('search-button').addEventListener('click', searchWeather);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    // Try to get user's current location if available
    tryGetCurrentLocation();
    
    // If geolocation fails or isn't available, load default city
    setTimeout(() => {
        if (document.getElementById('location').textContent === "Enter a location") {
            document.getElementById('search-input').value = "London";
            searchWeather();
        }
    }, 3000);
}

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('date').textContent = dateString;
}

function tryGetCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Get weather by coordinates
                getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.log("Geolocation error:", error);
                // If geolocation fails, we'll fall back to default city
            }
        );
    }
}

function getWeatherByCoordinates(lat, lon) {
    // Show loading state
    setLoadingState(true);
    
    // Hide any previous error
    document.getElementById('error-message').classList.add('hidden');
    
    const apiKey = '50d53005c0fd5f556bb4ef15224c4209'; // Example API key - replace with your own
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    // Check if using actual API
    const useActualAPI = apiKey && apiKey !== 'YOUR_API_KEY';
    
    if (useActualAPI) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
                setLoadingState(false);
                // Update search input with the found location name
                document.getElementById('search-input').value = data.name;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                showError('Could not retrieve weather for your location.');
                setLoadingState(false);
                // Fallback to sample data
                useFallbackData("Your Location");
            });
    } else {
        // Use fallback data
        useFallbackData("Your Location");
    }
}


function searchWeather() {
    const location = document.getElementById('search-input').value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Hide any previous error
    document.getElementById('error-message').classList.add('hidden');
    
    // API Key for OpenWeatherMap
    const apiKey = '50d53005c0fd5f556bb4ef15224c4209'; // Example API key - replace with your own
    
    // Use geocoding API first to get more accurate results for places like islands
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
    
    // Check if using actual API
    const useActualAPI = apiKey && apiKey !== 'YOUR_API_KEY';
    
    if (useActualAPI) {
        // First try the geocoding API to get precise coordinates
        fetch(geocodingUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(geoData => {
                if (geoData && geoData.length > 0) {
                    // Found location, now get weather using coordinates
                    const { lat, lon, name, country, state } = geoData[0];
                    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
                } else {
                    throw new Error('Location not found');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not available');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
                setLoadingState(false);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                
                // Try direct weather API call as fallback (for backward compatibility)
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Location not found');
                        }
                        return response.json();
                    })
                    .then(data => {
                        updateWeatherUI(data);
                        setLoadingState(false);
                    })
                    .catch(fallbackError => {
                        console.error('Fallback error:', fallbackError);
                        showError('Location not found. Please try a different search term.');
                        setLoadingState(false);
                        // Use fallback data as last resort
                        useFallbackData(location);
                    });
            });
    } else {
        // Use fallback data for demonstration
        useFallbackData(location);
    }
}

function useFallbackData(location) {
    console.log('Using fallback data for:', location);
    setTimeout(() => {
        const fallbackData = getFallbackWeatherData(location);
        updateWeatherUI(fallbackData);
        setLoadingState(false);
    }, 1000);
}

function getFallbackWeatherData(location) {
    // Generate reasonable fallback weather data based on the location name
    // This is just for demonstration when no API key is available
    
    // Use the location string to generate a consistent "random" weather
    let sum = 0;
    for (let i = 0; i < location.length; i++) {
        sum += location.charCodeAt(i);
    }
    
    // Determine if the location name suggests an island
    const islandKeywords = ['island', 'isle', 'isles', 'atoll', 'archipelago', 'hawaii', 'maldives', 'bahamas', 'fiji', 'bali'];
    const isIsland = islandKeywords.some(keyword => location.toLowerCase().includes(keyword));
    
    // For islands, prefer warm, tropical weather
    let temp, humidity, pressure, windSpeed, weatherIndex;
    
    if (isIsland) {
        temp = 24 + (sum % 10); // Higher temperature for islands (24-33)
        humidity = 65 + (sum % 25); // Higher humidity (65-89)
        windSpeed = 5 + (sum % 15); // Moderate to strong sea breeze (5-19)
        
        // Prefer clear/partly cloudy or light rain for islands
        const islandWeatherOptions = [0, 1, 2]; // Indices for clear, few clouds, light rain
        weatherIndex = islandWeatherOptions[sum % islandWeatherOptions.length];
    } else {
        // Regular weather patterns for non-islands
        temp = 15 + (sum % 25); // Temperature between 15 and 39
        humidity = 40 + (sum % 50); // Humidity between 40 and 89
        windSpeed = 2 + (sum % 18); // Wind speed between 2 and 19
        weatherIndex = sum % weatherConditions.length;
    }
    
    pressure = 1000 + (sum % 30); // Pressure between 1000 and 1029
    
    // Weather conditions array
    const weatherConditions = [
        { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
        { id: 801, main: "Clouds", description: "few clouds", icon: "02d" },
        { id: 500, main: "Rain", description: "light rain", icon: "10d" },
        { id: 200, main: "Thunderstorm", description: "thunderstorm", icon: "11d" },
        { id: 600, main: "Snow", description: "light snow", icon: "13d" },
        { id: 701, main: "Mist", description: "mist", icon: "50d" }
    ];
    
    // Determine country code based on location name
    // This is just for display purposes in the fallback data
    const countryCode = determineCountryCode(location);
    
    // Create a fake but realistic-looking response object
    return {
        name: location,
        sys: { country: countryCode },
        main: {
            temp: temp,
            feels_like: temp - 2,
            humidity: humidity,
            pressure: pressure
        },
        weather: [weatherConditions[weatherIndex]],
        wind: { speed: windSpeed / 3.6 } // Convert to m/s for compatibility
    };
}

function determineCountryCode(location) {
    // Simple function to assign a plausible country code for display purposes
    const locationLower = location.toLowerCase();
    
    // Check for common location keywords
    if (locationLower.includes('island') || locationLower.includes('isle')) {
        // Island-specific codes
        const islandCodes = ['BS', 'FJ', 'MV', 'PH', 'ID', 'MU'];
        return islandCodes[Math.floor(Math.random() * islandCodes.length)];
    }
    
    // Region-specific codes based on location name
    const regionPatterns = [
        { keywords: ['bali', 'java', 'sumatra', 'lombok'], code: 'ID' },
        { keywords: ['hawaii', 'maui', 'oahu', 'kauai'], code: 'US' },
        { keywords: ['maldives', 'male'], code: 'MV' },
        { keywords: ['bahamas', 'nassau', 'freeport'], code: 'BS' },
        { keywords: ['fiji', 'suva', 'nadi'], code: 'FJ' },
        { keywords: ['caribbean'], code: 'BB' },
        { keywords: ['pacific'], code: 'PF' },
        { keywords: ['atlantic'], code: 'PT' },
        { keywords: ['mediterranean'], code: 'GR' }
    ];
    
    for (const pattern of regionPatterns) {
        if (pattern.keywords.some(keyword => locationLower.includes(keyword))) {
            return pattern.code;
        }
    }
    
    // Default fallback codes
    const fallbackCodes = ['US', 'GB', 'CA', 'AU', 'FR', 'DE', 'JP', 'BR', 'IN', 'NZ'];
    return fallbackCodes[Math.floor(Math.random() * fallbackCodes.length)];
}

function updateWeatherUI(data) {
    // Update location
    const countryDisplay = data.sys && data.sys.country ? `, ${data.sys.country}` : '';
    document.getElementById('location').textContent = `${data.name}${countryDisplay}`;
    
    // Update temperature
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('feels-like').textContent = `Feels like: ${feelsLike}°C`;
    
    // Update weather description and icon
    const weatherDescription = data.weather[0].description;
    const weatherIconCode = data.weather[0].icon;
    document.getElementById('weather-description').textContent = weatherDescription;
    
    // Set weather icon based on condition
    setWeatherIcon(weatherIconCode);
    
    // Update details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${Math.round((data.wind.speed || 0) * 3.6)} km/h`; // Convert m/s to km/h
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    // Show weather info
    document.getElementById('weather-info').classList.remove('hidden');
}

function setWeatherIcon(iconCode) {
    let imagePath;
    
    // Determine if it's day or night
    const isDay = iconCode.includes('d');
    
    // Determine weather condition
    if (iconCode.startsWith('01')) {
        // Clear sky
        imagePath = isDay ? 'img/sunny.png' : 'img/clear-night.png';
    } else if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) {
        // Clouds
        imagePath = isDay ? 'img/partly-cloudy.png' : 'img/cloudy-night.png';
    } else if (iconCode.startsWith('09') || iconCode.startsWith('10')) {
        // Rain
        imagePath = 'img/rainy.png';
    } else if (iconCode.startsWith('11')) {
        // Thunderstorm
        imagePath = 'img/thunderstorm.png';
    } else if (iconCode.startsWith('13')) {
        // Snow
        imagePath = 'img/snow.png';
    } else if (iconCode.startsWith('50')) {
        // Mist/fog
        imagePath = 'img/mist.png';
    } else {
        // Default
        imagePath = 'img/default.png';
    }
    
    document.getElementById('weather-icon').src = imagePath;
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    document.getElementById('weather-info').classList.add('hidden');
}


function setLoadingState(isLoading) {
    const elements = ['location', 'temperature', 'feels-like', 'weather-description', 'humidity', 'wind', 'pressure'];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (isLoading) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    });
}
