// Wait for the device to be ready before bootstrapping the application
document.addEventListener('deviceready', onDeviceReady, false);

// Global app state
const app = {
    currentLocation: null,
    favorites: [],
    currentAdventure: null
};

// Initialize the application
function onDeviceReady() {
    console.log('Device is ready');
    
    // Load saved favorites from local storage
    loadFavorites();
    
    // Initialize UI components
    initNavigation();
    initSplashScreen();
    initSearch();
    initCategoryFilters();
    initDarkMode();
    
    // Request location permission and get current location
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        { enableHighAccuracy: true }
    );
    
    // Load initial adventure data
    loadAdventures();
}

// Hide splash screen after a delay
function initSplashScreen() {
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('hide');
    }, 2000);
}

// Initialize navigation between screens
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetScreen = item.getAttribute('data-target');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Update active screen
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(targetScreen).classList.add('active');
            
            // Special handling for screens
            if (targetScreen === 'nearby') {
                initMap();
            }
        });
    });
    
    // Handle back button on detail screen
    document.querySelector('.back-btn').addEventListener('click', () => {
        document.getElementById('adventure-detail').classList.remove('active');
        document.getElementById('explore').classList.add('active');
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Perform search on adventures
function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        loadAdventures();
        return;
    }
    
    const filteredAdventures = mockData.adventures.filter(adventure => 
        adventure.title.toLowerCase().includes(query) || 
        adventure.description.toLowerCase().includes(query) ||
        adventure.category.toLowerCase().includes(query)
    );
    
    renderAdventureList(filteredAdventures);
}

// Initialize category filters
function initCategoryFilters() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active category
            categoryItems.forEach(catItem => catItem.classList.remove('active'));
            item.classList.add('active');
            
            // Filter adventures
            const category = item.getAttribute('data-category');
            filterAdventuresByCategory(category);
        });
    });
}

// Filter adventures by category
function filterAdventuresByCategory(category) {
    if (category === 'all') {
        loadAdventures();
        return;
    }
    
    const filteredAdventures = mockData.adventures.filter(adventure => 
        adventure.category.toLowerCase() === category
    );
    
    renderAdventureList(filteredAdventures);
}

// Load adventures data and render in UI
function loadAdventures() {
    renderAdventureList(mockData.adventures);
}

// Render adventure cards in list
function renderAdventureList(adventures) {
    const adventureList = document.getElementById('adventure-list');
    adventureList.innerHTML = '';
    
    if (adventures.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-map-signs"></i>
            <p>No adventures found. Try a different search term or category.</p>
        `;
        adventureList.appendChild(emptyState);
        return;
    }
    
    const template = document.getElementById('adventure-card-template');
    
    adventures.forEach(adventure => {
        const adventureCard = document.importNode(template.content, true).querySelector('.adventure-card');
        
        // Set data attribute
        adventureCard.setAttribute('data-id', adventure.id);
        
        // Set image
        const image = adventureCard.querySelector('.card-image img');
        image.src = adventure.image;
        image.alt = adventure.title;
        
        // Set category
        adventureCard.querySelector('.card-category').textContent = adventure.category;
        
        // Set title
        adventureCard.querySelector('.card-title').textContent = adventure.title;
        
        // Set rating
        adventureCard.querySelector('.rating-value').textContent = adventure.rating;
        
        // Generate stars
        const ratingStars = adventureCard.querySelector('.rating-stars');
        ratingStars.innerHTML = generateStars(adventure.rating);
        
        // Set rating count
        adventureCard.querySelector('.rating-count').textContent = `(${adventure.reviewCount})`;
        
        // Set description
        adventureCard.querySelector('.card-description').textContent = adventure.description;
        
        // Set distance (if we have location data)
        if (app.currentLocation) {
            const distance = calculateDistance(
                app.currentLocation.latitude, 
                app.currentLocation.longitude,
                adventure.location.latitude,
                adventure.location.longitude
            );
            adventureCard.querySelector('.card-distance').textContent = `${distance.toFixed(1)} km away`;
        } else {
            adventureCard.querySelector('.card-distance').textContent = 'Distance unknown';
        }
        
        // Add click event
        adventureCard.addEventListener('click', () => {
            showAdventureDetail(adventure);
        });
        
        adventureList.appendChild(adventureCard);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Show adventure detail
function showAdventureDetail(adventure) {}
    app.currentAdventure = adventure;
    
    const detailScreen = document.getElementById('adventure-detail');
    const detailContent = detailScreen.querySelector('.detail-content');
    
    // Check if adventure is in favorites
    const isFavorite = app.favorites.some(fav => fav.id === adventure.id);
    const favoriteBtn = detailScreen.querySelector('.favorite-btn');
    favoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    
    // Add event listener to favorite button
    favoriteBtn.onclick = function() {
        toggleFavorite(adventure);
        this.innerHTML = app.favorites.some(fav => fav.id === adventure.id) 
            ? '<i class="fas fa-heart"></i>' 
            : '<i class="far fa-heart"></i>';
    };
    
    // Create detail HTML
    detailContent.innerHTML = `
        <img src="${adventure.image}" alt="${adventure.title}" class="detail-image">
        <div class="detail-info">
            <h2 class="detail-title">${adventure.title}</h2>
            <div class="detail-meta">
                <div class="detail-category">${adventure.category}</div>
                <div class="detail-rating">
                    ${generateStars(adventure.rating)} (${adventure.reviewCount})
                </div>
            </div>
            <div class="detail-address">
                <i class="fas fa-map-marker-alt"></i> ${adventure.address}
            </div>
            <p class="detail-description">${adventure.fullDescription || adventure.description}</p>
            
            <div class="detail-actions">
                <button class="action-btn">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <button class="action-btn secondary">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
            
            <div class="review-section">
                <h3>Reviews</h3>
                ${adventure.reviews ? renderReviews(adventure.reviews) : '<p>No reviews yet.</p>'}
            </div>
        </div>
    `;
    
    // Show detail screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    detailScreen.classList.add('active');
    
    // Attach event listeners
    detailContent.querySelector('.action-btn').addEventListener('click', () => {
        openMaps(adventure.location.latitude, adventure.location.longitude, adventure.title);
    });
    
    detailContent.querySelector('.action-btn.secondary').addEventListenerdocument.addEventListener('deviceready', onDeviceReady, false);

    // Global app state
    const app = {
        currentLocation: null,
        favorites: [],
        currentAdventure: null
    };
    
    // Initialize the application
    function onDeviceReady() {
        console.log('Device is ready');
        
        // Load saved favorites from local storage
        loadFavorites();
        
        // Initialize UI components
        initNavigation();
        initSplashScreen();
        initSearch();
        initCategoryFilters();
        initDarkMode();
        
        // Request location permission and get current location
        navigator.geolocation.getCurrentPosition(
            onLocationSuccess,
            onLocationError,
            { enableHighAccuracy: true }
        );
        
        // Load initial adventure data
        loadAdventures();
    }
    
    // Hide splash screen after a delay
    function initSplashScreen() {
        setTimeout(() => {
            const splashScreen = document.getElementById('splash-screen');
            splashScreen.classList.add('hide');
        }, 2000);
    }
    
    // Initialize navigation between screens
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetScreen = item.getAttribute('data-target');
                
                // Update active nav item
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                // Update active screen
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                document.getElementById(targetScreen).classList.add('active');
                
                // Special handling for screens
                if (targetScreen === 'nearby') {
                    initMap();
                }
            });
        });
        
        // Handle back button on detail screen
        document.querySelector('.back-btn').addEventListener('click', () => {
            document.getElementById('adventure-detail').classList.remove('active');
            document.getElementById('explore').classList.add('active');
        });
    }
    
    // Initialize search functionality
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Perform search on adventures
    function performSearch(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            loadAdventures();
            return;
        }
        
        const filteredAdventures = mockData.adventures.filter(adventure => 
            adventure.title.toLowerCase().includes(query) || 
            adventure.description.toLowerCase().includes(query) ||
            adventure.category.toLowerCase().includes(query)
        );
        
        renderAdventureList(filteredAdventures);
    }
    
    // Initialize category filters
    function initCategoryFilters() {
        const categoryItems = document.querySelectorAll('.category-item');
        
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active category
                categoryItems.forEach(catItem => catItem.classList.remove('active'));
                item.classList.add('active');
                
                // Filter adventures
                const category = item.getAttribute('data-category');
                filterAdventuresByCategory(category);
            });
        });
    }
    
    // Filter adventures by category
    function filterAdventuresByCategory(category) {
        if (category === 'all') {
            loadAdventures();
            return;
        }
        
        const filteredAdventures = mockData.adventures.filter(adventure => 
            adventure.category.toLowerCase() === category
        );
        
        renderAdventureList(filteredAdventures);
    }
    
    // Load adventures data and render in UI
    function loadAdventures() {
        renderAdventureList(mockData.adventures);
    }
    
    // Render adventure cards in list
    function renderAdventureList(adventures) {
        const adventureList = document.getElementById('adventure-list');
        adventureList.innerHTML = '';
        
        if (adventures.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-map-signs"></i>
                <p>No adventures found. Try a different search term or category.</p>
            `;
            adventureList.appendChild(emptyState);
            return;
        }
        
        const template = document.getElementById('adventure-card-template');
        
        adventures.forEach(adventure => {
            const adventureCard = document.importNode(template.content, true).querySelector('.adventure-card');
            
            // Set data attribute
            adventureCard.setAttribute('data-id', adventure.id);
            
            // Set image
            const image = adventureCard.querySelector('.card-image img');
            image.src = adventure.image;
            image.alt = adventure.title;
            
            // Set category
            adventureCard.querySelector('.card-category').textContent = adventure.category;
            
            // Set title
            adventureCard.querySelector('.card-title').textContent = adventure.title;
            
            // Set rating
            adventureCard.querySelector('.rating-value').textContent = adventure.rating;
            
            // Generate stars
            const ratingStars = adventureCard.querySelector('.rating-stars');
            ratingStars.innerHTML = generateStars(adventure.rating);
            
            // Set rating count
            adventureCard.querySelector('.rating-count').textContent = `(${adventure.reviewCount})`;
            
            // Set description
            adventureCard.querySelector('.card-description').textContent = adventure.description;
            
            // Set distance (if we have location data)
            if (app.currentLocation) {
                const distance = calculateDistance(
                    app.currentLocation.latitude, 
                    app.currentLocation.longitude,
                    adventure.location.latitude,
                    adventure.location.longitude
                );
                adventureCard.querySelector('.card-distance').textContent = `${distance.toFixed(1)} km away`;
            } else {
                adventureCard.querySelector('.card-distance').textContent = 'Distance unknown';
            }
            
            // Add click event
            adventureCard.addEventListener('click', () => {
                showAdventureDetail(adventure);
            });
            
            adventureList.appendChild(adventureCard);
        });
    }
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Show adventure detail
    function showAdventureDetail(adventure) {
        app.currentAdventure = adventure;
        
        const detailScreen = document.getElementById('adventure-detail');
        const detailContent = detailScreen.querySelector('.detail-content');
        
        // Check if adventure is in favorites
        const isFavorite = app.favorites.some(fav => fav.id === adventure.id);
        const favoriteBtn = detailScreen.querySelector('.favorite-btn');
        favoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        
        // Add event listener to favorite button
        favoriteBtn.onclick = function() {
            toggleFavorite(adventure);
            this.innerHTML = app.favorites.some(fav => fav.id === adventure.id) 
                ? '<i class="fas fa-heart"></i>' 
                : '<i class="far fa-heart"></i>';
        };
        
        // Create detail HTML
        detailContent.innerHTML = `
            <img src="${adventure.image}" alt="${adventure.title}" class="detail-image">
            <div class="detail-info">
                <h2 class="detail-title">${adventure.title}</h2>
                <div class="detail-meta">
                    <div class="detail-category">${adventure.category}</div>
                    <div class="detail-rating">
                        ${generateStars(adventure.rating)} (${adventure.reviewCount})
                    </div>
                </div>
                <div class="detail-address">
                    <i class="fas fa-map-marker-alt"></i> ${adventure.address}
                </div>
                <p class="detail-description">${adventure.fullDescription || adventure.description}</p>
                
                <div class="detail-actions">
                    <button class="action-btn">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                    <button class="action-btn secondary">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
                
                <div class="review-section">
                    <h3>Reviews</h3>
                    ${adventure.reviews ? renderReviews(adventure.reviews) : '<p>No reviews yet.</p>'}
                </div>
            </div>
        `;
        
        // Show detail screen
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        detailScreen.classList.add('active');
        
        // Attach event listeners
        detailContent.querySelector('.action-btn').addEventListener('click', () => {
            openMaps(adventure.location.latitude, adventure.location.longitude, adventure.title);
        });
        
        detailContent.querySelector('.action-btn.secondary').addEventListener('click', () => {
            shareAdventure(adventure);
        });
    }
    
    // Render reviews HTML
    function renderReviews(reviews) {
        if (!reviews || reviews.length === 0) {
            return '<p>No reviews yet.</p>';
        }
        
        let html = '';
        reviews.forEach(review => {
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">${generateStars(review.rating)}</div>
                    <p class="review-text">${review.text}</p>
                </div>
            `;
        });
        
        return html;
    }
    
    // Toggle favorite status for an adventure
    function toggleFavorite(adventure) {
        const index = app.favorites.findIndex(fav => fav.id === adventure.id);
        
        if (index === -1) {
            // Add to favorites
            app.favorites.push(adventure);
        } else {
            // Remove from favorites
            app.favorites.splice(index, 1);
        }
        
        // Save to local storage
        saveFavorites();
        
        // Update UI if on favorites screen
        if (document.getElementById('favorites').classList.contains('active')) {
            renderFavorites();
        }
    }
    
    // Save favorites to local storage
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(app.favorites));
    }
    
    // Load favorites from local storage
    function loadFavorites() {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            app.favorites = JSON.parse(savedFavorites);
            renderFavorites();
        }
    }
    
    // Render favorites
    function renderFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        
        if (app.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>You haven't added any favorites yet</p>
                </div>
            `;
            return;
        }
        
        favoritesList.innerHTML = '';
        
        const template = document.getElementById('adventure-card-template');
        
        app.favorites.forEach(adventure => {
            const adventureCard = document.importNode(template.content, true).querySelector('.adventure-card');
            
            // Set data attribute
            adventureCard.setAttribute('data-id', adventure.id);
            
            // Set image
            const image = adventureCard.querySelector('.card-image img');
            image.src = adventure.image;
            image.alt = adventure.title;
            
            // Set category
            adventureCard.querySelector('.card-category').textContent = adventure.category;
            
            // Set title
            adventureCard.querySelector('.card-title').textContent = adventure.title;
            
            // Set rating
            adventureCard.querySelector('.rating-value').textContent = adventure.rating;
            
            // Generate stars
            const ratingStars = adventureCard.querySelector('.rating-stars');
            ratingStars.innerHTML = generateStars(adventure.rating);
            
            // Set rating count
            adventureCard.querySelector('.rating-count').textContent = `(${adventure.reviewCount})`;
            
            // Set description
            adventureCard.querySelector('.card-description').textContent = adventure.description;
            
            // Set distance (if we have location data)
            if (app.currentLocation) {
                const distance = calculateDistance(
                    app.currentLocation.latitude, 
                    app.currentLocation.longitude,
                    adventure.location.latitude,
                    adventure.location.longitude
                );
                adventureCard.querySelector('.card-distance').textContent = `${distance.toFixed(1)} km away`;
            } else {
                adventureCard.querySelector('.card-distance').textContent = 'Distance unknown';
            }
            
            // Add click event
            adventureCard.addEventListener('click', () => {
                showAdventureDetail(adventure);
            });
            
            favoritesList.appendChild(adventureCard);
        });
    }
    
    // Handle successful location retrieval
    function onLocationSuccess(position) {
        app.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        
        // Update adventure distances
        updateAdventureDistances();
        
        // Initialize map if on nearby screen
        if (document.getElementById('nearby').classList.contains('active')) {
            initMap();
        }
    }
    
    // Handle location retrieval error
    function onLocationError(error) {
        console.error('Error getting location', error);
        
        // Show error message to user
        navigator.notification.alert(
            'We could not get your current location. Some features will have limited functionality.',
            null,
            'Location Error',
            'OK'
        );
    }
    
    // Update adventure distances based on current location
    function updateAdventureDistances() {
        if (!app.currentLocation) return;
        
        // Update distances in adventure list
        document.querySelectorAll('.adventure-card').forEach(card => {
            const adventureId = card.getAttribute('data-id');
            const adventure = mockData.adventures.find(a => a.id === adventureId);
            
            if (adventure) {
                const distance = calculateDistance(
                    app.currentLocation.latitude,
                    app.currentLocation.longitude,
                    adventure.location.latitude,
                    adventure.location.longitude
                );
                
                card.querySelector('.card-distance').textContent = `${distance.toFixed(1)} km away`;
            }
        });
        
        // Render nearby adventures
        renderNearbyAdventures();
    }
    
    // Render nearby adventures
    function renderNearbyAdventures() {
        if (!app.currentLocation) return;
        
        // Sort adventures by distance
        const sortedAdventures = [...mockData.adventures].sort((a, b) => {
            const distanceA = calculateDistance(
                app.currentLocation.latitude,
                app.currentLocation.longitude,
                a.location.latitude,
                a.location.longitude
            );
            
            const distanceB = calculateDistance(
                app.currentLocation.latitude,
                app.currentLocation.longitude,
                b.location.latitude,
                b.location.longitude
            );
            
            return distanceA - distanceB;
        });
        
        // Get only the 10 closest adventures
        const nearbyAdventures = sortedAdventures.slice(0, 10);
        
        // Render in nearby list
        const nearbyList = document.getElementById('nearby-list');
        nearbyList.innerHTML = '';
        
        const template = document.getElementById('adventure-card-template');
        
        nearbyAdventures.forEach(adventure => {
            const adventureCard = document.importNode(template.content, true).querySelector('.adventure-card');
            
            // Set data attribute
            adventureCard.setAttribute('data-id', adventure.id);
            
            // Set image
            const image = adventureCard.querySelector('.card-image img');
            image.src = adventure.image;
            image.alt = adventure.title;
            
            // Set category
            adventureCard.querySelector('.card-category').textContent = adventure.category;
            
            // Set title
            adventureCard.querySelector('.card-title').textContent = adventure.title;
            
            // Set rating
            adventureCard.querySelector('.rating-value').textContent = adventure.rating;
            
            // Generate stars
            const ratingStars = adventureCard.querySelector('.rating-stars');
            ratingStars.innerHTML = generateStars(adventure.rating);
            
            // Set rating count
            adventureCard.querySelector('.rating-count').textContent = `(${adventure.reviewCount})`;
            
            // Set description
            adventureCard.querySelector('.card-description').textContent = adventure.description;
            
            // Calculate and set distance
            const distance = calculateDistance(
                app.currentLocation.latitude,
                app.currentLocation.longitude,
                adventure.location.latitude,
                adventure.location.longitude
            );
            adventureCard.querySelector('.card-distance').textContent = `${distance.toFixed(1)} km away`;
            
            // Add click event
            adventureCard.addEventListener('click', () => {
                showAdventureDetail(adventure);
            });
            
            nearbyList.appendChild(adventureCard);
        });
    }
    
    // Calculate distance between two coordinates in km (Haversine formula)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    }
    
    // Convert degrees to radians
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    // Open maps application with directions
    function openMaps(lat, lng, label) {
        const scheme = device.platform === 'iOS' ? 'maps:' : 'geo:';
        const url = scheme + lat + ',' + lng + '?q=' + encodeURIComponent(label);
        
        window.open(url, '_system');
    }
    
    // Share adventure
    function shareAdventure(adventure) {
        if (navigator.share) {
            navigator.share({
                title: adventure.title,
                text: adventure.description,
                url: 'https://localadventureguide.com/adventure/' + adventure.id
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for devices without Web Share API
            navigator.notification.alert(
                'Check out this adventure: ' + adventure.title,
                null,
                'Share',
                'OK'
            );
        }
    }
    
    // Initialize dark mode
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        
        // Check if dark mode was previously enabled
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Toggle dark mode on change
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }