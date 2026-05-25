// Helper to generate unique IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Firebase Database Implementation
const DB = {
    // References
    usersRef: firebase.database().ref('users'),
    ridesRef: firebase.database().ref('rides'),
    ridersRef: firebase.database().ref('riders'),
    customersRef: firebase.database().ref('customers'),
    passwordResetsRef: firebase.database().ref('passwordResets'),

    // User Management
    async createUser(userData) {
        try {
            // Create user in the users collection
            await this.usersRef.child(userData.userId).set({
                ...userData,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });

            // If it's a rider, create rider profile
            if (userData.userType === 'rider') {
                await this.ridersRef.child(userData.userId).set({
                    userId: userData.userId,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    isAvailable: false,
                    vehicleModel: userData.vehicleModel,
                    licensePlate: userData.licensePlate,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            }
            // If it's a customer, create customer profile
            else if (userData.userType === 'customer') {
                await this.customersRef.child(userData.userId).set({
                    userId: userData.userId,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            }

            return userData;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const snapshot = await this.usersRef.child(userId).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    // Rider Management
    async updateRiderStatus(riderId, isAvailable) {
        try {
            await this.ridersRef.child(riderId).update({
                isAvailable: isAvailable,
                lastUpdated: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error updating rider status:', error);
            return false;
        }
    },

    async updateRiderLocation(riderId, lat, lng) {
        try {
            await this.ridersRef.child(riderId).update({
                currentLat: lat,
                currentLng: lng,
                lastLocationUpdate: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error updating rider location:', error);
            return false;
        }
    },

    // Ride Management
    async createRide(rideData) {
        try {
            const newRideRef = this.ridesRef.push();
            const rideId = newRideRef.key;
            
            await newRideRef.set({
                ...rideData,
                rideId: rideId,
                status: 'requested',
                requestedAt: firebase.database.ServerValue.TIMESTAMP
            });

            return { ...rideData, rideId };
        } catch (error) {
            console.error('Error creating ride:', error);
            throw error;
        }
    },

    async updateRideStatus(rideId, status, updates = {}) {
        try {
            await this.ridesRef.child(rideId).update({
                ...updates,
                status: status,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error updating ride status:', error);
            return false;
        }
    },

    // Real-time Listeners
    onRideUpdated(rideId, callback) {
        return this.ridesRef.child(rideId).on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    onRiderLocationUpdated(riderId, callback) {
        return this.ridersRef.child(riderId).on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    onAvailableRidersUpdated(callback) {
        return this.ridersRef
            .orderByChild('isAvailable')
            .equalTo(true)
            .on('value', (snapshot) => {
                const riders = snapshot.val();
                callback(riders ? Object.values(riders) : []);
            });
    },

    // Admin Functions
    async getAllRiders() {
        try {
            const snapshot = await this.ridersRef.once('value');
            return snapshot.val() ? Object.values(snapshot.val()) : [];
        } catch (error) {
            console.error('Error getting riders:', error);
            return [];
        }
    },

    async getAllCustomers() {
        try {
            const snapshot = await this.customersRef.once('value');
            return snapshot.val() ? Object.values(snapshot.val()) : [];
        } catch (error) {
            console.error('Error getting customers:', error);
            return [];
        }
    },

    async deleteUser(userId, userType) {
        try {
            // Remove from users collection
            await this.usersRef.child(userId).remove();
            
            // Remove from respective type collection
            if (userType === 'rider') {
                await this.ridersRef.child(userId).remove();
            } else if (userType === 'customer') {
                await this.customersRef.child(userId).remove();
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },

    // Password Reset
    async createPasswordReset(resetData) {
        try {
            const newResetRef = this.passwordResetsRef.push();
            await newResetRef.set({
                ...resetData,
                status: 'pending',
                requestedAt: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error creating password reset:', error);
            return false;
        }
    },

    // Cleanup
    cleanup() {
        // Remove all listeners
        this.ridesRef.off();
        this.ridersRef.off();
        this.usersRef.off();
        this.customersRef.off();
        this.passwordResetsRef.off();
    }
}; 