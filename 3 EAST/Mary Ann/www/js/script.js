// Initialize variables
    let map;
    let markers = [];
    let activeLocationFilter = 'all';
    let searchTerm = '';

    // Sample salon data for Bantayan Island (Madridejos, Bantayan, Santa Fe)
    const salons = [
        {
            id: 1,
            name: "Glamour Hair Salon",
            address: "National Highway, Poblacion, Madridejos",
            hours: "9:00 AM - 7:00 PM",
            category: "Hair Salon",
            location: "madridejos",
            coordinates: [11.272, 123.724],
            services: [
                "Haircuts", 
                "Color Treatment", 
                "Perm", 
                "Highlights", 
                "Hair Styling"
            ],
            priceRange: "₱300 - ₱1,500"
        },
        {
            id: 2,
            name: "Beauty Hub",
            address: "Langub Street, Madridejos",
            hours: "8:00 AM - 6:00 PM",
            category: "Spa & Salon",
            location: "madridejos",
            coordinates: [11.269, 123.726],
            services: [
                "Facial Massage", 
                "Body Massage", 
                "Nail Care", 
                "Waxing", 
                "Hair Treatments"
            ],
            priceRange: "₱500 - ₱2,000"
        },
        {
            id: 3,
            name: "Bantayan Style Center",
            address: "Main Street, Poblacion, Bantayan",
            hours: "8:30 AM - 8:00 PM",
            category: "Hair Salon",
            location: "bantayan",
            coordinates: [11.219, 123.738],
            services: [
                "Men's Haircuts", 
                "Women's Haircuts", 
                "Beard Trimming", 
                "Hair Coloring", 
                "Keratin Treatment"
            ],
            priceRange: "₱250 - ₱1,200"
        },
        {
            id: 4,
            name: "Fresh Look Salon",
            address: "Market Area, Bantayan",
            hours: "9:00 AM - 7:30 PM",
            category: "Hair & Nail Salon",
            location: "bantayan",
            coordinates: [11.222, 123.740],
            services: [
                "Manicure", 
                "Pedicure", 
                "Nail Art", 
                "Gel Nails", 
                "Hair Styling"
            ],
            priceRange: "₱200 - ₱800"
        },
        {
            id: 5,
            name: "Beachside Beauty Salon",
            address: "Sta. Fe Beach Front",
            hours: "10:00 AM - 8:00 PM",
            category: "Spa & Salon",
            location: "sta-fe",
            coordinates: [11.162, 123.785],
            services: [
                "Facial", 
                "Body Scrub", 
                "Massage", 
                "Aromatherapy", 
                "Skin Treatments"
            ],
            priceRange: "₱600 - ₱2,500"
        },
        {
            id: 6,
            name: "Island Glow Salon",
            address: "National Highway, Sta. Fe",
            hours: "9:00 AM - 6:00 PM",
            category: "Hair & Makeup",
            location: "sta-fe",
            coordinates: [11.158, 123.781],
            services: [
                "Makeup Application", 
                "Bridal Makeup", 
                "Hairstyling", 
                "Hair Extensions", 
                "Eyebrow Shaping"
            ],
            priceRange: "₱400 - ₱1,800"
        },
        {
            id: 7,
            name: "Cuts & Curls",
            address: "Maricaban, Sta. Fe",
            hours: "8:00 AM - 7:00 PM",
            category: "Hair Salon",
            location: "sta-fe",
            coordinates: [11.155, 123.778],
            services: [
                "Perm", 
                "Hair Coloring", 
                "Balayage", 
                "Hair Treatments", 
                "Styling"
            ],
            priceRange: "₱350 - ₱1,600"
        },
        {
            id: 8,
            name: "Bantayan Beauty Lounge",
            address: "Suba Port Area, Bantayan",
            hours: "9:00 AM - 7:00 PM",
            category: "Full Service Salon",
            location: "bantayan",
            coordinates: [11.200, 123.744],
            services: [
                "Full Body Massage", 
                "Facial", 
                "Waxing", 
                "Nail Services", 
                "Hair Styling"
            ],
            priceRange: "₱500 - ₱2,200"
        },
        {
            id: 9,
            name: "Madri Hair Studio",
            address: "Malbago, Madridejos",
            hours: "8:30 AM - 6:30 PM",
            category: "Hair Salon",
            location: "madridejos",
            coordinates: [11.278, 123.721],
            services: [
                "Hair Cutting", 
                "Styling", 
                "Color Correction", 
                "Scalp Treatments", 
                "Men's Grooming"
            ],
            priceRange: "₱300 - ₱1,400"
        },
        {
            id: 10,
            name: "Oceanview Spa & Salon",
            address: "Tourist Road, Sta. Fe",
            hours: "10:00 AM - 9:00 PM",
            category: "Spa & Salon",
            location: "sta-fe",
            coordinates: [11.165, 123.790],
            services: [
                "Swedish Massage", 
                "Hot Stone Massage", 
                "Facial", 
                "Body Wrap", 
                "Reflexology"
            ],
            priceRange: "₱700 - ₱2,800"
        }
    ];

    // Initialize the application when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initMap();
        initEventListeners();
        renderSalonList(salons);
    });

    // Initialize Leaflet map
    function initMap() {
        // Center map on Bantayan Island - roughly in the middle of the three locations
        map = L.map('map', {
            attributionControl: false,  // Completely remove attribution control
            zoomControl: true
        }).setView([11.220, 123.750], 11);
        
        // Add OpenStreetMap tile layer with no attribution
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);
        
        // Add salon markers to the map
        addMarkersToMap();
        
        // Add CSS to hide any remaining Leaflet logos or attributions
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-control-attribution {
                display: none !important;
            }
            .leaflet-bottom.leaflet-right {
                display: none !important;
            }
            .custom-popup .popup-services {
                margin-top: 10px;
                border-top: 1px solid #eee;
                padding-top: 10px;
            }
            .custom-popup .service-list {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .custom-popup .service-tag {
                background-color: #f0f0f0;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8em;
            }
        `;
        document.head.appendChild(style);
    }

    // Add all salon markers to the map
    function addMarkersToMap() {
        // Clear existing markers first
        clearMarkers();
        
        // Filter salons based on current filters
        const filteredSalons = filterSalons();
        
        // Add markers for filtered salons
        filteredSalons.forEach(salon => {
            const marker = L.marker(salon.coordinates)
                .addTo(map)
                .bindPopup(createPopupContent(salon), { 
                    className: 'custom-popup',
                    closeButton: true,
                    maxWidth: 350
                });
            
            markers.push(marker);
        });
        
        // If we have filtered results, fit the map to show all markers
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Create popup content for a salon marker
    function createPopupContent(salon) {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${salon.coordinates[0]},${salon.coordinates[1]}`;
        return `
            <div class="popup-title">${salon.name}</div>
            <div class="popup-content">
                <div>${salon.address}</div>
                <div>${salon.hours}</div>
                <div>${salon.category}</div>
                <div>${salon.priceRange}</div>
                <div class="popup-services">
                    <strong>Services:</strong>
                    <div class="service-list">
                        ${salon.services.map(service => 
                            `<span class="service-tag">${service}</span>`
                        ).join('')}
                    </div>
                </div>
                <a href="${googleMapsUrl}" target="_blank" class="google-maps-btn">View in Google Maps</a>
            </div>
        `;
    }

    // Clear all markers from the map
    function clearMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }

    // Initialize event listeners
    function initEventListeners() {
        // Search input
        document.getElementById('search-input').addEventListener('input', e => {
            searchTerm = e.target.value.toLowerCase();
            renderSalonList(filterSalons());
        });
        
        // Location filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set active filter
                activeLocationFilter = btn.dataset.location;
                
                // Update salon list and map
                const filteredSalons = filterSalons();
                renderSalonList(filteredSalons);
                addMarkersToMap();
            });
        });
        
        // Show map button
        document.getElementById('show-map-btn').addEventListener('click', () => {
            // Smooth scroll to map
            document.querySelector('.map-container').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Invalidate map size to fix any rendering issues
            map.invalidateSize();
            
            // Fit bounds to show all visible markers
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        });
        
        // Clear filters button
        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            // Reset search
            document.getElementById('search-input').value = '';
            searchTerm = '';
            
            // Reset location filter
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-location="all"]').classList.add('active');
            activeLocationFilter = 'all';
            
            // Update salon list and map
            renderSalonList(salons);
            addMarkersToMap();
        });
    }

    // Filter salons based on search term and location filter
    function filterSalons() {
        return salons.filter(salon => {
            // Filter by location
            const locationMatch = activeLocationFilter === 'all' || salon.location === activeLocationFilter;
            
            // Filter by search term
            const searchMatch = searchTerm === '' || 
                salon.name.toLowerCase().includes(searchTerm) || 
                salon.address.toLowerCase().includes(searchTerm) || 
                salon.category.toLowerCase().includes(searchTerm) ||
                salon.services.some(service => 
                    service.toLowerCase().includes(searchTerm)
                );
            
            return locationMatch && searchMatch;
        });
    }

    // Render salon list in the UI
    function renderSalonList(salons) {
        const salonListElement = document.getElementById('salon-list');
        salonListElement.innerHTML = '';
        
        if (salons.length === 0) {
            salonListElement.innerHTML = `
                <div class="no-results">
                    <p>No salons found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        salons.forEach(salon => {
            const salonElement = document.createElement('div');
            salonElement.className = 'salon-item';
            salonElement.innerHTML = `
                <div class="salon-name">${salon.name}</div>
                <div class="salon-address">${salon.address}</div>
                <div class="salon-details">
                    <div class="salon-hours">
                        <span>⏰</span> ${salon.hours}
                    </div>
                    <div class="salon-location">
                        ${formatLocation(salon.location)}
                    </div>
                    <div class="salon-services">
                        <strong>Services:</strong> ${salon.services.join(', ')}
                    </div>
                    <div class="salon-price">
                        Price Range: ${salon.priceRange}
                    </div>
                </div>
            `;
            
            // Click event to show salon on map
            salonElement.addEventListener('click', () => {
                // Find the corresponding marker
                const marker = markers.find(m => 
                    m.getLatLng().lat === salon.coordinates[0] && 
                    m.getLatLng().lng === salon.coordinates[1]
                );
                
                if (marker) {
                    // Zoom to marker and open popup
                    map.setView(marker.getLatLng(), 15);
                    marker.openPopup();
                    
                    // Scroll to map
                    document.querySelector('.map-container').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
            
            salonListElement.appendChild(salonElement);
        });
    }

    // Format location name for display
    function formatLocation(location) {
        switch(location) {
            case 'madridejos':
                return 'Madridejos';
            case 'bantayan':
                return 'Bantayan';
            case 'sta-fe':
                return 'Sta. Fe';
            default:
                return location;
        }
    }