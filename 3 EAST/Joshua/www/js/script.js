// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Menu Functionality
    const navItems = document.querySelectorAll('.nav-menu li');
    const sections = document.querySelectorAll('.content-section');
    const startButton = document.querySelector('.start-button');
    const recipeButtons = document.querySelectorAll('.view-recipe-btn');
    const recipeModal = document.getElementById('recipe-modal');
    const closeRecipe = document.querySelector('.close-recipe');
    const recipeDetails = document.getElementById('recipe-details');

    // Navigation event listeners
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the selected section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Scroll to top of the section
            window.scrollTo(0, 0);
        });
    });

    // Start button functionality
    if (startButton) {
        startButton.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Set the corresponding nav item as active
            navItems.forEach(nav => {
                if (nav.getAttribute('data-target') === targetId) {
                    nav.click();
                }
            });
        });
    }

    // Recipe modal functionality
    recipeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recipeType = this.getAttribute('data-recipe');
            loadRecipeDetails(recipeType);
            recipeModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close recipe modal
    closeRecipe.addEventListener('click', function() {
        recipeModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
    });

    // Close modal when clicking outside of the content
    window.addEventListener('click', function(event) {
        if (event.target === recipeModal) {
            recipeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Load recipe details
    function loadRecipeDetails(recipeType) {
        let recipeHTML = '';
        
        switch(recipeType) {
            case 'sinangag':
                recipeHTML = `
                    <h2>Sinangag na Tuyo (Garlic Rice with Dried Fish)</h2>
                    <img src="images/sinangag-na-tuyo.png" alt="Sinangag na Tuyo" style="width:100%; border-radius:8px; margin-bottom:15px;">
                    
                    <h3>Ingredients:</h3>
                    <ul>
                        <li>3 cups cooked rice (preferably day-old)</li>
                        <li>4-5 pieces dried tuyo (salted dried fish)</li>
                        <li>6-8 cloves garlic, minced</li>
                        <li>3 tablespoons cooking oil</li>
                        <li>½ teaspoon salt (adjust to taste)</li>
                        <li>¼ teaspoon ground black pepper</li>
                        <li>1 tablespoon chopped green onions (optional)</li>
                    </ul>
                    
                    <h3>Instructions:</h3>
                    <ol>
                        <li>Clean the dried tuyo by removing the head, tail, and bones. Flake the fish meat and set aside.</li>
                        <li>In a pan or wok, heat oil over medium heat. Add minced garlic and sauté until golden brown and fragrant.</li>
                        <li>Remove half of the fried garlic and set aside for topping.</li>
                        <li>Add the flaked tuyo to the pan and sauté for about 1 minute.</li>
                        <li>Add the cooked rice, breaking any lumps with a spatula. Mix well to combine with the garlic and tuyo.</li>
                        <li>Season with salt and pepper to taste. Remember that tuyo is already salty, so adjust accordingly.</li>
                        <li>Stir-fry for about 3-4 minutes until the rice is heated through and well-mixed with the ingredients.</li>
                        <li>Transfer to a serving plate. Sprinkle with the reserved fried garlic and chopped green onions on top.</li>
                        <li>Serve hot with a slice of tomato or cucumber on the side.</li>
                    </ol>
                    
                    <h3>Tips:</h3>
                    <ul>
                        <li>Use day-old rice for best results as it's drier and less sticky.</li>
                        <li>For a less salty version, soak the tuyo in water for a few minutes before cooking.</li>
                        <li>You can add a fried egg on top to make it a complete meal.</li>
                    </ul>
                `;
                break;
                
            case 'danggit':
                recipeHTML = `
                    <h2>Danggit Silog (Dried Fish with Rice and Egg)</h2>
                    <img src="images/danggit-silog.png" alt="Danggit Silog" style="width:100%; border-radius:8px; margin-bottom:15px;">
                    
                    <h3>Ingredients:</h3>
                    <ul>
                        <li>4-5 pieces dried danggit (rabbitfish)</li>
                        <li>2 cups cooked rice</li>
                        <li>2 eggs</li>
                        <li>4 cloves garlic, minced</li>
                        <li>2 tablespoons cooking oil</li>
                        <li>Pinch of salt</li>
                        <li>Spiced vinegar dip (optional)</li>
                        <li>Sliced tomatoes and cucumber for serving</li>
                    </ul>
                    
                    <h3>Instructions:</h3>
                    <ol>
                        <li>Heat oil in a pan over medium-high heat.</li>
                        <li>Fry the dried danggit for about 2-3 minutes on each side until crispy. Set aside.</li>
                        <li>In the same pan with the remaining oil, add minced garlic and sauté until golden brown.</li>
                        <li>Add cooked rice, breaking any lumps. Stir-fry for 2-3 minutes until heated through.</li>
                        <li>Season with a pinch of salt and transfer to a plate.</li>
                        <li>In the same pan, add a little more oil if needed and fry the eggs sunny-side up or to your preference.</li>
                        <li>Arrange the garlic fried rice, fried danggit, and fried egg on a plate.</li>
                        <li>Serve with sliced tomatoes, cucumber, and spiced vinegar dip on the side.</li>
                    </ol>
                    
                    <h3>Spiced Vinegar Dip:</h3>
                    <ul>
                        <li>½ cup vinegar (preferably coconut or cane vinegar)</li>
                        <li>2 cloves garlic, minced</li>
                        <li>1 small onion, chopped</li>
                        <li>2 small chili peppers, chopped</li>
                        <li>Pinch of salt and ground black pepper</li>
                    </ul>
                    <p>Mix all ingredients together and let sit for at least 10 minutes before serving.</p>
                `;
                break;
                
            case 'bangus':
                recipeHTML = `
                    <h2>Daing na Bangus (Marinated Dried Milkfish)</h2>
                    <img src="images/daing-na-bangus.png" alt="Daing na Bangus" style="width:100%; border-radius:8px; margin-bottom:15px;">
                    
                    <h3>Ingredients:</h3>
                    <ul>
                        <li>1 whole bangus (milkfish), about 500g, butterflied</li>
                        <li>½ cup white vinegar</li>
                        <li>1 tablespoon salt</li>
                        <li>1 tablespoon crushed black peppercorns</li>
                        <li>6-8 cloves garlic, crushed</li>
                        <li>¼ cup cooking oil for frying</li>
                        <li>Sliced tomatoes and onions for garnish</li>
                        <li>Spiced vinegar for dipping</li>
                    </ul>
                    
                    <h3>Instructions:</h3>
                    <ol>
                        <li>Clean the butterflied bangus thoroughly and pat dry with paper towels.</li>
                        <li>In a large shallow dish, mix vinegar, salt, crushed peppercorns, and crushed garlic.</li>
                        <li>Place the bangus in the marinade, making sure both sides are coated well.</li>
                        <li>Cover and refrigerate for at least 6 hours or overnight for best results.</li>
                        <li>After marinating, remove the bangus and drain excess marinade.</li>
                        <li>You can either:</li>
                        <ul>
                            <li><strong>Traditional method:</strong> Sun-dry for 4-6 hours until partially dried</li>
                            <li><strong>Quick method:</strong> Pat dry with paper towels and proceed directly to frying</li>
                        </ul>
                        <li>Heat oil in a large skillet over medium-high heat.</li>
                        <li>Fry the bangus for about 3-4 minutes on each side until golden brown and crispy.</li>
                        <li>Transfer to a plate lined with paper towels to drain excess oil.</li>
                        <li>Serve hot with steamed rice, sliced tomatoes, and onions. Accompany with spiced vinegar dip.</li>
                    </ol>
                    
                    <h3>Tips:</h3>
                    <ul>
                        <li>Ask your fishmonger to butterfly the bangus for you to save time.</li>
                        <li>For a less salty version, reduce the amount of salt in the marinade.</li>
                        <li>You can add calamansi or lemon juice to the marinade for additional flavor.</li>
                    </ul>
                `;
                break;
                
            default:
                recipeHTML = '<p>Recipe details not found.</p>';
        }
        
        recipeDetails.innerHTML = recipeHTML;
    }

    // Offline functionality notice
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('service-worker.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    // Simple database for storing user preferences (using localStorage)
    const appDB = {
        savePreference: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        
        getPreference: function(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        },
        
        removePreference: function(key) {
            localStorage.removeItem(key);
        }
    };

    // Check if it's the first visit
    const firstVisit = appDB.getPreference('firstVisit');
    if (!firstVisit) {
        // Show welcome message for first-time users
        showWelcomeMessage();
        appDB.savePreference('firstVisit', false);
    }

    function showWelcomeMessage() {
        const welcomeHTML = `
            <div id="welcome-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.7); z-index:1000; display:flex; justify-content:center; align-items:center;">
                <div style="background-color:white; padding:20px; border-radius:10px; max-width:80%; text-align:center;">
                    <h2 style="color:#1a5276;">Welcome to The Journey of Dried Fish!</h2>
                    <p>Your comprehensive guide to Philippine traditional fish drying techniques.</p>
                    <p>This app works completely offline - perfect for use in remote areas or during actual fish drying sessions.</p>
                    <button id="welcome-btn" style="background-color:#f39c12; color:white; border:none; padding:10px 20px; border-radius:5px; margin-top:15px; cursor:pointer;">Get Started</button>
                </div>
            </div>
        `;
        
        const welcomeDiv = document.createElement('div');
        welcomeDiv.innerHTML = welcomeHTML;
        document.body.appendChild(welcomeDiv);
        
        document.getElementById('welcome-btn').addEventListener('click', function() {
            document.getElementById('welcome-modal').remove();
        });
    }

    // Add functionality for "Add to Favorites" feature
    const fishItems = document.querySelectorAll('.fish-item');
    fishItems.forEach(item => {
        const fishName = item.querySelector('h3').textContent;
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '★ Add to Favorites';
        favoriteBtn.style.backgroundColor = '#f39c12';
        favoriteBtn.style.color = 'white';
        favoriteBtn.style.border = 'none';
        favoriteBtn.style.padding = '5px 10px';
        favoriteBtn.style.borderRadius = '5px';
        favoriteBtn.style.marginTop = '10px';
        favoriteBtn.style.cursor = 'pointer';
        favoriteBtn.style.fontSize = '0.8rem';
        
        // Check if already in favorites
        const favorites = appDB.getPreference('favorites') || [];
        if (favorites.includes(fishName)) {
            favoriteBtn.innerHTML = '★ Favorited';
            favoriteBtn.style.backgroundColor = '#27ae60';
        }
        
        favoriteBtn.addEventListener('click', function() {
            const favorites = appDB.getPreference('favorites') || [];
            
            if (favorites.includes(fishName)) {
                // Remove from favorites
                const index = favorites.indexOf(fishName);
                favorites.splice(index, 1);
                favoriteBtn.innerHTML = '★ Add to Favorites';
                favoriteBtn.style.backgroundColor = '#f39c12';
            } else {
                // Add to favorites
                favorites.push(fishName);
                favoriteBtn.innerHTML = '★ Favorited';
                favoriteBtn.style.backgroundColor = '#27ae60';
            }
            
            appDB.savePreference('favorites', favorites);
        });
        
        item.querySelector('.fish-details').appendChild(favoriteBtn);
    });
});

// Simple service worker for offline functionality
// Note: This is a basic implementation - in a real app, you would need to cache assets properly
// This is just included here for demonstration purposes
/*
// service-worker.js (would be in a separate file)
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('dried-fish-app-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                // Add paths to all images and other assets
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
*/