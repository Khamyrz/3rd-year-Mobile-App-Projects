// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // Get user role from Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const role = doc.data().role;
                    // Redirect based on role
                    redirectBasedOnRole(role);
                } else {
                    // If user document doesn't exist, redirect to registration
                    window.location.href = 'register.html';
                }
            })
            .catch((error) => {
                console.error("Error getting user role:", error);
                showNotification('error', 'Error getting user role. Please try again.');
            });
    }
});

// Registration function
async function registerUser(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    
    // Validate form
    if (!fullName || !email || !password || !confirmPassword || !role) {
        showNotification('error', 'Please fill in all required fields');
        return;
    }

    // Validate password
    if (password !== confirmPassword) {
        showNotification('error', 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showNotification('error', 'Password must be at least 6 characters long');
        return;
    }
    
    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            fullName: fullName,
            email: email,
            role: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update user profile
        await user.updateProfile({
            displayName: fullName
        });
        
        // Get additional fields based on role
        const additionalFields = getAdditionalFields(role);
        
        // Validate required additional fields
        if (Object.keys(additionalFields).length > 0) {
            const hasEmptyFields = Object.values(additionalFields).some(value => !value);
            if (hasEmptyFields) {
                showNotification('error', 'Please fill in all required fields for your role');
                return;
            }

            // Save additional fields
            await db.collection(role.toLowerCase() + 's').doc(user.uid).set({
                ...additionalFields,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
        }
        
        showNotification('success', 'Registration successful! Redirecting...');
        
        // Small delay to show the success message before redirect
        setTimeout(() => {
            redirectBasedOnRole(role);
        }, 1500);
        
    } catch (error) {
        console.error("Registration error:", error);
        showNotification('error', error.message);
    }
}

// Login function
async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Set persistence based on "Remember me" checkbox
        const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
        await auth.setPersistence(persistence);
        
        // Sign in user
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        showNotification('success', 'Login successful! Redirecting...');
        
    } catch (error) {
        console.error("Login error:", error);
        showNotification('error', error.message);
    }
}

// Logout function
function logoutUser() {
    auth.signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showNotification('error', 'Error logging out. Please try again.');
        });
}

// Get additional fields based on role
function getAdditionalFields(role) {
    const fields = {};
    
    switch (role.toLowerCase()) {
        case 'vendor':
            fields.storeName = document.getElementById('storeName')?.value;
            fields.businessType = document.getElementById('businessType')?.value;
            break;
        case 'guide':
            fields.specialization = document.getElementById('specialization')?.value;
            fields.experience = document.getElementById('experience')?.value;
            break;
        case 'driver':
            fields.vehicleType = document.getElementById('vehicleType')?.value;
            fields.licenseNumber = document.getElementById('licenseNumber')?.value;
            break;
    }
    
    return fields;
}

// Redirect based on user role
function redirectBasedOnRole(role) {
    const dashboardPaths = {
        tourist: 'dashboards/buyer/dashboard.html',
        vendor: 'dashboards/vendor/dashboard.html',
        guide: 'dashboards/guides/dashboard.html',
        driver: 'dashboards/driver/dashboard.html'
    };

    const path = dashboardPaths[role.toLowerCase()];
    if (path) {
        // Get the base URL
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        // Redirect to the dashboard
        window.location.href = `${baseUrl}/${path}`;
    } else {
        // Redirect to home page if role is not recognized
        window.location.href = `${baseUrl}/index.html`;
    }
}

// Show notification
function showNotification(type, message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Dynamic form fields based on role
function updateFormFields() {
    const role = document.getElementById('role').value;
    const additionalFieldsContainer = document.getElementById('additionalFields');
    
    if (!additionalFieldsContainer) return;
    
    additionalFieldsContainer.innerHTML = '';
    
    switch (role.toLowerCase()) {
        case 'vendor':
            additionalFieldsContainer.innerHTML = `
                <div class="form-group">
                    <input type="text" id="storeName" placeholder="Store Name" required>
                </div>
                <div class="form-group">
                    <select id="businessType" required>
                        <option value="">Select Business Type</option>
                        <option value="retail">Retail</option>
                        <option value="food">Food & Beverage</option>
                        <option value="services">Services</option>
                        <option value="accommodation">Accommodation</option>
                    </select>
                </div>
            `;
            break;
        case 'guide':
            additionalFieldsContainer.innerHTML = `
                <div class="form-group">
                    <select id="specialization" required>
                        <option value="">Select Specialization</option>
                        <option value="nature">Nature & Wildlife</option>
                        <option value="cultural">Cultural & Heritage</option>
                        <option value="adventure">Adventure & Sports</option>
                        <option value="food">Food & Culinary</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="number" id="experience" placeholder="Years of Experience" required>
                </div>
            `;
            break;
        case 'driver':
            additionalFieldsContainer.innerHTML = `
                <div class="form-group">
                    <select id="vehicleType" required>
                        <option value="">Select Vehicle Type</option>
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                        <option value="bus">Bus</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="text" id="licenseNumber" placeholder="License Number" required>
                </div>
            `;
            break;
    }
} 