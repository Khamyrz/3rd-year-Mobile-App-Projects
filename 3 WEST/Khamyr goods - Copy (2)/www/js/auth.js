// Auth functionality
const Auth = {
    // State
    currentUser: null,
    
    // Initialize auth functionality
    init() {
        console.log('Initializing Auth module...');
        
        // Initialize database
        DB.init();
        
        // Check for existing session
        this.checkSession();
    },
    
    // Check for existing user session
    checkSession() {
        // Get user from local storage
        const userId = localStorage.getItem('currentUserId');
        const userType = localStorage.getItem('user_type');
        
        if (userId) {
            const user = DB.getUserById(userId);
            
            if (user) {
                this.currentUser = user;
                this.redirectBasedOnUserType(user, userType);
            } else {
                localStorage.removeItem('currentUserId');
                localStorage.removeItem('user_type');
                showPage('auth-container');
                showLoginSelection();
            }
        } else {
            showPage('auth-container');
            showLoginSelection();
        }
    },
    
    // Register a new user
    async register(userData, userType) {
        try {
            // Check if user already exists
            const existingUser = DB.getUserByEmail(userData.email);
            
            if (existingUser) {
                showToast('A user with this email already exists', 'error');
                return;
            }
            
            // Check age requirement
            if (parseInt(userData.age) < 18) {
                showToast('You must be at least 18 years old to register', 'error');
                return;
            }
            
            // Create user
            const user = DB.createUser({
                ...userData,
                userType
            });
            
            if (userType === 'rider') {
                // Create rider profile
                const rider = DB.createRider({
                    userId: user.id,
                    photoUrl: userData.photoUrl,
                    vehiclePhotoUrl: userData.vehiclePhotoUrl,
                    licensePhotoUrl: userData.licensePhotoUrl,
                    currentLat: null,
                    currentLng: null,
                    isApproved: false,
                    isAvailable: false,
                    vehicleModel: userData.vehicleModel || '',
                    licensePlate: userData.licensePlate || ''
                });
                
                // Show success message
                showToast('Registration successful! Please wait for admin approval before logging in.', 'success');
                
                // Clear form and show login selection after delay
                setTimeout(() => {
                    // Reset form
                    document.getElementById('rider-registration-form').reset();
                    
                    // Clear file preview
                    const previews = ['rider-photo-preview', 'vehicle-photo-preview', 'license-photo-preview'];
                    previews.forEach(previewId => {
                        const preview = document.getElementById(previewId);
                        if (preview) {
                            preview.style.backgroundImage = '';
                            preview.innerHTML = '📷 Upload Photo';
                        }
                    });
                    
                    // Show login selection
                    document.querySelectorAll('.auth-form').forEach(form => {
                        form.classList.remove('active');
                    });
                    document.getElementById('login-selection').classList.add('active');
                }, 3000);
                
            } else if (userType === 'customer') {
                // Create customer profile
                const customer = DB.createCustomer({
                    userId: user.id,
                    photoUrl: userData.photoUrl,
                    currentLat: null,
                    currentLng: null
                });
                
                showToast('Registration successful! You can now login.', 'success');
                
                // Clear form and show login selection after delay
                setTimeout(() => {
                    // Reset form
                    document.getElementById('customer-registration-form').reset();
                    
                    // Clear file preview
                    const preview = document.getElementById('customer-photo-preview');
                    if (preview) {
                        preview.style.backgroundImage = '';
                        preview.innerHTML = '📷 Upload Photo';
                    }
                    
                    // Show login selection
                    document.querySelectorAll('.auth-form').forEach(form => {
                        form.classList.remove('active');
                    });
                    document.getElementById('login-selection').classList.add('active');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('An error occurred during registration. Please try again.', 'error');
        }
    },
    
    // Login functionality
    login(email, password, userType) {
        try {
            // Check if user exists
            const user = DB.getUserByEmail(email);
            
            if (!user || user.password !== password || user.userType !== userType) {
                showToast('Invalid email or password', 'error');
                return;
            }
            
            // For riders, check approval status
            if (userType === 'rider') {
                const rider = DB.getRiderByUserId(user.id);
                if (!rider) {
                    showToast('Rider profile not found', 'error');
                    return;
                }
                
                if (!rider.isApproved) {
                    showToast('Your account is still pending admin approval. Please wait for approval before logging in.', 'error');
                    return;
                }
            }
            
            // Set current user and type
            this.currentUser = user;
            localStorage.setItem('currentUserId', user.id);
            localStorage.setItem('user_type', userType);
            
            // Redirect based on user type
            this.redirectBasedOnUserType(user, userType);
            
            // Show welcome message
            showToast(`Welcome back, ${user.firstName || user.name}!`, 'success');
            
        } catch (error) {
            console.error('Login error:', error);
            showToast('An error occurred during login. Please try again.', 'error');
        }
    },
    
    // Admin login
    adminLogin(username, password) {
        // Find admin user
        const users = DB.getUsers();
        const admin = users.find(u => u.username === username && u.userType === 'admin');
        
        if (!admin || admin.password !== password) {
            showToast('Invalid username or password', 'error');
            return;
        }
        
        // Set current user
        this.currentUser = admin;
        localStorage.setItem('currentUserId', admin.id);
        
        // Show admin dashboard
        showPage('admin-container');
        
        // Initialize admin dashboard
        AdminDashboard.init();
        
        // Show welcome message
        showToast(`Welcome, Admin ${admin.name || admin.username}!`, 'success');
    },
    
    // Logout functionality
    logout() {
        // Clear user data
        this.currentUser = null;
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
        
        // Reset UI state
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            form.style.display = 'none';
        });
        
        const loginSelection = document.getElementById('login-selection');
        if (loginSelection) {
            loginSelection.style.display = 'block';
            loginSelection.classList.add('active');
        }
        
        // Show login page
        showPage('auth-container');
        updateTabIndicator('login-tab');
        showToast('Logged out successfully', 'success');
    },
    
    // Request password reset
    requestPasswordReset(email, userType) {
        // Create password reset request
        const request = DB.createPasswordReset(email, userType);
        
        if (request) {
            showToast('Password reset request sent to admin. You will be notified once processed.', 'success');
        } else {
            showToast('User not found with this email address', 'error');
        }
    },
    
    // Redirect based on user type
    redirectBasedOnUserType(user, userType) {
        if (!user) return;
        
        if (userType === 'rider') {
            const rider = DB.getRiderByUserId(user.id);
            
            if (rider && rider.isApproved) {
                showPage('rider-container');
                // Initialize rider map
                if (typeof initRiderMap === 'function') {
                    initRiderMap();
                }
            } else {
                showToast('Your account is pending approval from admin.', 'error');
                this.logout();
            }
        } else if (userType === 'customer') {
            showPage('customer-container');
            // Initialize customer map
            if (typeof initCustomerMap === 'function') {
                initCustomerMap();
            }
        } else if (userType === 'admin') {
            showPage('admin-container');
            // Load admin data
            if (typeof AdminDashboard !== 'undefined' && typeof AdminDashboard.loadData === 'function') {
                AdminDashboard.loadData();
            }
        }
    }
}; 