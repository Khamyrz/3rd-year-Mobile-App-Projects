// Sample pizza branches (replace with real data or fetch from API)
const branches = [
    {
      name: "Alberto's Pizza - Bantayan",
      lat: 11.1532, // Bantayan town proper
      lng: 123.7226,
      hours: "10:00 AM - 10:00 PM",
      contact: "0917-123-4567",
      services: "Dine-in, Takeout, Delivery",
      reviews: "4.5/5 (120 reviews)",
      products: [
        { name: "Pepperoni Pizza", price: "₱250" },
        { name: "Hawaiian Pizza", price: "₱230" },
        { name: "Cheese Pizza", price: "₱200" }
      ]
    },
    {
      name: "Island Slice Pizza",
      lat: 11.1600, // Barangay Suba, Bantayan
      lng: 123.7300,
      hours: "11:00 AM - 9:00 PM",
      contact: "0917-222-3344",
      services: "Dine-in, Takeout",
      reviews: "4.3/5 (80 reviews)",
      products: [
        { name: "Island Special", price: "₱210" },
        { name: "Seafood Pizza", price: "₱250" },
        { name: "Classic Margherita", price: "₱200" }
      ]
    },
    {
      name: "Bantayan Pizza House",
      lat: 11.1480, // Barangay Kabac, Bantayan
      lng: 123.7205,
      hours: "10:30 AM - 10:00 PM",
      contact: "0917-333-4455",
      services: "Dine-in, Delivery",
      reviews: "4.4/5 (95 reviews)",
      products: [
        { name: "Bantayan Supreme", price: "₱260" },
        { name: "Veggie Delight", price: "₱220" },
        { name: "Ham & Pineapple", price: "₱230" }
      ]
    },
    {
      name: "Alberto's Pizza - Santa Fe",
      lat: 11.1346, // Santa Fe town
      lng: 123.8081,
      hours: "9:00 AM - 11:00 PM",
      contact: "0917-987-6543",
      services: "Dine-in, Takeout",
      reviews: "4.7/5 (98 reviews)",
      products: [
        { name: "BBQ Chicken Pizza", price: "₱260", image: "bbq-chicken-pizza" },
        { name: "Veggie Pizza", price: "₱220", image: "veggie-pizza" },
        { name: "Meat Lovers Pizza", price: "₱270", image: "meat-lovers-pizza" }
      ]
    },
    {
      name: "Santa Fe Pizza Corner",
      lat: 11.1405, // near Santa Fe Beach
      lng: 123.8060,
      hours: "10:00 AM - 10:00 PM",
      contact: "0917-444-5566",
      services: "Dine-in, Takeout, Delivery",
      reviews: "4.2/5 (60 reviews)",
      products: [
        { name: "Santa Fe Special", price: "₱240", image: "santa-fe-special" },
        { name: "Tuna Pizza", price: "₱210", image: "tuna-pizza" },
        { name: "Cheese Overload", price: "₱200", image: "cheese-overload" }
      ]
    },
    {
      name: "Pizza Amelia",
      lat: 11.2582, // Madridejos Plaza corner
      lng: 123.7145,
      hours: "9:00 AM - 10:00 PM",
      contact: "0917-888-4321",
      services: "Dine-in, Takeout, Delivery",
      reviews: "4.8/5 (95 reviews)",
      products: [
        { name: "Amelia's Special", price: "₱290" },
        { name: "Garlic Shrimp Pizza", price: "₱270" },
        { name: "Four Cheese", price: "₱250" }
      ]
    },
    {
      name: "Alberto's Pizza - Madridejos",
      lat: 11.2572, // Madridejos town
      lng: 123.7136,
      hours: "10:00 AM - 9:00 PM",
      contact: "0917-555-1234",
      services: "Dine-in, Delivery",
      reviews: "4.6/5 (110 reviews)",
      products: [
        { name: "Supreme Pizza", price: "₱280" },
        { name: "Tuna Pizza", price: "₱210" },
        { name: "Ham & Cheese Pizza", price: "₱220" }
      ]
    },
    {
      name: "Madridejos Pizza Hub", 
      lat: 11.2550, // Barangay Tarong, Madridejos
      lng: 123.7155,
      hours: "11:00 AM - 10:00 PM",
      contact: "0917-666-7788",
      services: "Dine-in, Takeout",
      reviews: "4.1/5 (50 reviews)",
      products: [
        { name: "Madridejos Classic", price: "₱230" },
        { name: "Seafood Delight", price: "₱250" },
        { name: "Pepperoni", price: "₱220" }
      ]
    },
    {
      name: "Pizza del Mar",
      lat: 11.1850, // central Bantayan, near Sillon
      lng: 123.7550,
      hours: "10:00 AM - 9:00 PM",
      contact: "0917-777-8888",
      services: "Dine-in, Takeout",
      reviews: "4.0/5 (40 reviews)",
      products: [
        { name: "Seafood Supreme", price: "₱270", image: "Seafood Supreme" },
        { name: "Anchovy Pizza", price: "₱220", image: "Anchovy Pizza" },
        { name: "Classic Cheese", price: "₱200", image: "Classic Cheese" }
      ]
    },
    {
      name: "Sunset Pizza Bar",
      lat: 11.1420, // near main road, Santa Fe
      lng: 123.8020,
      hours: "3:00 PM - 11:00 PM",
      contact: "0917-888-9999",
      services: "Dine-in, Bar",
      reviews: "4.3/5 (55 reviews)",
      products: [
        { name: "Sunset Special", price: "₱250", image: "Sunset Special" },
        { name: "BBQ Chicken", price: "₱240", image: "BBQ Chicken" },
        { name: "Veggie Delight", price: "₱210", image: "Veggie Delight" }
      ]
    },
    {
      name: "Harbor Pizza",
      lat: 11.2600, // near Madridejos port
      lng: 123.7100,
      hours: "11:00 AM - 10:00 PM",
      contact: "0917-999-0000",
      services: "Dine-in, Takeout, Delivery",
      reviews: "4.5/5 (70 reviews)",
      products: [
        { name: "Harbor Supreme", price: "₱260", image: "Harbor Supreme" },
        { name: "Tuna Delight", price: "₱230", image: "Tuna Delight" },
        { name: "Pepperoni", price: "₱220", image: "Pepperoni" }
      ]
    },
    {
      name: "Lighthouse Pizza",
      lat: 11.1700, // Barangay Baigad, near lighthouse
      lng: 123.7700,
      hours: "10:00 AM - 8:00 PM",
      contact: "0917-000-1111",
      services: "Takeout, Delivery",
      reviews: "4.2/5 (35 reviews)",
      products: [
        { name: "Lighthouse Special", price: "₱240", image: "lighthouse-special" },
        { name: "Ham & Cheese", price: "₱210", image: "ham-cheese" },
        { name: "Hawaiian", price: "₱220", image: "hawaiian" }
      ]
    }
  ];
  
  let map, userMarker, routeLayer;
  
  // Bantayan Island bounds (approximate)
  const bantayanBounds = L.latLngBounds(
    L.latLng(11.08, 123.67), // Southwest
    L.latLng(11.29, 123.83)  // Northeast
  );
  
  // Default center of Bantayan Island (fallback position)
  const defaultPosition = [11.18, 123.75];
  
  // Status message element
  function createStatusMessage() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'location-status';
    statusDiv.style.position = 'absolute';
    statusDiv.style.top = '10px';
    statusDiv.style.left = '50%';
    statusDiv.style.transform = 'translateX(-50%)';
    statusDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    statusDiv.style.padding = '8px 12px';
    statusDiv.style.borderRadius = '4px';
    statusDiv.style.zIndex = '1000';
    statusDiv.style.display = 'none';
    document.body.appendChild(statusDiv);
    return statusDiv;
  }
  
  // Initialize map
  function initMap() {
    // Create status message element
    const statusMessage = createStatusMessage();
    
    map = L.map('map', {
      zoomControl: true
    }).setView(defaultPosition, 12);
  
    // Hide Leaflet watermark/attribution
    setTimeout(() => {
      const attr = document.querySelector('.leaflet-control-attribution');
      if(attr) attr.style.display = 'none';
    }, 500);
  
    // Satellite tile layer (Esri)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);
    
    // Add all branch markers immediately (don't wait for location)
    addAllBranchMarkers();
    
    // Try to get user location with improved handling
    getUserLocation(statusMessage);
  }
  
  // Add all branch markers to the map
  function addAllBranchMarkers() {
    branches.forEach(branch => {
      const marker = L.marker([branch.lat, branch.lng]).addTo(map);
      marker.on('click', () => {
        // Show modal with pizza shop details
        window.showPizzaModal(branch);
        
        // If we have user location, show distance
        if (userMarker) {
          const userLatLng = userMarker.getLatLng();
          drawRoute([userLatLng.lat, userLatLng.lng], [branch.lat, branch.lng]);
        }
      });
    });
  }
  
  // Get user location with improved error handling for mobile
  function getUserLocation(statusMessage) {
    // Show requesting status
    statusMessage.textContent = "Requesting your location...";
    statusMessage.style.display = 'block';
    
    // High accuracy for mobile devices
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        position => {
          statusMessage.style.display = 'none';
          showPosition(position);
        },
        // Error callback
        error => {
          handleLocationError(error, statusMessage);
        },
        // Options
        options
      );
    } else {
      // Browser doesn't support Geolocation
      statusMessage.textContent = "Your browser doesn't support geolocation.";
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 3000);
      
      // Center on Bantayan Island instead
      map.setView(defaultPosition, 12);
    }
  }
  
  // Handle location errors better
  function handleLocationError(error, statusMessage) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        statusMessage.textContent = "Location permission denied. Please enable location services.";
        break;
      case error.POSITION_UNAVAILABLE:
        statusMessage.textContent = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        statusMessage.textContent = "Location request timed out.";
        break;
      case error.UNKNOWN_ERROR:
        statusMessage.textContent = "An unknown error occurred getting your location.";
        break;
    }
    
    // Hide message after a few seconds
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
    
    // Center on Bantayan Island as fallback
    map.setView(defaultPosition, 12);
  }
  
  function showPosition(position) {
    const userLatLng = [position.coords.latitude, position.coords.longitude];
    
    // If user is far from Bantayan Island, use default position instead
    if (!isNearBantayan(userLatLng)) {
      // For demonstration, we'll add the user marker but center on Bantayan
      // In a real app, you might want to check if they want to continue viewing Bantayan
      userMarker = L.marker(userLatLng, { 
        title: "You are here",
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      
      // Add popup to user marker
      userMarker.bindPopup("You are here (outside Bantayan Island)").openPopup();
      
      // Focus on Bantayan
      map.setView(defaultPosition, 12);
      return;
    }
    
    // User is near Bantayan, add user marker and focus on it
    if (userMarker) {
      // Update position if marker already exists
      userMarker.setLatLng(userLatLng);
    } else {
      // Create new marker
      userMarker = L.marker(userLatLng, { 
        title: "You are here",
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      
      // Add popup to user marker
      userMarker.bindPopup("You are here").openPopup();
    }
    
    // Set view to user location with zoom
    map.setView(userLatLng, 13);
    
    // Update branch info if any selected
    const activeInfo = document.getElementById('branch-info');
    if (activeInfo && !activeInfo.classList.contains('hidden')) {
      // Find which branch is being displayed
      const branchName = activeInfo.querySelector('h2').textContent;
      const branch = branches.find(b => b.name === branchName);
      if (branch) {
        showBranchInfo(branch);
        drawRoute(userLatLng, [branch.lat, branch.lng]);
      }
    }
  }
  
  // Check if user location is near Bantayan Island
  function isNearBantayan(userLatLng) {
    // Use the bounds we defined earlier
    return bantayanBounds.contains(L.latLng(userLatLng[0], userLatLng[1]));
  }
  
  function drawRoute(start, end) {
    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = L.polyline([start, end], { color: 'red', weight: 4 }).addTo(map);
    
    // Make sure both points are visible
    const bounds = L.latLngBounds([start, end]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  
  function calcDistance([lat1, lon1], [lat2, lon2]) {
    // Haversine formula
    const R = 6371; // km
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  // For continuous location tracking (useful for mobile)
  function startLocationTracking() {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        showPosition,
        error => handleLocationError(error, document.getElementById('location-status')),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      
      // Store watchId in localStorage to be able to clear it later if needed
      localStorage.setItem('locationWatchId', watchId);
    }
  }
  
  // Add event listeners after DOM is loaded
  window.onload = function() {
    initMap();
    
    // Start location tracking for mobile
    startLocationTracking();
    
    // Add refresh location button
    addLocationButton();
  };
  
  // Add custom location refresh button
  function addLocationButton() {
    const locationButton = document.createElement('div');
    locationButton.id = 'location-button';
    locationButton.innerHTML = '📍';
    locationButton.style.position = 'absolute';
    locationButton.style.bottom = '20px';
    locationButton.style.right = '20px';
    locationButton.style.backgroundColor = 'white';
    locationButton.style.padding = '10px';
    locationButton.style.borderRadius = '50%';
    locationButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    locationButton.style.zIndex = '1000';
    locationButton.style.cursor = 'pointer';
    locationButton.title = 'Find my location';
    
    locationButton.addEventListener('click', () => {
      const statusMessage = document.getElementById('location-status');
      getUserLocation(statusMessage);
    });
    
    document.body.appendChild(locationButton);
  }