// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected screen
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            
            // Initialize map if maps screen is selected
            if (screenId === 'maps' && !mapInitialized) {
                initializeMap();
                mapInitialized = true;
            }
        });
    });

    // Checklist functionality
    const checklistItems = document.querySelectorAll('.checklist input[type="checkbox"]');
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            const listItem = this.parentElement;
            if (this.checked) {
                listItem.classList.add('checked');
            } else {
                listItem.classList.remove('checked');
            }
            updateProgress();
        });
    });

    function updateProgress() {
        const total = checklistItems.length;
        const checked = document.querySelectorAll('.checklist input[type="checkbox"]:checked').length;
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        const percentage = (checked / total) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `Progress: ${checked}/${total} items packed`;
    }

    // Filter buttons functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterMapMarkers(filter);
        });
    });

    // Category buttons in checklist
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Audio buttons for phrases
    const audioBtns = document.querySelectorAll('.audio-btn');
    const phrasesAudio = {
        'hello': 'phrases/audio1.mp3',
        'thank_you': 'phrases/audio2.mp3',
        'good_morning': 'phrases/audio3.mp3',
        'how_are_you': 'phrases/audio4.mp3',
        'goodbye': 'phrases/audio5.mp3',
        'where_is_beach': 'phrases/audio6.mp3',      // Asa ang baybayon?
        'delicious_food': 'phrases/audio7.mp3',      // Lami kaayo!
        'how_much': 'phrases/audio8.mp3',            // Pila ni?
        'yes_please': 'phrases/audio9.mp3',          // Oo palihug
        'no_thank_you': 'phrases/audio10.mp3',       // Dili salamat
        'excuse_me': 'phrases/audio11.mp3',          // Agi ko
        'good_evening': 'phrases/audio12.mp3',       // Maayong gabii
        'nice_to_meet_you': 'phrases/audio13.mp3',   // Nalipay ko nga nakaila nimo
        'where_is_market': 'phrases/audio14.mp3',    // Asa ang merkado?
        'water_please': 'phrases/audio15.mp3'        // Tubig palihug
    };

    audioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const phraseKey = this.getAttribute('data-phrase');
            const audioFile = phrasesAudio[phraseKey];
            
            if (audioFile) {
                const audio = new Audio(audioFile);
                audio.play();
            }
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '🔉';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    });

    // Map variables
    let map;
    let mapInitialized = false;
    let markers = {
        all: [],
        beaches: [],
        restaurants: [],
        hotels: [],
        transport: [],
        attractions: []
    };
    
    // Store offline map data
    let offlineMapData = {
        timestamp: null,
        bbox: null,
        tiles: []
    };

    // Map variables and marker images
    const markerImages = {
        'Kota Beach': 'img/kota_beach.png',
        'Langub Beach': 'img/langub_beach.png',
        'Sugar Beach': 'img/sugar_beach.png',
        'Madridejos Public Beach': 'img/public_beach.png',
        'Lawis Lighthouse': 'img/lighthouse.png',
        'Kota Park': 'img/kota_park.png',
        'Madridejos Ruins': 'img/ruins.png',
        'Balidbid Cave': 'img/cave.png',
        'St. Rose of Lima Church': 'img/church.png',
        'Kota Beach Resort': 'img/kota_resort.png',
        'Ogtong Cave Resort': 'img/ogtong_resort.png',
        'Madridejos Guesthouse': 'img/guesthouse.png',
        'Beach Placid Resort': 'img/placid_resort.png',
        'Casa de Sol': 'img/casa_sol.png',
        'Bantayan Burgers': 'img/burgers.png',
        'Island Seafood Restaurant': 'img/seafood.png',
        'Cafe del Mar': 'img/cafe.png',
        'Madridejos Market Eatery': 'img/market_eatery.png',
        'Kota Beach Bar & Grill': 'img/beach_grill.png',
        'Madridejos Jeepney Terminal': 'img/jeepney.png',
        'Tricycle Terminal': 'img/tricycle.png',
        'Motorbike Rental': 'img/motorbike.png',
        'Habal-Habal Station': 'img/habal.png',
        'Madridejos Port': 'img/port.png'
    };

    // Initialize Leaflet map
    function initializeMap() {
        // Bantayan Island, Madridejos coordinates - precise center of the municipality
        const madridejosCoords = [11.2773, 123.7303];
        
        // Initialize the map
        map = L.map('map', {
            attributionControl: false,  // Hide attribution
            zoomControl: false         // Hide zoom control
        }).setView(madridejosCoords, 13);
        
        // Add OpenStreetMap tile layer (default)
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',  // Remove attribution text
            maxZoom: 19
        }).addTo(map);
        
        // Add Esri satellite imagery layer for more precise location reference
        const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',  // Remove attribution text
            maxZoom: 19
        });
        
        // Add layer control to switch between map types
        const baseMaps = {
            "Street Map": osmLayer,
            "Satellite": esriSatellite
        };
        
        L.control.layers(baseMaps).addTo(map);
        
        // Custom icons for different categories
        const beachIcon = L.divIcon({
            className: 'custom-marker beach-marker',
            html: '<div style="background-color: #03A9F4; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const attractionIcon = L.divIcon({
            className: 'custom-marker attraction-marker',
            html: '<div style="background-color: #FF9800; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const hotelIcon = L.divIcon({
            className: 'custom-marker hotel-marker',
            html: '<div style="background-color: #4CAF50; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const restaurantIcon = L.divIcon({
            className: 'custom-marker restaurant-marker',
            html: '<div style="background-color: #F44336; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const transportIcon = L.divIcon({
            className: 'custom-marker transport-marker',
            html: '<div style="background-color: #9C27B0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        // Add markers with precisely verified coordinates for Madridejos, Bantayan Island
        
        // Beaches with precise coordinates
        addMarker(11.3069, 123.7230, 'Kota Beach', 'beaches', 'White sand beach with crystal clear waters', beachIcon);
        addMarker(11.2540, 123.7333, 'Langub Beach', 'beaches', 'Hidden gem with cave formations', beachIcon);
        addMarker(11.2964, 123.7251, 'Sugar Beach', 'beaches', 'Powdery white sand beach', beachIcon);
        addMarker(11.2723, 123.7481, 'Madridejos Public Beach', 'beaches', 'Local spot with shallow waters', beachIcon);
        
        // Attractions with precise coordinates
        addMarker(11.3125, 123.7222, 'Lawis Lighthouse', 'attractions', 'Historical lighthouse with panoramic views', attractionIcon);
        addMarker(11.2844, 123.7233, 'Kota Park', 'attractions', 'Beautiful park with great sunset views', attractionIcon);
        addMarker(11.2754, 123.7377, 'Madridejos Ruins', 'attractions', 'Spanish-era historical site', attractionIcon);
        addMarker(11.2866, 123.7393, 'Balidbid Cave', 'attractions', 'Natural cave formation', attractionIcon);
        addMarker(11.2717, 123.7443, 'St. Rose of Lima Church', 'attractions', 'Historical Catholic church', attractionIcon);
        
        // Hotels & Accommodations with precise coordinates
        addMarker(11.3068, 123.7231, 'Kota Beach Resort', 'hotels', 'Beachfront accommodation with cottages', hotelIcon);
        addMarker(11.2865, 123.7217, 'Ogtong Cave Resort', 'hotels', 'Resort with natural cave pool', hotelIcon);
        addMarker(11.2728, 123.7443, 'Madridejos Guesthouse', 'hotels', 'Budget-friendly option in town center', hotelIcon);
        addMarker(11.2913, 123.7229, 'Beach Placid Resort', 'hotels', 'Beach resort with swimming pool', hotelIcon);
        addMarker(11.2666, 123.7432, 'Casa de Sol', 'hotels', 'Boutique hotel with garden', hotelIcon);
        
        // Restaurants with precise coordinates
        addMarker(11.2716, 123.7422, 'Bantayan Burgers', 'restaurants', 'Local burger joint', restaurantIcon);
        addMarker(11.2770, 123.7458, 'Island Seafood Restaurant', 'restaurants', 'Fresh seafood daily', restaurantIcon);
        addMarker(11.2743, 123.7425, 'Cafe del Mar', 'restaurants', 'Coffee and pastries', restaurantIcon);
        addMarker(11.2694, 123.7458, 'Madridejos Market Eatery', 'restaurants', 'Local Filipino cuisine', restaurantIcon);
        addMarker(11.3068, 123.7235, 'Kota Beach Bar & Grill', 'restaurants', 'Beachfront dining', restaurantIcon);
        
        // Transport with precise coordinates
        addMarker(11.2728, 123.7452, 'Madridejos Jeepney Terminal', 'transport', 'Local jeepney routes to Santa Fe and Bantayan', transportIcon);
        addMarker(11.2700, 123.7420, 'Tricycle Terminal', 'transport', 'Available for hire around Madridejos', transportIcon);
        addMarker(11.2766, 123.7454, 'Motorbike Rental', 'transport', 'Daily motorcycle rentals', transportIcon);
        addMarker(11.2653, 123.7470, 'Habal-Habal Station', 'transport', 'Motorcycle taxi service', transportIcon);
        addMarker(11.2692, 123.7406, 'Madridejos Port', 'transport', 'Small boat transfers to nearby islands', transportIcon);
        
        // Define precise boundaries of Madridejos municipality based on satellite imagery
        const madridejosPolygon = L.polygon([
            [11.3131, 123.7206], // Northern tip near Lawis Lighthouse
            [11.3082, 123.7353],
            [11.3018, 123.7460],
            [11.2846, 123.7534],
            [11.2631, 123.7562], // Eastern edge
            [11.2489, 123.7447], // Southern tip
            [11.2523, 123.7291],
            [11.2605, 123.7186],
            [11.2783, 123.7147], // Western coast
            [11.2952, 123.7165],
            [11.3087, 123.7188]
        ], {
            color: '#FFC107',
            fillColor: '#FFC10733',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(map);
        
        // Add Madridejos label
        L.marker([11.2773, 123.7303], {
            icon: L.divIcon({
                className: 'location-label',
                html: '<div style="background-color: rgba(255,255,255,0.7); padding: 3px 6px; border-radius: 3px; font-weight: bold;">Madridejos</div>',
                iconSize: [100, 20],
                iconAnchor: [50, 10]
            })
        }).addTo(map);
        
        // Add scale control
        L.control.scale({
            metric: true,
            imperial: false,
            position: 'bottomleft'
        }).addTo(map);
    }

    function addMarker(lat, lng, title, category, description, customIcon = null) {
        const markerOptions = customIcon ? { icon: customIcon } : {};
        const marker = L.marker([lat, lng], markerOptions).addTo(map);
        
        // Create a detailed popup with more information
        const markerImage = markerImages[title] ? `<img src="${markerImages[title]}" alt="${title}" style="width: 100%; max-width: 200px; height: auto; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">` : '';
        
        const popupContent = `
            <div class="marker-popup">
                ${markerImage}
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="popup-coordinates">
                    <small>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn directions-btn" onclick="console.log('Get directions to ${title}')">Directions</button>
                    <button class="popup-btn save-btn" onclick="console.log('Save ${title} to favorites')">Save</button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add to all markers
        markers.all.push(marker);
        
        // Add to category-specific array
        if (markers[category]) {
            markers[category].push(marker);
        } else if (category === 'attractions') {
            // If attractions array doesn't exist yet, create it
            markers.attractions = [];
            markers.attractions.push(marker);
        }
    }

    function filterMapMarkers(filter) {
        if (!map) return;
        
        // Clear all markers
        markers.all.forEach(marker => map.removeLayer(marker));
        
        // Add filtered markers
        if (filter === 'all') {
            markers.all.forEach(marker => marker.addTo(map));
        } else if (markers[filter]) {
            markers[filter].forEach(marker => marker.addTo(map));
            
            // Adjust map view to fit the filtered markers if available
            if (markers[filter].length > 0) {
                const markerGroup = L.featureGroup(markers[filter]);
                map.fitBounds(markerGroup.getBounds().pad(0.2)); // Add padding around the bounds
            }
        }
        
        // Display a message if no markers in this category
        const categoryInfo = document.createElement('div');
        categoryInfo.className = 'map-category-info';
        
        if (markers[filter] && markers[filter].length > 0) {
            categoryInfo.textContent = `Showing ${markers[filter].length} ${filter} locations in Madridejos`;
        } else if (filter !== 'all') {
            categoryInfo.textContent = `No ${filter} found in the current view`;
        } else {
            categoryInfo.textContent = `Showing ${markers.all.length} locations in Madridejos`;
        }
        
        // Remove any existing info
        const existingInfo = document.querySelector('.map-category-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Add the info to the map container
        document.getElementById('map').insertAdjacentElement('afterend', categoryInfo);
    }

    // Mock weather data - in a real app, this would come from an API
    // and be saved for offline use
    function updateWeather() {
        const weatherInfo = document.querySelector('.weather-info');
        const weatherTime = document.querySelector('.weather-time');
        
        // Mock data
        const currentTemp = 28;
        const condition = 'Sunny';
        const highTemp = 31;
        const lowTemp = 25;
        
        weatherInfo.textContent = `Currently ${currentTemp}°C, ${condition}`;
        weatherTime.textContent = `High: ${highTemp}°C | Current: ${currentTemp}°C | Low: ${lowTemp}°C`;
    }
    
    // Initialize weather data
    updateWeather();
    
    // Handle offline functionality
    function checkConnectivity() {
        const statusElement = document.createElement('div');
        statusElement.className = 'connectivity-status';
        
        if (navigator.onLine) {
            console.log('App is online - downloading latest data');
            statusElement.textContent = 'Online Mode - Map data updated';
            statusElement.classList.add('online');
            
            // In a real app, this is where we would:
            // 1. Download and store map tiles for offline use
            // 2. Cache updated POI data
            // 3. Update weather information
            
            // Simulated storage of map data for Bantayan Island
            offlineMapData = {
                timestamp: new Date().toISOString(),
                bbox: {
                    north: 11.3200,
                    south: 11.2450,
                    east: 123.7650,
                    west: 123.7100
                },
                // In a real app, these would be actual map tile data
                tilesCount: 112
            };
            
            try {
                // Store the offline data in localStorage (simulated)
                localStorage.setItem('islandpal_map_data', JSON.stringify(offlineMapData));
                localStorage.setItem('islandpal_markers', JSON.stringify(getMarkersForStorage()));
                console.log('Saved map data for offline use');
            } catch (e) {
                console.error('Error saving offline data:', e);
            }
            
        } else {
            console.log('App is offline - using cached data');
            statusElement.textContent = 'Offline Mode - Using saved map data';
            statusElement.classList.add('offline');
            
            // In a real app, this is where we would:
            // 1. Load cached map tiles
            // 2. Display stored POI data
            // 3. Show cached weather info with timestamp
            
            try {
                // Retrieve offline data (simulated)
                const storedMapData = localStorage.getItem('islandpal_map_data');
                if (storedMapData) {
                    offlineMapData = JSON.parse(storedMapData);
                    console.log(`Using offline map data from ${offlineMapData.timestamp}`);
                }
            } catch (e) {
                console.error('Error loading offline data:', e);
            }
        }
        
        // Remove any existing status element
        const existingStatus = document.querySelector('.connectivity-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Add status element to the app
        document.querySelector('#app').appendChild(statusElement);
        
        // Automatically hide after 3 seconds
        setTimeout(() => {
            statusElement.style.opacity = '0';
            setTimeout(() => statusElement.remove(), 500);
        }, 3000);
    }
    
    // Helper function to prepare marker data for storage
    function getMarkersForStorage() {
        return markers.all.map(marker => {
            const latLng = marker.getLatLng();
            const popup = marker._popup._content;
            
            // Extract title from popup content
            const titleMatch = popup.match(/<h3>(.*?)<\/h3>/);
            const title = titleMatch ? titleMatch[1] : 'Unknown location';
            
            // Extract description from popup content
            const descMatch = popup.match(/<p>(.*?)<\/p>/);
            const description = descMatch ? descMatch[1] : '';
            
            // Determine category based on marker presence in category arrays
            let category = 'unknown';
            for (const cat in markers) {
                if (cat === 'all') continue;
                if (markers[cat].includes(marker)) {
                    category = cat;
                    break;
                }
            }
            
            return {
                lat: latLng.lat,
                lng: latLng.lng,
                title,
                description,
                category
            };
        });
    }
    
    // Export current markers to GeoJSON format (useful for developers)
    window.exportMarkersToGeoJSON = function() {
        const geojson = {
            type: "FeatureCollection",
            features: markers.all.map(marker => {
                const latLng = marker.getLatLng();
                const popup = marker._popup._content;
                
                // Extract title from popup content
                const titleMatch = popup.match(/<h3>(.*?)<\/h3>/);
                const title = titleMatch ? titleMatch[1] : 'Unknown location';
                
                // Extract description from popup content
                const descMatch = popup.match(/<p>(.*?)<\/p>/);
                const description = descMatch ? descMatch[1] : '';
                
                // Determine category based on marker presence in category arrays
                let category = 'unknown';
                for (const cat in markers) {
                    if (cat === 'all') continue;
                    if (markers[cat].includes(marker)) {
                        category = cat;
                        break;
                    }
                }
                
                return {
                    type: "Feature",
                    properties: {
                        title: title,
                        description: description,
                        category: category
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [latLng.lng, latLng.lat]
                    }
                };
            })
        };
        
        console.log(JSON.stringify(geojson, null, 2));
        return geojson;
    };
    
    // Check connectivity on load
    checkConnectivity();
    
    // Add event listeners for online/offline events
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);
});