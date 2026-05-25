// Helper to generate unique IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Firebase Realtime Database service
const DB = {
    // Initialize database
    init() {
        // Initialize admin user if it doesn't exist
        this.initAdmin();
    },
    
    // Initialize admin user
    async initAdmin() {
        const adminRef = database.ref('users');
        const snapshot = await adminRef.orderByChild('userType').equalTo('admin').once('value');
        
        if (!snapshot.exists()) {
            const admin = {
                id: generateId(),
                username: 'admin',
                password: 'admin123', // In a real app, this would be hashed
                userType: 'admin',
                name: 'Admin User',
                createdAt: new Date().toISOString()
            };
            
            await adminRef.push(admin);
        }
    },
    
    // CRUD operations for users
    async getUsers() {
        const snapshot = await database.ref('users').once('value');
        return snapshot.val() || {};
    },
    
    async getUserById(id) {
        const snapshot = await database.ref('users').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async getUserByEmail(email) {
        const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async createUser(userData) {
        const newUser = {
            id: generateId(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        const userRef = await database.ref('users').push(newUser);
        return { ...newUser, key: userRef.key };
    },
    
    async updateUser(id, updates) {
        const snapshot = await database.ref('users').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        if (data) {
            const key = Object.keys(data)[0];
            await database.ref(`users/${key}`).update(updates);
            return { ...data[key], ...updates };
        }
        return null;
    },
    
    // CRUD operations for riders
    async getRiders() {
        const snapshot = await database.ref('riders').once('value');
        return snapshot.val() || {};
    },
    
    async getRiderById(id) {
        const snapshot = await database.ref('riders').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async getRiderByUserId(userId) {
        const snapshot = await database.ref('riders').orderByChild('userId').equalTo(userId).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async createRider(riderData) {
        const newRider = {
            id: generateId(),
            ...riderData,
            isAvailable: false,
            isApproved: false,
            rating: 5,
            createdAt: new Date().toISOString()
        };
        
        const riderRef = await database.ref('riders').push(newRider);
        return { ...newRider, key: riderRef.key };
    },
    
    async updateRider(id, updates) {
        const snapshot = await database.ref('riders').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        if (data) {
            const key = Object.keys(data)[0];
            await database.ref(`riders/${key}`).update(updates);
            return { ...data[key], ...updates };
        }
        return null;
    },
    
    // CRUD operations for customers
    async getCustomers() {
        const snapshot = await database.ref('customers').once('value');
        return snapshot.val() || {};
    },
    
    async getCustomerByUserId(userId) {
        const snapshot = await database.ref('customers').orderByChild('userId').equalTo(userId).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async createCustomer(customerData) {
        const newCustomer = {
            id: generateId(),
            ...customerData,
            rating: 5,
            createdAt: new Date().toISOString()
        };
        
        const customerRef = await database.ref('customers').push(newCustomer);
        return { ...newCustomer, key: customerRef.key };
    },
    
    // CRUD operations for rides
    async getRides() {
        const snapshot = await database.ref('rides').once('value');
        return snapshot.val() || {};
    },
    
    async getRideById(id) {
        const snapshot = await database.ref('rides').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        return data ? Object.values(data)[0] : null;
    },
    
    async getRidesByCustomerId(customerId) {
        const snapshot = await database.ref('rides').orderByChild('customerId').equalTo(customerId).once('value');
        return snapshot.val() || {};
    },
    
    async getPendingRideRequests() {
        const snapshot = await database.ref('rides').orderByChild('status').equalTo('requested').once('value');
        return snapshot.val() || {};
    },
    
    async createRide(rideData) {
        const newRide = {
            id: generateId(),
            ...rideData,
            status: 'requested',
            createdAt: new Date().toISOString()
        };
        
        const rideRef = await database.ref('rides').push(newRide);
        return { ...newRide, key: rideRef.key };
    },
    
    async updateRide(id, updates) {
        const snapshot = await database.ref('rides').orderByChild('id').equalTo(id).once('value');
        const data = snapshot.val();
        if (data) {
            const key = Object.keys(data)[0];
            await database.ref(`rides/${key}`).update(updates);
            return { ...data[key], ...updates };
        }
        return null;
    },
    
    // Real-time listeners
    onRideRequest(callback) {
        return database.ref('rides')
            .orderByChild('status')
            .equalTo('requested')
            .on('child_added', (snapshot) => {
                callback(snapshot.val());
            });
    },
    
    onRideUpdate(rideId, callback) {
        return database.ref('rides')
            .orderByChild('id')
            .equalTo(rideId)
            .on('child_changed', (snapshot) => {
                callback(snapshot.val());
            });
    },
    
    onRiderStatusUpdate(riderId, callback) {
        return database.ref('riders')
            .orderByChild('id')
            .equalTo(riderId)
            .on('child_changed', (snapshot) => {
                callback(snapshot.val());
            });
    }
}; 