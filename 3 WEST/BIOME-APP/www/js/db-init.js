(function(window) {
    // Initialize Firebase and get database reference
    let db;
    let auth;

    // Wait for Firebase to initialize
    async function initializeFirebase() {
        try {
            if (!firebase) {
                throw new Error('Firebase SDK not loaded');
            }

            if (!firebase.apps.length) {
                if (!firebaseConfig) {
                    throw new Error('Firebase configuration not found');
                }
                firebase.initializeApp(firebaseConfig);
            }

            auth = firebase.auth();
            db = firebase.firestore();

            if (!db) {
                throw new Error('Failed to initialize Firestore');
            }

            // Ensure we're authenticated (anonymously if needed)
            if (!auth.currentUser) {
                await auth.signInAnonymously();
                console.log('Signed in anonymously for database operations');
            }

            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            throw error;
        }
    }

    // Initialize Firestore collections and sample data
    async function initializeDatabase() {
        try {
            // Ensure Firebase is initialized and we're authenticated
            await initializeFirebase();
            
            console.log('Starting database initialization...');
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Categories for products
            const categories = [
                {
                    id: 'fresh_fish',
                    name: 'Fresh Fish',
                    description: 'Fresh catch from Bantayan waters',
                    icon: '🐟',
                    image: '', // Will be updated with actual image URL
                    banner: '', // Will be updated with actual banner URL
                    parentId: null,
                    subCategories: [],
                    metadata: {
                        seoTitle: 'Fresh Fish from Bantayan Island',
                        seoDescription: 'High-quality fresh fish directly from Bantayan Island waters',
                        keywords: ['fresh fish', 'seafood', 'bantayan', 'local catch']
                    },
                    stats: {
                        productCount: 0,
                        vendorCount: 0,
                        orderCount: 0
                    },
                    seasonality: {
                        startMonth: 1, // Available all year
                        endMonth: 12,
                        isSeasonal: false
                    },
                    isActive: true,
                    order: 1,
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'dried_fish',
                    name: 'Dried Fish',
                    description: 'Traditional dried fish products',
                    icon: '🐠',
                    image: '',
                    banner: '',
                    parentId: null,
                    subCategories: [],
                    metadata: {
                        seoTitle: 'Traditional Dried Fish from Bantayan',
                        seoDescription: 'Authentic dried fish products from Bantayan Island',
                        keywords: ['dried fish', 'preserved fish', 'bantayan', 'traditional']
                    },
                    stats: {
                        productCount: 0,
                        vendorCount: 0,
                        orderCount: 0
                    },
                    seasonality: {
                        startMonth: 1,
                        endMonth: 12,
                        isSeasonal: false
                    },
                    isActive: true,
                    order: 2,
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'seafood',
                    name: 'Seafood',
                    description: 'Fresh shellfish and crustaceans',
                    icon: '🦐',
                    image: '',
                    banner: '',
                    parentId: null,
                    subCategories: [],
                    metadata: {
                        seoTitle: 'Fresh Seafood from Bantayan Island',
                        seoDescription: 'Fresh shellfish and crustaceans from Bantayan waters',
                        keywords: ['seafood', 'shellfish', 'crustaceans', 'bantayan', 'fresh']
                    },
                    stats: {
                        productCount: 0,
                        vendorCount: 0,
                        orderCount: 0
                    },
                    seasonality: {
                        startMonth: 1,
                        endMonth: 12,
                        isSeasonal: false
                    },
                    isActive: true,
                    order: 3,
                    createdAt: timestamp,
                    updatedAt: timestamp
                }
            ];

            console.log('Creating categories...');
            for (const category of categories) {
                try {
                    await db.collection('categories').doc(category.id).set(category);
                    console.log(`Created category: ${category.name}`);
                } catch (error) {
                    console.error(`Error creating category ${category.name}:`, error);
                    throw error;
                }
            }

            // Create market locations
            console.log('Creating markets...');
            const markets = [
                {
                    id: 'bantayan_public_market',
                    name: 'Bantayan Public Market',
                    description: 'The main public market of Bantayan Island',
                    location: {
                        address: 'Public Market, Poblacion, Bantayan',
                        coordinates: {
                            latitude: 11.1644,
                            longitude: 123.7137
                        }
                    },
                    operatingHours: {
                        open: '04:00',
                        close: '19:00'
                    },
                    sections: ['Fish Section', 'Dried Fish Section', 'Seafood Section'],
                    images: [], // To be added later
                    isActive: true,
                    createdAt: timestamp,
                    updatedAt: timestamp
                }
            ];

            for (const market of markets) {
                try {
                    await db.collection('markets').doc(market.id).set(market);
                    console.log(`Created market: ${market.name}`);
                } catch (error) {
                    console.error(`Error creating market ${market.name}:`, error);
                    throw error;
                }
            }

            // Create product templates
            console.log('Creating product templates...');
            const productTemplates = [
                {
                    id: 'bangus',
                    categoryId: 'fresh_fish',
                    name: 'Bangus (Milkfish)',
                    description: 'Fresh milkfish, perfect for grilling',
                    price: {
                        amount: 150,
                        unit: 'per kg'
                    },
                    stock: {
                        available: 100,
                        unit: 'kg'
                    },
                    images: [], // To be added later
                    isAvailable: true,
                    ratings: {
                        average: 0,
                        count: 0
                    },
                    tags: ['fish', 'fresh', 'milkfish', 'bangus'],
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'dried_danggit',
                    categoryId: 'dried_fish',
                    name: 'Dried Danggit',
                    description: 'Sun-dried rabbitfish, a local specialty',
                    price: {
                        amount: 600,
                        unit: 'per kg'
                    },
                    stock: {
                        available: 50,
                        unit: 'kg'
                    },
                    images: [], // To be added later
                    isAvailable: true,
                    ratings: {
                        average: 0,
                        count: 0
                    },
                    tags: ['dried', 'danggit', 'rabbitfish'],
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'fresh_shrimp',
                    categoryId: 'seafood',
                    name: 'Fresh Shrimp',
                    description: 'Locally caught fresh shrimp',
                    price: {
                        amount: 300,
                        unit: 'per kg'
                    },
                    stock: {
                        available: 30,
                        unit: 'kg'
                    },
                    images: [], // To be added later
                    isAvailable: true,
                    ratings: {
                        average: 0,
                        count: 0
                    },
                    tags: ['seafood', 'shrimp', 'fresh'],
                    createdAt: timestamp,
                    updatedAt: timestamp
                }
            ];

            for (const template of productTemplates) {
                try {
                    await db.collection('productTemplates').doc(template.id).set({
                        ...template,
                        createdAt: timestamp,
                        updatedAt: timestamp
                    });
                    console.log(`Created product template: ${template.name}`);
                } catch (error) {
                    console.error(`Error creating product template ${template.name}:`, error);
                    throw error;
                }
            }

            // Create tour package templates
            console.log('Creating tour packages...');
            const tourPackages = [
                {
                    id: 'island_hopping',
                    name: 'Island Hopping Adventure',
                    description: 'Visit Virgin Island, Hilantagaan, and other nearby islands',
                    duration: '8 hours',
                    includes: [
                        'Boat rental',
                        'Life vests',
                        'Packed lunch',
                        'Snorkeling gear'
                    ],
                    excludes: [
                        'Personal expenses',
                        'Additional activities',
                        'Travel insurance'
                    ],
                    priceRange: {
                        min: 1500,
                        max: 2500
                    },
                    maxCapacity: 15,
                    images: [], // To be added later
                    meetingPoint: {
                        address: 'Bantayan Island Port',
                        coordinates: {
                            latitude: 11.1644,
                            longitude: 123.7137
                        }
                    },
                    isActive: true,
                    ratings: {
                        average: 0,
                        count: 0
                    },
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'heritage_tour',
                    name: 'Bantayan Heritage Tour',
                    description: 'Explore historical sites and local culture',
                    duration: '4 hours',
                    includes: [
                        'Transportation',
                        'Guide fee',
                        'Entrance fees',
                        'Snacks'
                    ],
                    excludes: [
                        'Personal expenses',
                        'Additional activities',
                        'Lunch'
                    ],
                    priceRange: {
                        min: 800,
                        max: 1200
                    },
                    maxCapacity: 10,
                    images: [], // To be added later
                    meetingPoint: {
                        address: 'Bantayan Church Plaza',
                        coordinates: {
                            latitude: 11.1644,
                            longitude: 123.7137
                        }
                    },
                    isActive: true,
                    ratings: {
                        average: 0,
                        count: 0
                    },
                    createdAt: timestamp,
                    updatedAt: timestamp
                }
            ];

            for (const package of tourPackages) {
                try {
                    await db.collection('tourPackages').doc(package.id).set({
                        ...package,
                        createdAt: timestamp,
                        updatedAt: timestamp
                    });
                    console.log(`Created tour package: ${package.name}`);
                } catch (error) {
                    console.error(`Error creating tour package ${package.name}:`, error);
                    throw error;
                }
            }

            // Create service categories
            console.log('Creating service categories...');
            const serviceCategories = [
                {
                    id: 'transportation',
                    name: 'Transportation',
                    description: 'Local transportation services',
                    types: ['Tricycle', 'Motorcycle', 'Van', 'Boat'],
                    icon: '🚗',
                    isActive: true,
                    createdAt: timestamp,
                    updatedAt: timestamp
                },
                {
                    id: 'guide_services',
                    name: 'Guide Services',
                    description: 'Professional guide services',
                    types: ['Tour Guide', 'Market Guide', 'Diving Instructor'],
                    icon: '👤',
                    isActive: true,
                    createdAt: timestamp,
                    updatedAt: timestamp
                }
            ];

            for (const category of serviceCategories) {
                try {
                    await db.collection('serviceCategories').doc(category.id).set(category);
                    console.log(`Created service category: ${category.name}`);
                } catch (error) {
                    console.error(`Error creating service category ${category.name}:`, error);
                    throw error;
                }
            }

            // Create initial admin user
            console.log('Creating admin user...');
            const adminUser = {
                id: 'admin',
                email: 'admin@biome.com',
                displayName: 'Admin',
                role: 'admin',
                isActive: true,
                createdAt: timestamp,
                updatedAt: timestamp
            };

            try {
                await db.collection('users').doc(adminUser.id).set(adminUser);
                console.log('Created admin user');
            } catch (error) {
                console.error('Error creating admin user:', error);
                throw error;
            }

            console.log('Database initialized successfully!');
            return true;
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    // Function to check if collections are empty
    async function isDatabaseEmpty() {
        try {
            // Ensure Firebase is initialized and we're authenticated
            await initializeFirebase();
            
            const collections = [
                'users',
                'categories',
                'markets',
                'productTemplates',
                'tourPackages',
                'serviceCategories'
            ];

            for (const collection of collections) {
                const snapshot = await db.collection(collection).limit(1).get();
                if (!snapshot.empty) {
                    console.log(`Collection ${collection} is not empty`);
                    return false;
                }
                console.log(`Collection ${collection} is empty`);
            }
            return true;
        } catch (error) {
            console.error('Error checking if database is empty:', error);
            throw error;
        }
    }

    // Initialize database if empty
    async function checkAndInitializeDatabase() {
        try {
            console.log('Checking database status...');
            const isEmpty = await isDatabaseEmpty();
            if (isEmpty) {
                console.log('Database is empty, starting initialization...');
                return await initializeDatabase();
            }
            console.log('Database already initialized');
            return true;
        } catch (error) {
            console.error('Error checking/initializing database:', error);
            throw error;
        }
    }

    // Immediately attach functions to window object
    window.initializeDatabase = initializeDatabase;
    window.isDatabaseEmpty = isDatabaseEmpty;
    window.checkAndInitializeDatabase = checkAndInitializeDatabase;
    
    // Log confirmation that functions are attached
    console.log('Database initialization functions loaded:', {
        initializeDatabase: typeof window.initializeDatabase === 'function',
        isDatabaseEmpty: typeof window.isDatabaseEmpty === 'function',
        checkAndInitializeDatabase: typeof window.checkAndInitializeDatabase === 'function'
    });

})(window); 