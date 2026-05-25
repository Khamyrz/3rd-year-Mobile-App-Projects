// Global Variables
let map;
let currentScreen = 'homeScreen';
let logbookEntries = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize map
    initializeMap();
    
    // Initialize weather data
    fetchWeatherData();
    
    // Initialize tide chart
    initializeTideChart();
    
    // Load saved logbook entries
    loadLogbookEntries();
}

// Screen Navigation
function showScreen(screenId) {
    document.getElementById(currentScreen).classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
    currentScreen = screenId;
    
    // Special handling for map screen
    if (screenId === 'mapScreen' && map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
}

// Map Initialization
function initializeMap() {
    // Center the map between Madridejos, Santa Fe, and Bantayan
    const centerCoords = [11.218056, 123.735278];
    
    map = L.map('map', {
        center: centerCoords,
        zoom: 12,
        attributionControl: false,
        zoomControl: true,
        minZoom: 11,
        maxZoom: 19
    });
    
    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
    }).addTo(map);
    
    // Fishing spots across municipalities
    const fishingSpots = [
        // Madridejos Waters
        { 
            lat: 11.312500, 
            lng: 123.721667, 
            name: "Dakit-Dakit Ground",
            municipality: "Madridejos",
            description: "Deep water (18-22m). Prime spot for yellowfin tuna and dorado. Strong currents 2PM-5PM."
        },
        { 
            lat: 11.328889, 
            lng: 123.738889, 
            name: "Gibitngil Channel",
            municipality: "Madridejos",
            description: "Deep channel (25-30m). Tuna migration route. Best season: November-January."
        },

        // Santa Fe Waters
        {
            lat: 11.168333, 
            lng: 123.845000,
            name: "Hilantagaan Deep",
            municipality: "Santa Fe",
            description: "Deep water (30-35m). Rich in marlin and tuna. Strong currents during new moon."
        },
        {
            lat: 11.188889, 
            lng: 123.815556,
            name: "Santa Fe Banks",
            municipality: "Santa Fe",
            description: "Sandy banks (15-20m). Abundant in snappers and groupers. Best at dawn and dusk."
        },
        {
            lat: 11.125833, 
            lng: 123.795278,
            name: "Southern Reef",
            municipality: "Santa Fe",
            description: "Coral reef (8-12m). Rich in reef fish. Good during incoming tide."
        },

        // Bantayan Waters
        {
            lat: 11.201389, 
            lng: 123.658611,
            name: "Bantayan West Drop",
            municipality: "Bantayan",
            description: "Deep wall (25-30m). Pelagic fish gathering spot. Best during early morning."
        },
        {
            lat: 11.258889, 
            lng: 123.683889,
            name: "Bantayan North Channel",
            municipality: "Bantayan",
            description: "Deep channel (20-25m). Rich in mackerel and trevally. Good during tide change."
        },
        {
            lat: 11.181667, 
            lng: 123.688889,
            name: "Botigues Bank",
            municipality: "Bantayan",
            description: "Sandy plateau (12-15m). Bottom fishing spot. Abundant in emperors and snappers."
        },

        // Don Waters (Virgin Islands)
        {
            lat: 11.078611, 
            lng: 123.681944,
            name: "Virgin Islands Deep",
            municipality: "Don",
            description: "Deep water (35-40m). Big game fishing spot. Known for sailfish and marlin."
        },
        {
            lat: 11.088333, 
            lng: 123.708889,
            name: "Don Channel",
            municipality: "Don",
            description: "Channel edge (25-30m). Strong currents. Rich in yellowfin tuna."
        },

        // Kinatarkan Island Waters
        {
            lat: 10.988333, 
            lng: 123.805000,
            name: "Kinatarkan Deep",
            municipality: "Santa Fe",
            description: "Deep water (40-45m). Offshore fishing ground. Large pelagic species."
        }
    ];
    
    // Add custom markers with municipality-based colors
    fishingSpots.forEach(spot => {
        // Set color based on municipality
        const colors = {
            'Madridejos': '#8B0000',
            'Santa Fe': '#006400',
            'Bantayan': '#00008B',
            'Don': '#8B008B'
        };
        
        const markerColor = colors[spot.municipality] || '#000000';
        
        const marker = L.marker([spot.lat, spot.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-inner" style="background-color: ${markerColor};"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(map);
        
        const popupContent = `
            <div class="custom-popup">
                <h3>${spot.name}</h3>
                <span class="municipality">${spot.municipality}</span>
                <p>${spot.description}</p>
                <div class="coordinates">
                    <small>Lat: ${spot.lat.toFixed(6)}°N</small><br>
                    <small>Long: ${spot.lng.toFixed(6)}°E</small>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Weather Functions
async function fetchWeatherData() {
    try {
        // Replace with actual weather API call
        const weatherData = {
            temperature: 28,
            condition: 'Partly Cloudy',
            windSpeed: 15,
            humidity: 75
        };
        
        updateWeatherDisplay(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(data) {
    const weatherDiv = document.getElementById('currentWeather');
    weatherDiv.innerHTML = `
        <div class="weather-info">
            <p>Temperature: ${data.temperature}°C</p>
            <p>Condition: ${data.condition}</p>
            <p>Wind Speed: ${data.windSpeed} km/h</p>
            <p>Humidity: ${data.humidity}%</p>
        </div>
    `;
}

// Tide Chart
function initializeTideChart() {
    const ctx = document.getElementById('tideChart').getContext('2d');
    
    // Sample tide data
    const tideData = {
        labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
        datasets: [{
            label: 'Tide Level',
            data: [1.2, 0.8, 1.5, 2.0, 1.8, 1.0, 0.5, 1.3],
            borderColor: '#8B0000',
            fill: false
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: tideData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Logbook Functions
function showNewEntryForm() {
    const form = document.getElementById('logbookForm');
    form.classList.toggle('hidden');
}

function saveLogEntry() {
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const fishType = document.getElementById('fishType').value;
    const quantity = document.getElementById('quantity').value;
    const notes = document.getElementById('notes').value;
    
    if (!date || !location || !fishType || !quantity) {
        alert('Please fill in all required fields');
        return;
    }
    
    const entry = {
        date,
        location,
        fishType,
        quantity,
        notes
    };
    
    logbookEntries.push(entry);
    saveLogbookEntries();
    displayLogbookEntries();
    resetLogbookForm();
}

function resetLogbookForm() {
    document.getElementById('date').value = '';
    document.getElementById('location').value = '';
    document.getElementById('fishType').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('logbookForm').classList.add('hidden');
}

function saveLogbookEntries() {
    localStorage.setItem('logbookEntries', JSON.stringify(logbookEntries));
}

function loadLogbookEntries() {
    const saved = localStorage.getItem('logbookEntries');
    if (saved) {
        logbookEntries = JSON.parse(saved);
        displayLogbookEntries();
    }
}

function displayLogbookEntries() {
    const container = document.getElementById('logbookEntries');
    container.innerHTML = '';
    
    logbookEntries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'logbook-entry';
        entryElement.innerHTML = `
            <h3>${new Date(entry.date).toLocaleDateString()}</h3>
            <p><strong>Location:</strong> ${entry.location}</p>
            <p><strong>Fish Type:</strong> ${entry.fishType}</p>
            <p><strong>Quantity:</strong> ${entry.quantity}</p>
            ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
            <button onclick="deleteLogEntry(${index})">Delete</button>
        `;
        container.appendChild(entryElement);
    });
}

function deleteLogEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        logbookEntries.splice(index, 1);
        saveLogbookEntries();
        displayLogbookEntries();
    }
}

// Warning System
function updateWarningSystem() {
    const warningSection = document.getElementById('warningSection');
    const warningText = document.getElementById('warningText');
    
    // Replace with actual warning system logic
    const hasWarning = Math.random() > 0.5;
    
    if (hasWarning) {
        warningSection.style.display = 'flex';
        warningText.textContent = 'Strong winds expected. Exercise caution.';
    } else {
        warningSection.style.display = 'none';
    }
}

// Update weather and warnings every 5 minutes
setInterval(() => {
    fetchWeatherData();
    updateWarningSystem();
}, 300000); 