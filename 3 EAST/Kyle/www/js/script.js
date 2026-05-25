// Initialize variables
let map;
let markers = [];
let activeLocationFilter = 'all';
let searchTerm = '';

// Sample mobile gadget repair shop data for Bantayan Island (Madridejos, Bantayan, Santa Fe)
const repairShops = [
    {
        id: 1,
        name: "iFixit Mobile Shop",
        address: "Poblacion Road, Near Public Market, Madridejos",
        hours: "8:00 AM - 6:00 PM",
        category: "Smartphone & Tablet Repair",
        location: "madridejos",
        coordinates: [11.2724, 123.7245],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.8,
        reviews: 45,
        contact: "0912-345-6789",
        description: "Specialized in iPhone and Samsung repairs. Quick turnaround time."
    },
    {
        id: 2,
        name: "Madridejos Phone Fix",
        address: "National Highway, Bunakan, Madridejos",
        hours: "8:30 AM - 5:30 PM",
        category: "Phone & Laptop Repair",
        location: "madridejos",
        coordinates: [11.2690, 123.7263],
        services: ["screen-repair", "battery-replacement", "software-issues"],
        rating: 4.5,
        reviews: 32,
        contact: "0923-456-7890",
        description: "Expert in laptop motherboard repairs and phone screen replacements."
    },
    {
        id: 3,
        name: "Bantayan Tech Solutions",
        address: "Poblacion, Near Municipal Hall, Bantayan",
        hours: "9:00 AM - 6:30 PM",
        category: "Smartphone & Tablet Repair",
        location: "bantayan",
        coordinates: [11.2193, 123.7385],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.7,
        reviews: 38,
        contact: "0934-567-8901",
        description: "Complete gadget repair services with warranty on parts."
    },
    {
        id: 4,
        name: "Island Cell Phone Repair",
        address: "Suba Public Market Area, Bantayan",
        hours: "8:00 AM - 7:00 PM",
        category: "Mobile & Accessories Repair",
        location: "bantayan",
        coordinates: [11.2040, 123.7435],
        services: ["screen-repair", "battery-replacement", "software-issues"],
        rating: 4.3,
        reviews: 27,
        contact: "0945-678-9012",
        description: "Specialized in mobile phone repairs and accessories."
    },
    {
        id: 5,
        name: "Sta. Fe Mobile Center",
        address: "Santa Fe Port Area, Talisay",
        hours: "8:30 AM - 6:00 PM",
        category: "Smartphone & Computer Repair",
        location: "sta-fe",
        coordinates: [11.1618, 123.7853],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.6,
        reviews: 41,
        contact: "0956-789-0123",
        description: "Full-service repair center for phones and computers."
    },
    {
        id: 6,
        name: "Tourist Tech Repair",
        address: "National Highway, Near Sta. Fe Public Market",
        hours: "8:00 AM - 7:00 PM",
        category: "Phone & Camera Repair",
        location: "sta-fe",
        coordinates: [11.1580, 123.7810],
        services: ["screen-repair", "battery-replacement", "software-issues"],
        rating: 4.4,
        reviews: 29,
        contact: "0967-890-1234",
        description: "Specialized in camera and phone repairs for tourists."
    },
    {
        id: 7,
        name: "Gadget Doctors",
        address: "Maricaban Road, Sta. Fe",
        hours: "9:00 AM - 5:00 PM",
        category: "Smartphone & Tablet Repair",
        location: "sta-fe",
        coordinates: [11.1555, 123.7780],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.9,
        reviews: 52,
        contact: "0978-901-2345",
        description: "Expert technicians for all types of gadget repairs."
    },
    {
        id: 8,
        name: "Bantayan Digital Repair",
        address: "Binangonan Road, Near Suba Port, Bantayan",
        hours: "8:00 AM - 5:30 PM",
        category: "Smartphone & Smartwatch Repair",
        location: "bantayan",
        coordinates: [11.2005, 123.7440],
        services: ["screen-repair", "battery-replacement", "software-issues"],
        rating: 4.7,
        reviews: 36,
        contact: "0989-012-3456",
        description: "Specialized in smartwatch and smartphone repairs."
    },
    {
        id: 9,
        name: "North Mobile Solutions",
        address: "Malbago Junction, Madridejos",
        hours: "8:30 AM - 6:00 PM",
        category: "Phone & Laptop Repair",
        location: "madridejos",
        coordinates: [11.2780, 123.7210],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.5,
        reviews: 33,
        contact: "0990-123-4567",
        description: "Complete mobile and laptop repair services."
    },
    {
        id: 10,
        name: "Sta. Fe iDoctor",
        address: "Tourist Beach Road, Near Sugar Beach Resort",
        hours: "9:00 AM - 7:00 PM",
        category: "All Mobile Gadget Repair",
        location: "sta-fe",
        coordinates: [11.1650, 123.7900],
        services: ["screen-repair", "battery-replacement", "water-damage", "software-issues"],
        rating: 4.8,
        reviews: 48,
        contact: "0911-234-5678",
        description: "24/7 emergency repair services for tourists."
    }
];

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initEventListeners();
    renderShopList(repairShops);
    
    // Change page title to reflect mobile gadget focus
    document.title = "Bantayan Island Mobile Gadget Repair Locator";
});

// Initialize Leaflet map
function initMap() {
    // Center map on Bantayan Island - roughly in the middle of the three locations
    map = L.map('map', {
        attributionControl: true,  // Keep attribution control but we'll hide it with CSS
        zoomControl: true
    }).setView([11.220, 123.750], 11);
    
    // Add OpenStreetMap tile layer with regular attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
    
    // Add repair shop markers to the map
    addMarkersToMap();
    
    // Add CSS to hide Leaflet logos or attributions while keeping them in the DOM
    const style = document.createElement('style');
    style.textContent = `
        /* Hide attribution but keep it in the DOM */
        .leaflet-control-attribution {
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            pointer-events: none !important;
        }
        
        /* Hide the container corners but keep them in the DOM */
        .leaflet-bottom.leaflet-right, 
        .leaflet-bottom.leaflet-left {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Keep proper spacing for controls */
        .leaflet-control-container .leaflet-control {
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Add all repair shop markers to the map
function addMarkersToMap() {
    // Clear existing markers first
    clearMarkers();
    
    // Filter shops based on current filters
    const filteredShops = filterShops();
    
    // Add markers for filtered shops
    filteredShops.forEach(shop => {
        const marker = L.marker(shop.coordinates)
            .addTo(map)
            .bindPopup(createPopupContent(shop), { 
                className: 'custom-popup',
                closeButton: true,
                maxWidth: 300
            });
        
        markers.push(marker);
    });
    
    // If we have filtered results, fit the map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Create popup content for a repair shop marker
function createPopupContent(shop) {
    return `
        <div class="popup-title">${shop.name}</div>
        <div class="popup-content">
            <div class="popup-rating">⭐ ${shop.rating} (${shop.reviews} reviews)</div>
            <div class="popup-address">📍 ${shop.address}</div>
            <div class="popup-hours">⏰ ${shop.hours}</div>
            <div class="popup-category">🔧 ${shop.category}</div>
            <div class="popup-contact">📞 ${shop.contact}</div>
            <div class="popup-description">${shop.description}</div>
            <div class="popup-services">
                <strong>Services:</strong>
                <ul>
                    ${shop.services.map(service => `<li>${formatServiceName(service)}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Format service name for display
function formatServiceName(service) {
    return service.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Initialize event listeners
function initEventListeners() {
    // Location filter
    document.getElementById('location').addEventListener('change', (e) => {
        activeLocationFilter = e.target.value;
        updateResults();
    });

    // Device type filter
    document.getElementById('device-type').addEventListener('change', (e) => {
        const deviceType = e.target.value;
        updateResults();
    });

    // Service type checkboxes
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateResults();
        });
    });

    // Rating filter
    document.getElementById('rating').addEventListener('change', (e) => {
        const minRating = parseFloat(e.target.value);
        updateResults();
    });

    // Search button
    document.getElementById('search-button').addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchTerm = searchInput.value.toLowerCase().trim();
        }
        updateResults();
    });

    // Modal close button
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('shop-modal').style.display = 'none';
    });
}

// Update results based on all filters
function updateResults() {
    const filteredShops = filterShops();
    renderShopList(filteredShops);
    addMarkersToMap();
}

// Filter shops based on all criteria
function filterShops() {
    const locationFilter = document.getElementById('location').value;
    const deviceType = document.getElementById('device-type').value;
    const minRating = parseFloat(document.getElementById('rating').value);
    
    // Get selected service types
    const selectedServices = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    return repairShops.filter(shop => {
        // Location filter
        if (locationFilter !== 'all' && shop.location !== locationFilter) {
            return false;
        }

        // Device type filter
        if (deviceType !== 'all' && !shop.category.toLowerCase().includes(deviceType.toLowerCase())) {
            return false;
        }

        // Search term filter
        if (searchTerm) {
            const searchableText = `${shop.name} ${shop.address} ${shop.category} ${shop.description}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        // Service type filter
        if (selectedServices.length > 0) {
            return selectedServices.every(service => shop.services.includes(service));
        }

        // Rating filter
        if (minRating > 0 && shop.rating < minRating) {
            return false;
        }

        return true;
    });
}

// Render repair shop list in the UI
function renderShopList(shops) {
    const shopListElement = document.getElementById('shops');
    shopListElement.innerHTML = '';
    
    if (shops.length === 0) {
        shopListElement.innerHTML = `
            <div class="no-results">
                <p>No repair shops found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    shops.forEach(shop => {
        const shopElement = document.createElement('div');
        shopElement.className = 'shop-item';
        shopElement.innerHTML = `
            <div class="shop-header">
                <div class="shop-name">${shop.name}</div>
                <div class="shop-rating">⭐ ${shop.rating} (${shop.reviews})</div>
            </div>
            <div class="shop-address">📍 ${shop.address}</div>
            <div class="shop-details">
                <div class="shop-hours">⏰ ${shop.hours}</div>
                <div class="shop-location">🏠 ${formatLocation(shop.location)}</div>
            </div>
            <div class="shop-services">
                <strong>Services:</strong>
                ${shop.services.map(service => `<span class="service-tag">${formatServiceName(service)}</span>`).join('')}
            </div>
            <div class="shop-contact">📞 ${shop.contact}</div>
            <div class="shop-description">${shop.description}</div>
        `;
        
        // Click event to show shop on map
        shopElement.addEventListener('click', () => {
            // Find the corresponding marker
            const marker = markers.find(m => 
                m.getLatLng().lat === shop.coordinates[0] && 
                m.getLatLng().lng === shop.coordinates[1]
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
        
        shopListElement.appendChild(shopElement);
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