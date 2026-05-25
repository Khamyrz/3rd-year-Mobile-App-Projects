document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId);
    initApp();
}

// Fallback for browser testing
if (typeof cordova === 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp, false);
}

function initApp() {
    // Initialize tabs
    setupTabs();
    
    // Load top dishes
    loadFeaturedRecipes();
    
    // Setup search
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Setup categories
    setupCategories();
    
    // Load favorites
    loadFavorites();
    
    // Setup modal close
    document.querySelector('.close-button').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('recipeModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm.length === 0) return;
    
    const results = recipeData.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) || 
        recipe.origin.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    // Create a temporary container for search results
    const featuredContainer = document.getElementById('featuredRecipes');
    featuredContainer.innerHTML = '';
    
    if (results.length === 0) {
        featuredContainer.innerHTML = '<p class="empty-state">No recipes found. Try another search term.</p>';
    } else {
        // Display search results
        results.forEach(recipe => {
            featuredContainer.appendChild(createRecipeCard(recipe));
        });
    }
    
    // Switch to featured tab and update title
    document.querySelector('.tab-button[data-tab="featured"]').click();
    document.querySelector('#featured h2').textContent = `Search Results: ${searchTerm}`;
}

function setupCategories() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            filterByRegion(region);
        });
    });
}

function filterByRegion(region) {
    const results = recipeData.filter(recipe => 
        recipe.origin.toLowerCase().includes(region) ||
        recipe.tags.some(tag => tag.toLowerCase() === region)
    );
    
    const featuredContainer = document.getElementById('featuredRecipes');
    featuredContainer.innerHTML = '';
    
    if (results.length === 0) {
        featuredContainer.innerHTML = '<p class="empty-state">No recipes found in this category.</p>';
    } else {
        results.forEach(recipe => {
            featuredContainer.appendChild(createRecipeCard(recipe));
        });
    }
    
    // Switch to featured tab and update title
    document.querySelector('.tab-button[data-tab="featured"]').click();
    document.querySelector('#featured h2').textContent = `${region.charAt(0).toUpperCase() + region.slice(1)} Cuisine`;
}

function loadFeaturedRecipes() {
    const featuredContainer = document.getElementById('featuredRecipes');
    featuredContainer.innerHTML = '';
    
    // Show top dishes
    recipeData.forEach(recipe => {
        featuredContainer.appendChild(createRecipeCard(recipe));
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-id', recipe.id);
    
    const isFavorite = getFavorites().includes(recipe.id);
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-info">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-origin">${recipe.origin}</div>
            <div class="recipe-actions">
                <button class="favorite-button ${isFavorite ? 'active' : ''}" data-id="${recipe.id}">
                    ♥
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.recipe-image').addEventListener('click', function() {
        openRecipeDetails(recipe.id);
    });
    
    card.querySelector('.recipe-name').addEventListener('click', function() {
        openRecipeDetails(recipe.id);
    });
    
    card.querySelector('.favorite-button').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(recipe.id);
        this.classList.toggle('active');
    });
    
    return card;
}

function openRecipeDetails(recipeId) {
    const recipe = recipeData.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const recipeDetails = document.getElementById('recipeDetails');
    
    // Format ingredients
    const ingredientsList = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
    
    // Format instructions
    const instructionsList = recipe.instructions.map(step => `<li>${step}</li>`).join('');
    
    recipeDetails.innerHTML = `
        <div class="recipe-header">
            <h2 class="recipe-title">${recipe.name}</h2>
            <p class="recipe-subtitle">${recipe.origin}</p>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-main-image">
        </div>
        
        <div class="recipe-meta">
            <div class="meta-item">
                <div class="meta-value">${recipe.prepTime}</div>
                <div class="meta-label">Prep Time</div>
            </div>
            <div class="meta-item">
                <div class="meta-value">${recipe.cookTime}</div>
                <div class="meta-label">Cook Time</div>
            </div>
            <div class="meta-item">
                <div class="meta-value">${recipe.servings}</div>
                <div class="meta-label">Servings</div>
            </div>
        </div>
        
        <div class="recipe-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
        </div>
        
        <div class="recipe-section">
            <h3>Instructions</h3>
            <ol class="instructions-list">
                ${instructionsList}
            </ol>
        </div>
    `;
    
    // Open modal
    document.getElementById('recipeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

function toggleFavorite(recipeId) {
    let favorites = getFavorites();
    
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
    } else {
        favorites.push(recipeId);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    loadFavorites();
}

function getFavorites() {
    const favoritesJSON = localStorage.getItem('favoriteRecipes');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function loadFavorites() {
    const favorites = getFavorites();
    const favoriteContainer = document.getElementById('favoriteRecipes');
    favoriteContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoriteContainer.innerHTML = '<p class="empty-state">You haven\'t saved any favorites yet. Click the heart icon on any recipe to save it here!</p>';
        return;
    }
    
    favorites.forEach(id => {
        const recipe = recipeData.find(r => r.id === id);
        if (recipe) {
            favoriteContainer.appendChild(createRecipeCard(recipe));
        }
    });
}

// Recipe data
const recipeData = [
    {
        id: '1',
        name: 'Italian Pasta Carbonara',
        origin: 'Italy',
        image: 'img/recipes/carbonara.jpg',
        prepTime: '15 min',
        cookTime: '15 min',
        servings: 4,
        tags: ['italian', 'pasta', 'quick'],
        ingredients: [
            '350g spaghetti',
            '150g pancetta or guanciale, diced',
            '3 large eggs',
            '50g pecorino cheese, grated',
            '50g parmesan, grated',
            'Black pepper, freshly ground',
            'Salt for pasta water'
        ],
        instructions: [
            'Bring a large pot of salted water to a boil and cook pasta according to package directions until al dente.',
            'While pasta cooks, heat a large skillet over medium heat. Add pancetta and cook until crispy, about 5-7 minutes.',
            'In a bowl, whisk together eggs and grated cheeses until well combined. Season with plenty of freshly ground black pepper.',
            'When pasta is ready, reserve 1/2 cup of pasta water, then drain pasta.',
            'Working quickly, add hot pasta to the skillet with pancetta. Remove from heat and toss to coat pasta with pancetta fat.',
            'Quickly pour in egg and cheese mixture, stirring constantly. The heat from the pasta will cook the eggs without scrambling them.',
            'Add a splash of reserved pasta water to create a silky sauce that coats each strand of pasta.',
            'Serve immediately with additional grated cheese and black pepper on top.'
        ]
    },
    {
        id: '2',
        name: 'Sushi Rolls',
        origin: 'Japan',
        image: 'img/recipes/sushi.jpg',
        prepTime: '30 min',
        cookTime: '20 min',
        servings: 4,
        tags: ['asian', 'japanese', 'seafood'],
        ingredients: [
            '2 cups sushi rice',
            '3 cups water',
            '1/4 cup rice vinegar',
            '2 tablespoons sugar',
            '1 teaspoon salt',
            '8 nori sheets',
            '1 cucumber, julienned',
            '1 avocado, sliced',
            '200g sashimi-grade salmon or tuna',
            'Soy sauce for serving',
            'Wasabi and pickled ginger for serving'
        ],
        instructions: [
            'Rinse rice until water runs clear. Combine with water in a rice cooker and cook until done.',
            'In a small bowl, mix rice vinegar, sugar, and salt until dissolved. Microwave for 30 seconds if needed.',
            'Transfer cooked rice to a large wooden bowl. Drizzle vinegar mixture over rice and fold gently to combine. Let cool to room temperature.',
            'Place a nori sheet on a bamboo sushi mat, shiny side down. Cover two-thirds of the sheet with a thin layer of rice.',
            'Arrange fillings in a line across the center of the rice.',
            'Using the bamboo mat, roll the nori sheet tightly around the fillings, applying gentle pressure.',
            'With a sharp knife, cut each roll into 6-8 pieces.',
            'Serve with soy sauce, wasabi, and pickled ginger.'
        ]
    },
    {
        id: '3',
        name: 'Paella Valenciana',
        origin: 'Spain',
        image: 'img/recipes/paella.jpg',
        prepTime: '25 min',
        cookTime: '35 min',
        servings: 6,
        tags: ['spanish', 'mediterranean', 'rice', 'seafood'],
        ingredients: [
            '3 tablespoons olive oil',
            '1 onion, finely chopped',
            '3 garlic cloves, minced',
            '1 red bell pepper, diced',
            '200g chicken thighs, cut into pieces',
            '100g chorizo, sliced',
            '2 teaspoons paprika',
            '1 pinch saffron threads',
            '1.5 cups bomba or calasparra rice',
            '3 cups chicken broth',
            '400g mixed seafood (prawns, mussels, calamari)',
            '1 cup frozen peas',
            'Lemon wedges for serving',
            'Fresh parsley, chopped, for garnish'
        ],
        instructions: [
            'Heat oil in a paella pan or large skillet over medium heat. Add chicken and chorizo and cook until browned, about 5-7 minutes.',
            'Add onion, garlic, and bell pepper. Cook until softened, about 4 minutes.',
            'Stir in paprika and saffron, toast for 30 seconds until fragrant.',
            'Add rice and stir to coat in the oils and spices.',
            'Pour in chicken broth and bring to a simmer. Reduce heat to low and cook, uncovered, for 15 minutes without stirring.',
            'Arrange seafood on top of the rice, pressing slightly into the partially cooked rice. Scatter peas over the top.',
            'Continue cooking until rice is tender and liquid is absorbed, about 10 minutes more.',
            'Remove from heat, cover with a clean kitchen towel, and let rest for 5 minutes.',
            'Garnish with chopped parsley and serve with lemon wedges.'
        ]
    },
    {
        id: '4',
        name: 'Butter Chicken',
        origin: 'India',
        image: 'img/recipes/butter_chicken.jpg',
        prepTime: '30 min',
        cookTime: '25 min',
        servings: 4,
        tags: ['indian', 'curry', 'chicken'],
        ingredients: [
            '500g boneless chicken, cut into pieces',
            '2 tablespoons yogurt',
            '1 tablespoon ginger garlic paste',
            '1 teaspoon garam masala',
            '1 teaspoon red chili powder',
            '2 tablespoons butter',
            '1 onion, finely chopped',
            '400g tomato puree',
            '1 tablespoon sugar',
            '1/2 cup heavy cream',
            '1 tablespoon dried fenugreek leaves (kasuri methi)',
            'Salt to taste',
            'Fresh coriander leaves for garnish'
        ],
        instructions: [
            'Marinate chicken with yogurt, ginger garlic paste, garam masala, and red chili powder for at least 30 minutes.',
            'Heat butter in a pan. Add chicken pieces and cook until browned on all sides. Remove and set aside.',
            'In the same pan, add chopped onions and cook until golden brown.',
            'Add tomato puree and cook until the oil separates, about 5-7 minutes.',
            'Add sugar, salt, and cook for another 2 minutes.',
            'Add the browned chicken pieces and cook for 10 minutes on medium heat.',
            'Stir in heavy cream and crushed fenugreek leaves. Simmer for 5 minutes on low heat.',
            'Garnish with fresh coriander leaves and serve hot with naan or rice.'
        ]
    },
    {
        id: '5',
        name: 'Pad Thai',
        origin: 'Thailand',
        image: 'img/recipes/pad_thai.jpg',
        prepTime: '20 min',
        cookTime: '15 min',
        servings: 4,
        tags: ['asian', 'thai', 'noodles'],
        ingredients: [
            '225g rice noodles',
            '3 tablespoons vegetable oil',
            '2 eggs, lightly beaten',
            '2 cloves garlic, minced',
            '225g shrimp, peeled and deveined',
            '2 tablespoons fish sauce',
            '2 tablespoons tamarind paste',
            '1 tablespoon brown sugar',
            '1 tablespoon lime juice',
            '1 cup bean sprouts',
            '3 green onions, chopped',
            '1/4 cup roasted peanuts, chopped',
            'Lime wedges and fresh cilantro for serving'
        ],
        instructions: [
            'Soak rice noodles in cold water for 30 minutes, then drain.',
            'Mix fish sauce, tamarind paste, brown sugar, and lime juice in a small bowl.',
            'Heat oil in a wok or large skillet over high heat. Add garlic and stir-fry for 30 seconds.',
            'Add shrimp and cook until pink, about 2-3 minutes. Push to one side of the pan.',
            'Pour beaten eggs into the empty side of the pan. Scramble until set, then mix with the shrimp.',
            'Add drained noodles and sauce mixture. Stir-fry until noodles are tender and sauce is absorbed, about 3-5 minutes.',
            'Stir in bean sprouts and green onions. Cook for another minute.',
            'Serve topped with chopped peanuts, lime wedges, and cilantro.'
        ]
    },
    {
        id: '6',
        name: 'Moroccan Tagine',
        origin: 'Morocco',
        image: 'img/recipes/tagine.jpg',
        prepTime: '30 min',
        cookTime: '90 min',
        servings: 6,
        tags: ['moroccan', 'mediterranean', 'stew'],
        ingredients: [
            '500g lamb shoulder, cut into cubes',
            '2 tablespoons olive oil',
            '2 onions, sliced',
            '3 garlic cloves, minced',
            '1 tablespoon ginger, grated',
            '1 teaspoon cumin',
            '1 teaspoon coriander',
            '1 teaspoon cinnamon',
            '1 pinch saffron threads',
            '400g canned tomatoes, chopped',
            '1 cup vegetable broth',
            '100g dried apricots, halved',
            '100g prunes, pitted',
            '1/3 cup green olives',
            '1 preserved lemon, quartered',
            'Fresh coriander and mint for garnish'
        ],
        instructions: [
            'Heat olive oil in a tagine or heavy-bottomed pot over medium heat. Brown lamb cubes on all sides, then remove and set aside.',
            'In the same pot, add onions and cook until softened, about 5 minutes.',
            'Add garlic and ginger, cook for 1 minute. Stir in cumin, coriander, cinnamon, and saffron.',
            'Return lamb to the pot. Add tomatoes and broth. Bring to a simmer.',
            'Cover and cook on low heat for 1 hour, or until meat is tender.',
            'Add dried fruits, olives, and preserved lemon. Cover and simmer for another 30 minutes.',
            'Season with salt and pepper to taste.',
            'Garnish with fresh herbs and serve with couscous or bread.'
        ]
    },
    {
        id: '7',
        name: 'Beef Tacos',
        origin: 'Mexico',
        image: 'img/recipes/tacos.jpg',
        prepTime: '15 min',
        cookTime: '20 min',
        servings: 4,
        tags: ['mexican', 'beef', 'quick'],
        ingredients: [
            '500g ground beef',
            '1 onion, finely chopped',
            '3 garlic cloves, minced',
            '2 tablespoons taco seasoning',
            '1 cup tomato sauce',
            '8 corn tortillas',
            '1 cup lettuce, shredded',
            '1 cup cheddar cheese, grated',
            '1 tomato, diced',
            '1/2 cup sour cream',
            '1 avocado, sliced',
            'Fresh cilantro, chopped',
            'Lime wedges for serving'
        ],
        instructions: [
            'Heat a large skillet over medium-high heat. Add ground beef and cook until browned, breaking it up as it cooks.',
            'Add onion and garlic. Cook until onion is softened, about 3 minutes.',
            'Stir in taco seasoning and tomato sauce. Simmer for 5 minutes until slightly thickened.',
            'Warm tortillas according to package instructions.',
            'To assemble tacos, place a spoonful of beef mixture on each tortilla.',
            'Top with lettuce, cheese, diced tomato, sour cream, and avocado slices.',
            'Garnish with cilantro and serve with lime wedges.'
        ]
    },
    {
        id: '8',
        name: 'French Coq au Vin',
        origin: 'France',
        image: 'img/recipes/coq_au_vin.jpg',
        prepTime: '30 min',
        cookTime: '90 min',
        servings: 6,
        tags: ['french', 'chicken', 'wine'],
        ingredients: [
            '1 whole chicken (about 1.5kg), cut into 8 pieces',
            '150g bacon, diced',
            '20 pearl onions, peeled',
            '250g button mushrooms, quartered',
            '3 garlic cloves, minced',
            '2 tablespoons flour',
            '1 bottle (750ml) dry red wine',
            '2 cups chicken stock',
            '1 bouquet garni (thyme, parsley, bay leaf)',
            '3 tablespoons butter',
            '2 tablespoons olive oil',
            'Salt and pepper to taste',
            'Fresh parsley, chopped, for garnish'
        ],
        instructions: [
            'Season chicken pieces with salt and pepper. Heat olive oil in a large Dutch oven over medium-high heat.',
            'Working in batches, brown chicken on all sides, about 3-4 minutes per side. Remove and set aside.',
            'Add bacon to the pot and cook until crispy. Add pearl onions and cook until lightly browned.',
            'Add mushrooms and garlic, cook for 3 minutes more.',
            'Sprinkle flour over vegetables and stir to coat. Cook for 1 minute.',
            'Slowly add wine and stock, stirring constantly. Add bouquet garni.',
            'Return chicken to the pot. Bring to a simmer, then cover and reduce heat to low.',
            'Cook for about 1 hour and 15 minutes, or until chicken is very tender.',
            'Remove chicken and vegetables. Increase heat and reduce sauce until thickened.',
            'Whisk in butter for a glossy finish. Return chicken and vegetables to the pot.',
            'Garnish with parsley and serve with mashed potatoes or crusty bread.'
        ]
    },
    {
        id: '9',
        name: 'Greek Moussaka',
        origin: 'Greece',
        image: 'img/recipes/moussaka.jpg',
        prepTime: '45 min',
        cookTime: '60 min',
        servings: 8,
        tags: ['greek', 'mediterranean', 'eggplant'],
        ingredients: [
            '3 large eggplants, sliced into 1cm rounds',
            '500g ground lamb (or beef)',
            '1 onion, finely chopped',
            '3 garlic cloves, minced',
            '1 tablespoon dried oregano',
            '1 teaspoon ground cinnamon',
            '400g canned tomatoes, chopped',
            '2 tablespoons tomato paste',
            '1/2 cup red wine',
            '2 tablespoons olive oil',
            'For béchamel sauce:',
            '50g butter',
            '50g flour',
            '500ml milk',
            '1/4 teaspoon nutmeg',
            '2 eggs, beaten',
            '100g parmesan cheese, grated',
            'Salt and pepper to taste'
        ],
        instructions: [
            'Preheat oven to 180°C (350°F). Brush eggplant slices with olive oil and season with salt.',
            'Arrange on baking sheets and bake for 25 minutes, until softened. Set aside.',
            'Heat olive oil in a large pan. Add onion and garlic, cook until softened.',
            'Add lamb and cook until browned, breaking it up as it cooks. Drain excess fat if needed.',
            'Stir in oregano, cinnamon, tomatoes, tomato paste, and wine. Simmer for 20 minutes until thickened.',
            'For the béchamel, melt butter in a saucepan. Add flour and cook for 1 minute, stirring constantly.',
            'Gradually whisk in milk until smooth. Cook until thickened, stirring constantly.',
            'Remove from heat. Stir in nutmeg, salt, and pepper. Let cool slightly, then whisk in eggs and 1/2 the parmesan.',
            'Arrange half the eggplant in a large baking dish. Cover with all the meat sauce, then top with remaining eggplant.',
            'Pour béchamel sauce over the top and sprinkle with remaining parmesan.',
            'Bake for 45 minutes, until golden brown. Let stand for 15 minutes before serving.'
        ]
    },
    {
        id: '10',
        name: 'Brazilian Feijoada',
        origin: 'Brazil',
        image: 'img/recipes/feijoada.jpg',
        prepTime: '30 min',
        cookTime: '180 min',
        servings: 8,
        tags: ['brazilian', 'stew', 'beans'],
        ingredients: [
            '500g dried black beans, soaked overnight',
            '200g smoked pork ribs',
            '200g pork shoulder, cubed',
            '150g cured chorizo, sliced',
            '100g smoked bacon, diced',
            '2 onions, chopped',
            '4 garlic cloves, minced',
            '2 bay leaves',
            '1 orange, peeled and quartered',
            '2 tablespoons olive oil',
            'Salt and pepper to taste',
            'For serving:',
            'White rice',
            'Collard greens, thinly sliced and sautéed',
            'Orange slices',
            'Farofa (toasted cassava flour)'
        ],
        instructions: [
            'Drain soaked beans and set aside.',
            'In a large heavy pot, heat olive oil over medium heat. Add bacon and cook until crisp.',
            'Add onions and garlic, cook until softened, about 5 minutes.',
            'Add all meats and stir to brown slightly, about 5 minutes.',
            'Add drained beans, bay leaves, and enough water to cover by 2 inches. Bring to a boil.',
            'Reduce heat, add orange quarters, and simmer covered for about 2.5-3 hours, until beans and meat are very tender.',
            'Remove orange quarters and bay leaves. Season with salt and pepper to taste.',
            'If desired, remove meats, chop into bite-sized pieces, and return to the pot.',
            'Serve hot with white rice, sautéed collard greens, orange slices, and farofa.'
        ]
    }
];