// TideCatcher - Fisherman's Companion App
// Main JavaScript file

// Configuration
const CONFIG = {
    // API Keys (you would need to get your own API keys for production)
    WEATHER_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY', // Replace this with actual API key
    TIDES_API_KEY: 'YOUR_WORLDTIDES_API_KEY',       // Replace this with actual API key
    
    // Default settings
    DEFAULT_LOCATION: { lat: 34.052235, lng: -118.243683 }, // Los Angeles as default
    DEFAULT_ZOOM: 13,
    DEFAULT_UNITS: {
        temperature: 'celsius', // celsius or fahrenheit
        distance: 'metric',     // metric or imperial
    },
    
    // Map tile layers
    MAP_LAYERS: {
        street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    },
    
    // Storage keys
    STORAGE_KEYS: {
        SETTINGS: 'tidecatcher_settings',
        SAVED_LOCATIONS: 'tidecatcher_locations',
    },
    
    // Chart colors
    CHART_COLORS: {
        tide: {
            line: 'rgba(10, 147, 150, 1)',
            fill: 'rgba(10, 147, 150, 0.2)',
        },
    },
};

// Main application class
class TideCatcher {
    constructor() {
        // Initialize properties
        this.map = null;
        this.currentPosition = null;
        this.currentMarker = null;
        this.tideChart = null;
        this.savedLocations = [];
        this.settings = {
            mapType: 'street',
            units: { ...CONFIG.DEFAULT_UNITS },
        };
        
        // Cache DOM elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize the application
        this.init();
    }
    
    // Cache frequently used DOM elements
    cacheElements() {
        // Map and containers
        this.mapElement = document.getElementById('map');
        this.sidebar = document.querySelector('.sidebar');
        
        // Location elements
        this.currentLocationElement = document.getElementById('current-location');
        this.coordinatesElement = document.getElementById('coordinates');
        
        // Tide elements
        this.tideStatusElement = document.getElementById('tide-status');
        this.nextTideElement = document.getElementById('next-tide');
        this.tideChartElement = document.getElementById('tide-chart');
        
        // Weather elements
        this.weatherIconElement = document.getElementById('weather-icon');
        this.weatherTempElement = document.getElementById('weather-temp');
        this.weatherDescElement = document.getElementById('weather-desc');
        this.windSpeedElement = document.getElementById('wind-speed');
        this.windDirectionElement = document.getElementById('wind-direction');
        this.humidityElement = document.getElementById('humidity');
        this.pressureElement = document.getElementById('pressure');
        
        // Settings elements
        this.mapTypeSelect = document.getElementById('map-type');
        this.searchLocationInput = document.getElementById('search-location');
        this.searchBtn = document.getElementById('search-btn');
        this.currentPositionBtn = document.getElementById('current-position-btn');
        this.tempUnitSelect = document.getElementById('temp-unit');
        this.distanceUnitSelect = document.getElementById('distance-unit');
        this.savedLocationsListElement = document.getElementById('saved-locations-list');
        this.saveLocationBtn = document.getElementById('save-location-btn');
        
        // Toggle elements
        this.toggleSidebarBtn = document.querySelector('.toggle-sidebar');
        this.closeSidebarBtn = document.querySelector('.close-sidebar');
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Sidebar toggle
        this.toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar(true));
        this.closeSidebarBtn.addEventListener('click', () => this.toggleSidebar(false));
        
        // Map type selection
        this.mapTypeSelect.addEventListener('change', () => {
            this.settings.mapType = this.mapTypeSelect.value;
            this.updateMapLayer();
            this.saveSettings();
        });
        
        // Location search
        this.searchBtn.addEventListener('click', () => this.searchLocation());
        this.searchLocationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchLocation();
        });
        
        // Current position button
        this.currentPositionBtn.addEventListener('click', () => this.getCurrentPosition());
        
        // Units selection
        this.tempUnitSelect.addEventListener('change', () => {
            this.settings.units.temperature = this.tempUnitSelect.value;
            this.saveSettings();
            if (this.currentPosition) {
                this.updateWeather(this.currentPosition);
            }
        });
        
        this.distanceUnitSelect.addEventListener('change', () => {
            this.settings.units.distance = this.distanceUnitSelect.value;
            this.saveSettings();
        });
        
        // Save location
        this.saveLocationBtn.addEventListener('click', () => this.saveCurrentLocation());
    }
    
    // Initialize the application
    async init() {
        // Load saved settings and locations
        this.loadSettings();
        this.loadSavedLocations();
        
        // Initialize the map
        this.initMap();
        
        // Try to get the user's current position
        try {
            await this.getCurrentPosition();
        } catch (error) {
            // If we can't get the user's position, use the default location
            console.error('Could not get current position:', error);
            this.setPosition(CONFIG.DEFAULT_LOCATION);
            this.updateLocationInfo('Unknown Location', CONFIG.DEFAULT_LOCATION);
        }
        
        // Initialize the tide chart
        this.initTideChart();
        
        // Set initial UI state
        this.updateUIFromSettings();
    }
    
    // Initialize the map with Leaflet
    initMap() {
        // Create the map
        this.map = L.map(this.mapElement, {
            center: CONFIG.DEFAULT_LOCATION,
            zoom: CONFIG.DEFAULT_ZOOM,
            zoomControl: true,
            attributionControl: false, // Disable attribution control to remove Leaflet watermark
        });
        
        // Add the default map layer
        this.updateMapLayer();
        
        // Add map event listeners
        this.map.on('click', (e) => {
            this.setPosition(e.latlng);
        });
    }
    
    // Update the map layer based on current settings
    updateMapLayer() {
        // Remove existing layers
        if (this.mapLayer) {
            this.map.removeLayer(this.mapLayer);
        }
        
        // Get the appropriate tile layer URL
        const tileUrl = CONFIG.MAP_LAYERS[this.settings.mapType] || CONFIG.MAP_LAYERS.street;
        
        // Create and add the new layer
        this.mapLayer = L.tileLayer(tileUrl, {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        });
        
        this.mapLayer.addTo(this.map);
    }
    
    // Get the user's current position
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    this.setPosition(latLng);
                    resolve(latLng);
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }
    
    // Set the current position and update all relevant info
    async setPosition(latLng) {
        this.currentPosition = latLng;
        
        // Update the map and marker
        this.map.setView([latLng.lat, latLng.lng], this.map.getZoom());
        this.updateMarker();
        
        // Update info panels
        await this.updateLocationInfo(null, latLng);
        await this.updateTideInfo(latLng);
        await this.updateWeather(latLng);
    }
    
    // Update the marker on the map
    updateMarker() {
        // Remove existing marker if it exists
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }
        
        // Create a new marker at the current position
        if (this.currentPosition) {
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: #005f73; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            
            this.currentMarker = L.marker([this.currentPosition.lat, this.currentPosition.lng], {
                icon: markerIcon,
                title: 'Current Location'
            }).addTo(this.map);
        }
    }
    
    // Update the location information panel
    async updateLocationInfo(locationName, latLng) {
        // Format coordinates
        const lat = latLng.lat.toFixed(6);
        const lng = latLng.lng.toFixed(6);
        this.coordinatesElement.textContent = `Coordinates: ${lat}, ${lng}`;
        
        // If a location name wasn't provided, attempt to get it via reverse geocoding
        if (!locationName) {
            try {
                locationName = await this.reverseGeocode(latLng);
            } catch (error) {
                console.error('Reverse geocoding failed:', error);
                locationName = 'Unknown Location';
            }
        }
        
        this.currentLocationElement.textContent = locationName;
    }
    
    // Initialize tide chart with Chart.js
    initTideChart() {
        const ctx = this.tideChartElement.getContext('2d');
        
        // Initial empty chart
        this.tideChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Tide Height',
                    data: [],
                    borderColor: CONFIG.CHART_COLORS.tide.line,
                    backgroundColor: CONFIG.CHART_COLORS.tide.fill,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const item = items[0];
                                return item.label;
                            },
                            label: (item) => {
                                return `Height: ${item.raw.toFixed(2)} m`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 8
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Height (m)'
                        }
                    }
                }
            }
        });
    }
    
    // Update tide information
    async updateTideInfo(latLng) {
        // Show loading state
        this.tideStatusElement.textContent = 'Loading...';
        this.nextTideElement.textContent = 'Loading...';
        
        try {
            // Fetch tide data
            const tideData = await this.fetchTideData(latLng);
            
            // Process tide data and update UI
            if (tideData && tideData.heights) {
                // Update tide chart
                this.updateTideChart(tideData.heights);
                
                // Find current and next tide status
                const currentTide = this.getCurrentTideStatus(tideData);
                this.tideStatusElement.textContent = currentTide.status;
                this.nextTideElement.textContent = currentTide.next;
            } else {
                // Handle case where tide data couldn't be retrieved
                this.tideStatusElement.textContent = 'Data unavailable';
                this.nextTideElement.textContent = 'Data unavailable';
                
                // Clear chart
                this.updateTideChart([]);
            }
        } catch (error) {
            console.error('Error updating tide info:', error);
            this.tideStatusElement.textContent = 'Error loading tide data';
            this.nextTideElement.textContent = 'Try again later';
            
            // Clear chart
            this.updateTideChart([]);
        }
    }
    
    // Update tide chart with new data
    updateTideChart(tideData) {
        if (!this.tideChart) return;
        
        // Format data for the chart
        const labels = [];
        const data = [];
        
        if (tideData && tideData.length > 0) {
            tideData.forEach(point => {
                // Format time for display
                const date = new Date(point.dt * 1000);
                const timeStr = date.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                labels.push(timeStr);
                data.push(point.height);
            });
        }
        
        // Update chart data
        this.tideChart.data.labels = labels;
        this.tideChart.data.datasets[0].data = data;
        this.tideChart.update();
    }
    
    // Analyze tide data to determine current and next tide status
    getCurrentTideStatus(tideData) {
        if (!tideData || !tideData.extremes || tideData.extremes.length === 0) {
            return { status: 'Unknown', next: 'Unknown' };
        }
        
        const now = new Date();
        const currentTime = now.getTime() / 1000; // Convert to seconds
        
        // Find the next extreme tide event
        let nextExtreme = null;
        
        for (const extreme of tideData.extremes) {
            if (extreme.dt > currentTime) {
                nextExtreme = extreme;
                break;
            }
        }
        
        if (!nextExtreme) {
            return { status: 'Unknown', next: 'No forecast available' };
        }
        
        // Determine current tide status (rising or falling)
        let currentStatus = '';
        if (nextExtreme.type === 'High') {
            currentStatus = 'Rising tide';
        } else {
            currentStatus = 'Falling tide';
        }
        
        // Format next tide time
        const nextTime = new Date(nextExtreme.dt * 1000);
        const timeStr = nextTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateStr = nextTime.toLocaleDateString([], {
            month: 'short',
            day: 'numeric'
        });
        
        const nextTideStr = `${nextExtreme.type} tide at ${timeStr} (${dateStr})`;
        
        return {
            status: currentStatus,
            next: nextTideStr
        };
    }
    
    // Fetch tide data from API
    async fetchTideData(latLng) {
        // In a real application, you would use a tide API
        // For demonstration, we'll generate simulated tide data
        
        // Simulated API call (replace this with actual API call in production)
        // const url = `https://api.worldtides.info/v2/heights?lat=${latLng.lat}&lon=${latLng.lng}&key=${CONFIG.TIDES_API_KEY}`;
        // const response = await fetch(url);
        // const data = await response.json();
        
        // Generate simulated tide data for demonstration
        return this.generateSimulatedTideData();
    }
    
    // Generate simulated tide data for demonstration purposes
    generateSimulatedTideData() {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        const heights = [];
        const extremes = [];
        
        // Tide cycle is roughly 12 hours 25 minutes
        const tideCycle = 12 * 60 * 60 + 25 * 60; // in seconds
        const cycleOffset = (now.getTime() / 1000) % tideCycle;
        
        // First high tide of the day (arbitrary)
        const firstHighTide = startOfDay.getTime() / 1000 + 3 * 60 * 60; // 3 AM
        
        // Generate 48 hours of tide data
        for (let i = 0; i < 48; i++) {
            const hourInSeconds = i * 60 * 60;
            const time = startOfDay.getTime() / 1000 + hourInSeconds;
            
            // Calculate tide height based on a sine wave
            const phase = ((time - firstHighTide) % tideCycle) / tideCycle;
            const height = 1.5 + Math.sin(phase * 2 * Math.PI) * 1.2;
            
            // Add data point
            heights.push({
                dt: time,
                height: height
            });
            
            // Check if this is an extreme point (high or low tide)
            // Assuming high tides at phase 0 and low tides at phase 0.5
            if (i > 0) {
                const prevPhase = ((time - 60*60 - firstHighTide) % tideCycle) / tideCycle;
                
                // Check for high tide
                if (prevPhase < 0.25 && phase >= 0.25) {
                    extremes.push({
                        dt: time - (phase - 0.25) * tideCycle / (phase - prevPhase),
                        height: 2.7,
                        type: 'High'
                    });
                }
                
                // Check for low tide
                if (prevPhase < 0.75 && phase >= 0.75) {
                    extremes.push({
                        dt: time - (phase - 0.75) * tideCycle / (phase - prevPhase),
                        height: 0.3,
                        type: 'Low'
                    });
                }
            }
        }
        
        return { heights, extremes };
    }
    
    // Update weather information
    async updateWeather(latLng) {
        // Show loading states
        this.weatherIconElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.weatherTempElement.textContent = '--';
        this.weatherDescElement.textContent = 'Loading...';
        this.windSpeedElement.textContent = '-- mph';
        this.windDirectionElement.textContent = '--';
        this.humidityElement.textContent = '--%';
        this.pressureElement.textContent = '-- hPa';
        
        try {
            // Fetch weather data
            const weatherData = await this.fetchWeatherData(latLng);
            
            if (weatherData) {
                // Update temperature with proper unit
                const temp = this.formatTemperature(weatherData.main.temp);
                this.weatherTempElement.textContent = temp;
                
                // Update weather description
                this.weatherDescElement.textContent = weatherData.weather[0].description;
                
                // Update weather icon
                const iconClass = this.getWeatherIconClass(weatherData.weather[0].id);
                this.weatherIconElement.innerHTML = `<i class="${iconClass}"></i>`;
                
                // Update wind information
                const windSpeed = this.formatWindSpeed(weatherData.wind.speed);
                this.windSpeedElement.textContent = windSpeed;
                
                const windDirection = this.getWindDirection(weatherData.wind.deg);
                this.windDirectionElement.textContent = windDirection;
                
                // Update humidity and pressure
                this.humidityElement.textContent = `${weatherData.main.humidity}%`;
                this.pressureElement.textContent = `${weatherData.main.pressure} hPa`;
            } else {
                this.setWeatherError();
            }
        } catch (error) {
            console.error('Error updating weather:', error);
            this.setWeatherError();
        }
    }
    
    // Set weather panel to error state
    setWeatherError() {
        this.weatherIconElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        this.weatherTempElement.textContent = '--';
        this.weatherDescElement.textContent = 'Weather data unavailable';
        this.windSpeedElement.textContent = '-- mph';
        this.windDirectionElement.textContent = '--';
        this.humidityElement.textContent = '--%';
        this.pressureElement.textContent = '-- hPa';
    }
    
    // Fetch weather data from API
    async fetchWeatherData(latLng) {
        // In a real application, you would use the OpenWeatherMap API
        // For demonstration, we'll generate simulated weather data
        
        // Simulated API call (replace this with actual API call in production)
        // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latLng.lat}&lon=${latLng.lng}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
        // const response = await fetch(url);
        // const data = await response.json();
        
        // Generate simulated weather data for demonstration
        return this.generateSimulatedWeatherData();
    }
    
    // Generate simulated weather data for demonstration purposes
    generateSimulatedWeatherData() {
        // Simple random weather data generator
        const weatherTypes = [
            { id: 800, main: 'Clear', description: 'clear sky' },
            { id: 801, main: 'Clouds', description: 'few clouds' },
            { id: 802, main: 'Clouds', description: 'scattered clouds' },
            { id: 803, main: 'Clouds', description: 'broken clouds' },
            { id: 500, main: 'Rain', description: 'light rain' },
            { id: 501, main: 'Rain', description: 'moderate rain' }
        ];
        
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        return {
            weather: [randomWeather],
            main: {
                temp: 15 + Math.random() * 15, // Random temp between 15-30°C
                humidity: 50 + Math.floor(Math.random() * 50), // Random humidity between 50-100%
                pressure: 1000 + Math.floor(Math.random() * 30) // Random pressure
            },
            wind: {
                speed: 2 + Math.random() * 20, // Random wind speed
                deg: Math.floor(Math.random() * 360) // Random wind direction
            }
        };
    }
    
    // Map weather condition codes to font awesome icons
    getWeatherIconClass(conditionCode) {
        if (conditionCode >= 200 && conditionCode < 300) {
            return 'fas fa-bolt'; // Thunderstorm
        } else if (conditionCode >= 300 && conditionCode < 400) {
            return 'fas fa-cloud-rain'; // Drizzle
        } else if (conditionCode >= 500 && conditionCode < 600) {
            return 'fas fa-cloud-showers-heavy'; // Rain
        } else if (conditionCode >= 600 && conditionCode < 700) {
            return 'fas fa-snowflake'; // Snow
        } else if (conditionCode >= 700 && conditionCode < 800) {
            return 'fas fa-smog'; // Atmosphere (fog, mist, etc.)
        } else if (conditionCode === 800) {
            return 'fas fa-sun'; // Clear
        } else if (conditionCode > 800) {
            return 'fas fa-cloud'; // Clouds
        }
        return 'fas fa-question-circle'; // Unknown
    }
    
    // Format temperature based on selected unit
    formatTemperature(tempCelsius) {
        if (this.settings.units.temperature === 'fahrenheit') {
            const tempF = (tempCelsius * 9/5) + 32;
            return `${tempF.toFixed(1)}°F`;
        } else {
            return `${tempCelsius.toFixed(1)}°C`;
        }
    }
    
    // Format wind speed based on selected unit
    formatWindSpeed(speedMetersPerSec) {
        if (this.settings.units.distance === 'imperial') {
            // Convert to mph (meters per second to miles per hour)
            const speedMph = speedMetersPerSec * 2.237;
            return `${speedMph.toFixed(1)} mph`;
        } else {
            // Convert to km/h
            const speedKmh = speedMetersPerSec * 3.6;
            return `${speedKmh.toFixed(1)} km/h`;
        }
    }
    
    // Convert wind direction degrees to cardinal direction
    getWindDirection(degrees) {
        const directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
        ];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
    
    // Reverse geocode coordinates to get location name
    async reverseGeocode(latLng) {
        // In a real application, you would use a geocoding API
        // For demonstration, we'll return a simulated location name
        
        // Simulated API call (replace this with actual API call in production)
        // const url = `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`;
        // const response = await fetch(url);
        // const data = await response.json();
        // return data.display_name;
        
        // For demonstration, return a generic name
        return `Fishing Spot at ${latLng.lat.toFixed(3)}, ${latLng.lng.toFixed(3)}`;
    }
    
    // Search for a location by name
    async searchLocation() {
        const query = this.searchLocationInput.value.trim();
        
        if (!query) return;
        
        try {
            // In a real application, you would use a geocoding API
            // For demonstration, we'll use a simulated result
            
            // Simulated API call (replace this with actual API call in production)
            // const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
            // const response = await fetch(url);
            // const data = await response.json();
            
            // if (data && data.length > 0) {
            //     const result = data[0];
            //     const latLng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
            //     this.setPosition(latLng);
            //     this.toggleSidebar(false);
            // } else {
            //     alert('Location not found. Please try another search.');
            // }
            
            // For demonstration, use random coordinates near the current position
            const randomOffset = (Math.random() - 0.5) * 0.1; // Random offset within ~5km
            const latLng = {
                lat: this.currentPosition ? this.currentPosition.lat + randomOffset : CONFIG.DEFAULT_LOCATION.lat,
                lng: this.currentPosition ? this.currentPosition.lng + randomOffset : CONFIG.DEFAULT_LOCATION.lng
            };
            
            this.setPosition(latLng);
            this.updateLocationInfo(query, latLng);
            this.toggleSidebar(false);
            
        } catch (error) {
            console.error('Error searching location:', error);
            alert('Error searching for location. Please try again.');
        }
    }
    
    // Toggle sidebar visibility
    toggleSidebar(show) {
        if (show) {
            this.sidebar.classList.add('active');
        } else {
            this.sidebar.classList.remove('active');
        }
    }
    
    // Save the current location to favorites
    saveCurrentLocation() {
        if (!this.currentPosition) return;
        
        // Get the current location name
        const locationName = this.currentLocationElement.textContent;
        
        // Create a new saved location object
        const savedLocation = {
            id: Date.now().toString(),
            name: locationName,
            position: { ...this.currentPosition }
        };
        
        // Add to saved locations
        this.savedLocations.push(savedLocation);
        
        // Update UI and save to storage
        this.updateSavedLocationsList();
        this.saveSavedLocations();
        
        // Show confirmation
        alert(`Location "${locationName}" has been saved.`);
    }
    
    // Update the saved locations list in the UI
    updateSavedLocationsList() {
        // Clear current list
        this.savedLocationsListElement.innerHTML = '';
        
        if (this.savedLocations.length === 0) {
            this.savedLocationsListElement.innerHTML = '<p>No saved locations</p>';
            return;
        }
        
        // Add each saved location to the list
        this.savedLocations.forEach(location => {
            const locationElement = document.createElement('div');
            locationElement.className = 'saved-location';
            locationElement.innerHTML = `
                <span class="saved-location-name">${location.name}</span>
                <div class="saved-location-actions">
                    <button class="go-to-location" data-id="${location.id}">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="remove-location" data-id="${location.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            this.savedLocationsListElement.appendChild(locationElement);
            
            // Add event listeners
            const goToBtn = locationElement.querySelector('.go-to-location');
            const removeBtn = locationElement.querySelector('.remove-location');
            
            goToBtn.addEventListener('click', () => this.goToSavedLocation(location.id));
            removeBtn.addEventListener('click', () => this.removeSavedLocation(location.id));
        });
    }
    
    // Go to a saved location
    goToSavedLocation(id) {
        const location = this.savedLocations.find(loc => loc.id === id);
        if (location) {
            this.setPosition(location.position);
            this.toggleSidebar(false);
        }
    }
    
    // Remove a saved location
    removeSavedLocation(id) {
        const confirmDelete = confirm('Are you sure you want to delete this saved location?');
        if (!confirmDelete) return;
        
        this.savedLocations = this.savedLocations.filter(loc => loc.id !== id);
        this.updateSavedLocationsList();
        this.saveSavedLocations();
    }
    
    // Load settings from local storage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    // Save settings to local storage
    saveSettings() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    // Load saved locations from local storage
    loadSavedLocations() {
        try {
            const savedLocations = localStorage.getItem(CONFIG.STORAGE_KEYS.SAVED_LOCATIONS);
            if (savedLocations) {
                this.savedLocations = JSON.parse(savedLocations);
                this.updateSavedLocationsList();
            }
        } catch (error) {
            console.error('Error loading saved locations:', error);
        }
    }
    
    // Save locations to local storage
    saveSavedLocations() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(this.savedLocations));
        } catch (error) {
            console.error('Error saving locations:', error);
        }
    }
    
    // Update UI elements based on current settings
    updateUIFromSettings() {
        // Update select elements
        this.mapTypeSelect.value = this.settings.mapType;
        this.tempUnitSelect.value = this.settings.units.temperature;
        this.distanceUnitSelect.value = this.settings.units.distance;
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TideCatcher();
});