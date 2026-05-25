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
            // First, create the user in the users collection
            await this.usersRef.child(userData.userId).set({
                userId: userData.userId || '',
                email: userData.email || '',
                firstName: userData.firstName || 'User',
                lastName: userData.lastName || 'User',
                middleName: userData.middleName || '',
                phone: userData.phone || '',
                address: userData.address || '',
                age: parseInt(userData.age) || 0,
                userType: userData.userType || 'customer',
                photoUrl: userData.photoUrl || '',
                status: userData.status || 'active',
                isVerified: userData.isVerified || false,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });

            // Then, based on user type, create the specific profile
            if (userData.userType === 'rider') {
                await this.ridersRef.child(userData.userId).set({
                    userId: userData.userId || '',
                    email: userData.email || '',
                    firstName: userData.firstName || 'User',
                    lastName: userData.lastName || 'User',
                    middleName: userData.middleName || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    age: parseInt(userData.age) || 0,
                    userType: 'rider',
                    photoUrl: userData.photoUrl || '',
                    status: userData.status || 'active',
                    isVerified: userData.isVerified || false,
                    vehicleModel: userData.vehicleModel || '',
                    licensePlate: userData.licensePlate || '',
                    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
                    licensePhotoUrl: userData.licensePhotoUrl || '',
                    isAvailable: false,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                await this.customersRef.child(userData.userId).set({
                    userId: userData.userId || '',
                    email: userData.email || '',
                    firstName: userData.firstName || 'User',
                    lastName: userData.lastName || 'User',
                    middleName: userData.middleName || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    age: parseInt(userData.age) || 0,
                    userType: 'customer',
                    photoUrl: userData.photoUrl || '',
                    status: userData.status || 'active',
                    isVerified: userData.isVerified || false,
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
            // First try to get from users collection
            let userData = await this.usersRef.child(userId).once('value');
            let user = userData.val();

            // If not found in users, check riders collection
            if (!user) {
                userData = await this.ridersRef.child(userId).once('value');
                user = userData.val();
                if (user) {
                    user.userType = 'rider';
                }
            }

            // If still not found, check customers collection
            if (!user) {
                userData = await this.customersRef.child(userId).once('value');
                user = userData.val();
                if (user) {
                    user.userType = 'customer';
                }
            }

            // If user is found in any collection, ensure it has a userType
            if (user && !user.userType) {
                user.userType = 'customer'; // Default to customer if no type specified
            }

            return user;
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