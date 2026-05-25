// Auth Management
const Auth = {
    currentUser: null,

    // Initialize auth
    init() {
        // Check for existing session
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                // Get additional user data from database
                firebase.database().ref(`users/${user.uid}`).once('value').then(snapshot => {
                    const userData = snapshot.val();
                    if (userData) {
                        const userType = userData.userType || 'customer'; // Default to customer if no type specified
                        localStorage.setItem('userType', userType);
                        this.redirectToUserDashboard(userType);
                    } else {
                        // If no user data found, still allow login but with default type
                        localStorage.setItem('userType', 'customer');
                        this.redirectToUserDashboard('customer');
                    }
                }).catch(error => {
                    console.error('Error fetching user data:', error);
                    // On error, still allow login but with default type
                    localStorage.setItem('userType', 'customer');
                    this.redirectToUserDashboard('customer');
                });
            } else {
                this.currentUser = null;
                localStorage.removeItem('userType');
                showPage('auth');
            }
        });
    },

    // Admin Login
    async adminLogin(username, password) {
        try {
            // Check admin credentials
            if (username === 'khamyr' && password === 'longclaw') {
                // Set admin session
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('isAdminLoggedIn', 'true');
                this.redirectToUserDashboard('admin');
                showToast('Admin login successful!', 'success');
            } else {
                throw new Error('Invalid admin credentials');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            showToast('Invalid admin credentials. Please try again.', 'error');
        }
    },

    // Login user
    async login(email, password, userType) {
        try {
            // Authenticate with Firebase
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const userData = await DB.getUserById(userCredential.user.uid);
            
            // If no user data found in any collection, create basic user data
            if (!userData) {
                const basicUserData = {
                    userId: userCredential.user.uid,
                    email: email,
                    firstName: 'User',
                    lastName: 'User',
                    middleName: '',
                    phone: '',
                    address: '',
                    age: 0,
                    userType: userType || 'customer',
                    photoUrl: '',
                    status: 'active',
                    isVerified: true,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };
                
                // Save basic user data
                await DB.createUser(basicUserData);
                this.currentUser = userCredential.user;
                localStorage.setItem('userType', basicUserData.userType);
                this.redirectToUserDashboard(basicUserData.userType);
                showToast('Login successful!', 'success');
                return;
            }

            this.currentUser = userCredential.user;
            
            // Store user type if available, otherwise use a default
            const actualUserType = userData.userType || userType || 'customer';
            localStorage.setItem('userType', actualUserType);
            
            this.redirectToUserDashboard(actualUserType);
            showToast('Login successful!', 'success');
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please check your credentials and try again.';
            
            if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showToast(errorMessage, 'error');
            throw error;
        }
    },

    // Register user
    async register(userData, userType) {
        try {
            // 1. Create auth user
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(
                userData.email,
                userData.password
            );

            // 2. Get user ID
            const userId = userCredential.user.uid;

            // 3. Upload profile photo
            let photoUrl = '';
            if (userData.photo) {
                const photoRef = firebase.storage().ref(`users/${userId}/profile.jpg`);
                await photoRef.put(userData.photo);
                photoUrl = await photoRef.getDownloadURL();
            }

            // 4. Upload additional photos for riders
            let vehiclePhotoUrl = '';
            let licensePhotoUrl = '';
            if (userType === 'rider') {
                if (userData.vehiclePhoto) {
                    const vehicleRef = firebase.storage().ref(`users/${userId}/vehicle.jpg`);
                    await vehicleRef.put(userData.vehiclePhoto);
                    vehiclePhotoUrl = await vehicleRef.getDownloadURL();
                }
                if (userData.licensePhoto) {
                    const licenseRef = firebase.storage().ref(`users/${userId}/license.jpg`);
                    await licenseRef.put(userData.licensePhoto);
                    licensePhotoUrl = await licenseRef.getDownloadURL();
                }
            }

            // 5. Create base user data
            const userDataForDb = {
                userId: userId,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                middleName: userData.middleName || '',
                phone: userData.phone,
                address: userData.address,
                age: parseInt(userData.age),
                userType: userType,
                photoUrl: photoUrl,
                status: 'approved',
                isVerified: true,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            // 6. Add rider-specific data
            if (userType === 'rider') {
                userDataForDb.vehicleModel = userData.vehicleModel;
                userDataForDb.licensePlate = userData.licensePlate;
                userDataForDb.vehiclePhotoUrl = vehiclePhotoUrl;
                userDataForDb.licensePhotoUrl = licensePhotoUrl;
                userDataForDb.isAvailable = false;
            }

            // 7. Save to database using DB.createUser
            await DB.createUser(userDataForDb);

            // 8. Update auth profile
            await userCredential.user.updateProfile({
                displayName: `${userData.firstName} ${userData.lastName}`,
                photoURL: photoUrl
            });

            // 9. Sign out user
            await firebase.auth().signOut();

            showToast('Registration successful! You can now log in.', 'success');
            return true;

        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Registration failed. Please try again.', 'error');
            throw error;
        }
    },

    // Logout user
    async logout() {
        try {
            if (localStorage.getItem('isAdminLoggedIn')) {
                // Clear admin session
                localStorage.removeItem('isAdminLoggedIn');
            } else {
                // Regular user logout
                await firebase.auth().signOut();
            }
            this.currentUser = null;
            localStorage.removeItem('userType');
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Error logging out. Please try again.', 'error');
        }
    },

    // Redirect to appropriate dashboard
    redirectToUserDashboard(userType) {
        const authContainer = document.getElementById('auth-container');
        const customerContainer = document.getElementById('customer-container');
        const riderContainer = document.getElementById('rider-container');
        const adminContainer = document.getElementById('admin-container');

        // Hide all containers
        authContainer.classList.remove('active');
        customerContainer.classList.remove('active');
        riderContainer.classList.remove('active');
        adminContainer.classList.remove('active');

        // Show appropriate container
        switch (userType) {
            case 'customer':
                customerContainer.classList.add('active');
                if (typeof Rides !== 'undefined') {
                    Rides.init();
                }
                break;
            case 'rider':
                riderContainer.classList.add('active');
                if (typeof Rides !== 'undefined') {
                    Rides.init();
                }
                break;
            case 'admin':
                adminContainer.classList.add('active');
                if (typeof AdminDashboard !== 'undefined') {
                    AdminDashboard.init();
                }
                break;
        }
    }
}; 