// Shop data for different locations - with accurate coordinates for Bantayan Island
const shopData = {
    bantayan: [
        {
            id: "b1",
            name: "Cloud Chasers Vape",
            address: "Bantayan Public Market Area, Poblacion, Bantayan",
            coordinates: [11.1659, 123.7357], // [latitude, longitude]
            hours: "10:00 AM - 9:00 PM",
            contact: "09123456789",
            description: "Specializing in premium e-liquids and high-end mods. Friendly staff offering expert advice for beginners and experienced vapers.",
            image: "images/shops/cloud-chasers.png",
            products: [
                {
                    name: "Premium E-Liquids",
                    description: "High-quality nicotine salts and freebase e-liquids",
                    advantages: ["Smooth throat hit", "Wide flavor selection", "Consistent quality"],
                    disadvantages: ["Higher price point", "May require specific devices"]
                },
                {
                    name: "High-End Mods",
                    description: "Advanced vaping devices with customizable settings",
                    advantages: ["Customizable experience", "Long battery life", "Durable build"],
                    disadvantages: ["Complex for beginners", "Higher initial cost"]
                }
            ]
        },
        {
            id: "b2",
            name: "Vapor Haven",
            address: "Sta. Fe-Bantayan Rd, Near Municipal Hall",
            coordinates: [11.1723, 123.7289],
            hours: "9:00 AM - 8:00 PM",
            contact: "09187654321",
            description: "Wide selection of disposable vapes and pod systems. Try our locally-made e-liquid blends unique to Bantayan Island.",
            image: "images/shops/vapor-haven.png",
            products: [
                {
                    name: "Disposable Vapes",
                    description: "Convenient single-use vaping devices",
                    advantages: ["No maintenance required", "Portable and lightweight", "Ready to use"],
                    disadvantages: ["Environmental impact", "Higher long-term cost", "Limited flavor options"]
                },
                {
                    name: "Pod Systems",
                    description: "Compact and user-friendly vaping devices",
                    advantages: ["Easy to use", "Affordable", "Good for beginners"],
                    disadvantages: ["Limited battery life", "Less customizable"]
                }
            ]
        },
        {
            id: "b3",
            name: "Island Vape Co.",
            address: "Sillon Beach Road, Bantayan Island",
            coordinates: [11.1589, 123.7492],
            hours: "11:00 AM - 10:00 PM",
            contact: "09156789012",
            description: "Beach-side vape shop catering to tourists and locals. Comprehensive stock of devices, coils, and batteries.",
            image: "images/shops/island-vape.png",
            products: [
                {
                    name: "Coils and Batteries",
                    description: "Replacement parts and power sources",
                    advantages: ["Extends device life", "Maintains performance", "Cost-effective"],
                    disadvantages: ["Regular maintenance needed", "Requires technical knowledge"]
                },
                {
                    name: "Starter Kits",
                    description: "Complete vaping setups for beginners",
                    advantages: ["All-in-one solution", "Beginner-friendly", "Good value"],
                    disadvantages: ["Basic features", "May need upgrades later"]
                }
            ]
        },
        {
            id: "b4",
            name: "Vape Paradise",
            address: "Near Bantayan Beach Resort",
            coordinates: [11.1512, 123.7425],
            hours: "8:00 AM - 11:00 PM",
            contact: "09234567890",
            description: "Beachfront vape shop with a wide selection of tropical-flavored e-liquids and beach-friendly devices.",
            image: "images/shops/vape-paradise.png",
            products: [
                {
                    name: "Tropical E-Liquids",
                    description: "Exotic fruit and beach-inspired flavors",
                    advantages: ["Unique flavors", "Perfect for vacation", "Refreshing taste"],
                    disadvantages: ["Limited availability", "Seasonal variations"]
                },
                {
                    name: "Waterproof Devices",
                    description: "Beach and pool-friendly vaping devices",
                    advantages: ["Water-resistant", "Durable design", "Perfect for outdoor use"],
                    disadvantages: ["Limited features", "Higher price"]
                }
            ]
        },
        {
            id: "b5",
            name: "Vape Tech Hub",
            address: "Bantayan Town Center",
            coordinates: [11.1698, 123.7312],
            hours: "9:00 AM - 10:00 PM",
            contact: "09345678901",
            description: "Modern vape shop with the latest technology and devices. Specializing in advanced vaping equipment and custom builds.",
            image: "images/shops/vape-tech-hub.png",
            products: [
                {
                    name: "Custom Mods",
                    description: "Handcrafted and customized vaping devices",
                    advantages: ["Unique designs", "Premium quality", "Personalized experience"],
                    disadvantages: ["Expensive", "Long wait times", "Limited availability"]
                },
                {
                    name: "Advanced Accessories",
                    description: "High-tech vaping accessories and parts",
                    advantages: ["Latest technology", "Premium materials", "Enhanced performance"],
                    disadvantages: ["Complex setup", "Requires expertise"]
                }
            ]
        }
    ],
    madridejos: [
        {
            id: "m1",
            name: "Madridejos Vapor Lounge",
            address: "Poblacion, near Kota Park, Madridejos",
            coordinates: [11.2722, 123.7262],
            hours: "10:00 AM - 7:00 PM",
            contact: "09234567890",
            description: "Cozy lounge offering device maintenance and coil building services. Great place to hang out and meet fellow vapers.",
            image: "images/shops/madridejos-lounge.png",
            products: [
                {
                    name: "Device Maintenance",
                    description: "Professional cleaning and repair services",
                    advantages: ["Expert service", "Extends device life", "Saves money"],
                    disadvantages: ["Service fees", "Time required"]
                },
                {
                    name: "Custom Coils",
                    description: "Handcrafted coils for advanced users",
                    advantages: ["Superior performance", "Customizable", "Unique experience"],
                    disadvantages: ["Advanced skill required", "Higher cost"]
                }
            ]
        },
        {
            id: "m2",
            name: "Vape Master",
            address: "Near Madridejos Port and Lawis Fish Market",
            coordinates: [11.2789, 123.7198],
            hours: "9:30 AM - 8:30 PM",
            contact: "09345678901",
            description: "Family-owned shop with personalized service. Known for stocking hard-to-find flavors and accessories.",
            image: "images/shops/vape-master.png",
            products: [
                {
                    name: "Rare Flavors",
                    description: "Exclusive and limited edition e-liquids",
                    advantages: ["Unique flavors", "Limited availability", "Premium quality"],
                    disadvantages: ["Higher price", "Limited stock"]
                },
                {
                    name: "Accessories",
                    description: "Essential vaping accessories and parts",
                    advantages: ["Enhances experience", "Protects devices", "Customization options"],
                    disadvantages: ["Additional cost", "May need multiple items"]
                }
            ]
        },
        {
            id: "m3",
            name: "Vape Essentials",
            address: "Madridejos Public Market Area",
            coordinates: [11.2698, 123.7321],
            hours: "8:00 AM - 9:00 PM",
            contact: "09456789012",
            description: "One-stop shop for all vaping needs. From basic supplies to advanced equipment.",
            image: "images/shops/vape-essentials.png",
            products: [
                {
                    name: "Basic Supplies",
                    description: "Essential vaping supplies and parts",
                    advantages: ["Affordable prices", "Wide selection", "Always in stock"],
                    disadvantages: ["Basic quality", "Limited premium options"]
                },
                {
                    name: "DIY Kits",
                    description: "Do-it-yourself vaping equipment and supplies",
                    advantages: ["Cost-effective", "Customizable", "Educational"],
                    disadvantages: ["Requires knowledge", "Time-consuming"]
                }
            ]
        },
        {
            id: "m4",
            name: "Vape Culture",
            address: "Near Madridejos Municipal Hall",
            coordinates: [11.2756, 123.7289],
            hours: "10:00 AM - 10:00 PM",
            contact: "09567890123",
            description: "Modern vape shop with a focus on community and culture. Regular events and workshops.",
            image: "images/shops/vape-culture.png",
            products: [
                {
                    name: "Workshop Services",
                    description: "Vaping workshops and training sessions",
                    advantages: ["Learn new skills", "Community building", "Expert guidance"],
                    disadvantages: ["Scheduled sessions", "Additional cost"]
                },
                {
                    name: "Premium Collections",
                    description: "Curated selection of premium vaping products",
                    advantages: ["High-quality items", "Expert selection", "Unique finds"],
                    disadvantages: ["Premium pricing", "Limited stock"]
                }
            ]
        }
    ],
    santaFe: [
        {
            id: "sf1",
            name: "Santa Fe Vape Hub",
            address: "Poblacion, near Santa Fe Ferry Terminal",
            coordinates: [11.1595, 123.8082],
            hours: "9:00 AM - 11:00 PM",
            contact: "09456789012",
            description: "Located just a 2-minute walk from the ferry terminal. Extended hours to serve travelers arriving on late boats. Offers starter kits ideal for beginners.",
            image: "images/shops/santa-fe-hub.png",
            products: [
                {
                    name: "Travel Kits",
                    description: "Compact vaping solutions for travelers",
                    advantages: ["Portable", "TSA-friendly", "Complete setup"],
                    disadvantages: ["Limited features", "Small capacity"]
                },
                {
                    name: "Quick Start Kits",
                    description: "Easy-to-use beginner packages",
                    advantages: ["Simple setup", "Affordable", "Includes everything needed"],
                    disadvantages: ["Basic features", "May need upgrades"]
                }
            ]
        },
        {
            id: "sf2",
            name: "Cloud 9 Vape Shop",
            address: "Hagnaya-Santa Fe Road, near Sugar Beach Resort",
            coordinates: [11.1489, 123.7987],
            hours: "10:00 AM - 10:00 PM",
            contact: "09567890123",
            description: "Premium beachfront shop selling imported e-liquids and high-end devices. Located near popular resorts with ocean views and white sand beaches.",
            image: "images/shops/cloud-9.png",
            products: [
                {
                    name: "Imported E-Liquids",
                    description: "International premium e-liquid brands",
                    advantages: ["Premium quality", "Unique flavors", "Consistent standards"],
                    disadvantages: ["Higher price", "Limited availability"]
                },
                {
                    name: "Luxury Devices",
                    description: "High-end vaping devices and accessories",
                    advantages: ["Premium build quality", "Advanced features", "Status symbol"],
                    disadvantages: ["Expensive", "Complex operation"]
                }
            ]
        },
        {
            id: "sf3",
            name: "Vape Island",
            address: "Poblacion, Santa Fe Public Market Road",
            coordinates: [11.1623, 123.8123],
            hours: "8:00 AM - 9:00 PM",
            contact: "09678901234",
            description: "Largest selection of vape products in Santa Fe. Located near the public market making it accessible to both locals and tourists staying in nearby accommodations.",
            image: "images/shops/vape-island.png",
            products: [
                {
                    name: "Bulk Products",
                    description: "Wholesale vaping supplies and accessories",
                    advantages: ["Cost-effective", "Wide selection", "Stock availability"],
                    disadvantages: ["Minimum purchase may apply", "Less personalized service"]
                },
                {
                    name: "Local Brands",
                    description: "Philippine-made vaping products",
                    advantages: ["Supports local business", "Affordable", "Easy to find parts"],
                    disadvantages: ["Varying quality", "Limited international support"]
                }
            ]
        },
        {
            id: "sf4",
            name: "Vape Beach Club",
            address: "Near Santa Fe Beach Resorts",
            coordinates: [11.1534, 123.8012],
            hours: "11:00 AM - 12:00 AM",
            contact: "09789012345",
            description: "Beachfront vape shop with a relaxed atmosphere. Perfect for tourists and beachgoers.",
            image: "images/shops/vape-beach-club.png",
            products: [
                {
                    name: "Beach Kits",
                    description: "Specialized kits for beach and outdoor use",
                    advantages: ["Sand-resistant", "Waterproof", "Portable"],
                    disadvantages: ["Limited features", "Higher price"]
                },
                {
                    name: "Tropical Flavors",
                    description: "Beach-inspired e-liquid flavors",
                    advantages: ["Unique taste", "Perfect for vacation", "Refreshing"],
                    disadvantages: ["Limited stock", "Seasonal availability"]
                }
            ]
        },
        {
            id: "sf5",
            name: "Vape Express",
            address: "Santa Fe Port Area",
            coordinates: [11.1578, 123.8156],
            hours: "24/7",
            contact: "09890123456",
            description: "24/7 vape shop catering to travelers and night owls. Quick service and essential supplies.",
            image: "images/shops/vape-express.png",
            products: [
                {
                    name: "Emergency Kits",
                    description: "Quick replacement and emergency supplies",
                    advantages: ["Available 24/7", "Essential items", "Quick service"],
                    disadvantages: ["Basic selection", "Higher prices"]
                },
                {
                    name: "Travel Essentials",
                    description: "Must-have items for travelers",
                    advantages: ["Convenient", "Well-stocked", "Quick access"],
                    disadvantages: ["Limited variety", "Premium pricing"]
                }
            ]
        }
    ]
};

// Maps for each location
let bantayanMap, madridejosMap, santaFeMap, detailMap;
let currentShop = null;

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function() {
    // Display age verification on load
    document.getElementById("age-verification").style.display = "flex";
    
    // Age verification buttons
    document.getElementById("under-age-btn").addEventListener("click", function() {
        alert("Sorry, you must be 21 or older to use this app.");
        window.location.href = "https://www.google.com";
    });
    
    document.getElementById("over-age-btn").addEventListener("click", function() {
        document.getElementById("age-verification").style.display = "none";
        document.getElementById("health-notice").style.display = "flex";
    });
    
    // Health notice acknowledgment
    document.getElementById("acknowledge-btn").addEventListener("click", function() {
        document.getElementById("health-notice").style.display = "none";
    });
    
    // Enter button on splash screen
    document.getElementById("enter-btn").addEventListener("click", function() {
        document.getElementById("splash-screen").style.display = "none";
        document.getElementById("main-menu").style.display = "flex";
    });
    
    // Main menu buttons
    document.getElementById("btn-bantayan").addEventListener("click", function() {
        showScreen("bantayan-screen");
        if (!bantayanMap) {
            initMap("bantayan-map", [11.1659, 123.7357], shopData.bantayan);
            bantayanMap = true;
        }
    });
    
    document.getElementById("btn-madridejos").addEventListener("click", function() {
        showScreen("madridejos-screen");
        if (!madridejosMap) {
            initMap("madridejos-map", [11.2722, 123.7262], shopData.madridejos);
            madridejosMap = true;
        }
    });
    
    document.getElementById("btn-santa-fe").addEventListener("click", function() {
        showScreen("santa-fe-screen");
        if (!santaFeMap) {
            initMap("santa-fe-map", [11.1577, 123.8053], shopData.santaFe);
            santaFeMap = true;
        }
    });
    
    // Back buttons
    document.querySelectorAll(".back-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            // Determine which screen to go back to
            let currentScreen = document.querySelector(".screen:not([style='display: none;'])").id;
            
            if (currentScreen === "shop-detail") {
                // Go back to the appropriate location screen
                if (currentShop.id.startsWith("b")) {
                    showScreen("bantayan-screen");
                } else if (currentShop.id.startsWith("m")) {
                    showScreen("madridejos-screen");
                } else if (currentShop.id.startsWith("sf")) {
                    showScreen("santa-fe-screen");
                }
            } else {
                // Go back to main menu
                showScreen("main-menu");
            }
        });
    });
    
    // Populate shop lists
    populateShopList("bantayan-shops", shopData.bantayan);
    populateShopList("madridejos-shops", shopData.madridejos);
    populateShopList("santa-fe-shops", shopData.santaFe);
    
    // Shop detail buttons
    document.getElementById("shop-direction-btn").addEventListener("click", function() {
        if (currentShop) {
            // Open Google Maps directions
            let lat = currentShop.coordinates[0];
            let lng = currentShop.coordinates[1];
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        }
    });
    
    document.getElementById("shop-call-btn").addEventListener("click", function() {
        if (currentShop) {
            // Open phone dialer
            window.open(`tel:${currentShop.contact}`, '_self');
        }
    });
});

// Function to show a specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.style.display = "none";
    });
    
    // Show the requested screen
    document.getElementById(screenId).style.display = "flex";
}

// Function to initialize a map
function initMap(mapId, center, markers) {
    let map = L.map(mapId, {
        attributionControl: false // Remove attribution
    }).setView(center, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '' // Empty attribution string
    }).addTo(map);
    
    // Add markers
    markers.forEach(function(shop) {
        // Create popup content with product information
        let popupContent = `
            <div class="shop-popup">
                <h3>${shop.name}</h3>
                <p>${shop.address}</p>
                <div class="products-section">
                    <h4>Available Products:</h4>
                    ${shop.products.map(product => `
                        <div class="product-item">
                            <h5>${product.name}</h5>
                            <p>${product.description}</p>
                            <div class="product-details">
                                <div class="advantages">
                                    <h6>Advantages:</h6>
                                    <ul>
                                        ${product.advantages.map(adv => `<li>${adv}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="disadvantages">
                                    <h6>Disadvantages:</h6>
                                    <ul>
                                        ${product.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="showShopDetail(${JSON.stringify(shop).replace(/"/g, '&quot;')})" class="view-details-btn">View Full Details</button>
            </div>
        `;
        
        let marker = L.marker(shop.coordinates)
            .addTo(map)
            .bindPopup(popupContent, {
                maxWidth: 300,
                maxHeight: 400
            });
            
        marker.on('click', function() {
            showShopDetail(shop);
        });
    });
    
    // Fix map display issue after initializing
    setTimeout(function() {
        map.invalidateSize();
    }, 100);
    
    return map;
}

// Function to populate shop list
function populateShopList(listId, shops) {
    let list = document.getElementById(listId);
    
    shops.forEach(function(shop) {
        let shopItem = document.createElement("div");
        shopItem.className = "shop-item";
        shopItem.innerHTML = `
            <h3>${shop.name}</h3>
            <p>${shop.address}</p>
            <p>${shop.hours}</p>
        `;
        
        shopItem.addEventListener("click", function() {
            showShopDetail(shop);
        });
        
        list.appendChild(shopItem);
    });
}

// Function to show shop detail
function showShopDetail(shop) {
    currentShop = shop;
    
    // Update shop details
    document.getElementById("shop-name").textContent = shop.name;
    document.getElementById("shop-img").src = shop.image;
    document.getElementById("shop-address").textContent = shop.address;
    document.getElementById("shop-hours").textContent = `Hours: ${shop.hours}`;
    document.getElementById("shop-contact").textContent = `Contact: ${shop.contact}`;
    document.getElementById("shop-description").textContent = shop.description;
    
    // Create and display products section
    let productsHTML = `
        <div class="products-container">
            <h3>Available Products</h3>
            ${shop.products.map(product => `
                <div class="product-card">
                    <h4>${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        <div class="advantages">
                            <h5>Advantages:</h5>
                            <ul>
                                ${product.advantages.map(adv => `<li>${adv}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="disadvantages">
                            <h5>Disadvantages:</h5>
                            <ul>
                                ${product.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add products section to shop details
    document.getElementById("shop-description").insertAdjacentHTML('afterend', productsHTML);
    
    // Show shop detail screen
    showScreen("shop-detail");
    
    // Initialize or update detail map
    if (!detailMap) {
        detailMap = L.map("detail-map", {
            attributionControl: false
        }).setView(shop.coordinates, 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: ''
        }).addTo(detailMap);
    } else {
        detailMap.setView(shop.coordinates, 16);
    }
    
    // Add marker for current shop
    L.marker(shop.coordinates)
        .addTo(detailMap)
        .bindPopup(`<b>${shop.name}</b><br>${shop.address}`)
        .openPopup();
    
    // Fix map display issue
    setTimeout(function() {
        detailMap.invalidateSize();
    }, 100);
}

// Function to show product details in a popup
function showProductDetails(product) {
    // Create modal for product details
    let modalHTML = `
        <div id="product-modal" class="modal">
            <div class="modal-content product-modal-content">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <button class="close-modal" onclick="closeProductModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        <div class="advantages">
                            <h5>Advantages:</h5>
                            <ul>
                                ${product.advantages.map(adv => `<li>${adv}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="disadvantages">
                            <h5>Disadvantages:</h5>
                            <ul>
                                ${product.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    document.getElementById("product-modal").style.display = "flex";
}

// Function to close product modal
function closeProductModal() {
    let modal = document.getElementById("product-modal");
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    let modal = document.getElementById("product-modal");
    if (modal && event.target === modal) {
        closeProductModal();
    }
});