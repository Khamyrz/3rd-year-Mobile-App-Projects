// Global variables
let customerMap = null;
let riderMap = null;
let currentMarker = null;
let directionsService = null;
let directionsRenderer = null;

// Helper functions
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Initialize or refresh maps when showing relevant pages
    if (pageId === 'customer-container') {
        setTimeout(() => {
            initCustomerMap();
        }, 100);
    } else if (pageId === 'rider-container') {
        setTimeout(() => {
            initRiderMap();
        }, 100);
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function showLoginSelection() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        form.style.display = 'none';
    });
    const loginSelection = document.getElementById('login-selection');
    loginSelection.style.display = 'block';
    loginSelection.offsetHeight; // Force reflow
    loginSelection.classList.add('active');
}

function showRiderLoginForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        form.style.display = 'none';
    });
    const riderForm = document.getElementById('rider-login-form');
    riderForm.style.display = 'block';
    riderForm.offsetHeight; // Force reflow
    riderForm.classList.add('active');
}

function showCustomerLoginForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        form.style.display = 'none';
    });
    const customerForm = document.getElementById('customer-login-form');
    customerForm.style.display = 'block';
    customerForm.offsetHeight; // Force reflow
    customerForm.classList.add('active');
}

function showRegistrationSelection() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        setTimeout(() => {
            if (!form.classList.contains('active')) {
                form.style.display = 'none';
            }
        }, 300);
    });
    const regSelection = document.getElementById('registration-selection');
    regSelection.style.display = 'block';
    regSelection.offsetHeight;
    regSelection.classList.add('active');
}

function showRiderRegistrationForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        setTimeout(() => {
            if (!form.classList.contains('active')) {
                form.style.display = 'none';
            }
        }, 300);
    });
    const riderForm = document.getElementById('rider-registration-form');
    riderForm.style.display = 'block';
    riderForm.offsetHeight;
    riderForm.classList.add('active');
}

function showCustomerRegistrationForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        setTimeout(() => {
            if (!form.classList.contains('active')) {
                form.style.display = 'none';
            }
        }, 300);
    });
    const customerForm = document.getElementById('customer-registration-form');
    customerForm.style.display = 'block';
    customerForm.offsetHeight;
    customerForm.classList.add('active');
}

function showAdminLoginForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        setTimeout(() => {
            if (!form.classList.contains('active')) {
                form.style.display = 'none';
            }
        }, 300);
    });
    const adminForm = document.getElementById('admin-login-form');
    adminForm.style.display = 'block';
    adminForm.offsetHeight;
    adminForm.classList.add('active');
}

// File upload handling
async function handleFileUpload(fileInput, previewId) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        if (!file) {
            reject(new Error('No file selected'));
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Update preview
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.style.backgroundImage = `url(${e.target.result})`;
                preview.style.backgroundSize = 'cover';
                preview.style.backgroundPosition = 'center';
                preview.innerHTML = '';
            }
            // Return the data URL
            resolve(e.target.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Add file input change listeners
document.querySelectorAll('input[type="file"]').forEach(fileInput => {
    const previewId = fileInput.nextElementSibling?.id;
    if (previewId) {
        fileInput.addEventListener('change', () => {
            handleFileUpload(fileInput, previewId).catch(error => {
                console.error('Error handling file upload:', error);
                showToast('Error uploading file. Please try again.', 'error');
            });
        });
    }
});

function cleanupMaps() {
    // Clean up maps
    if (customerMap) {
        customerMap.remove();
        customerMap = null;
    }
    if (riderMap) {
        riderMap.remove();
        riderMap = null;
    }
    
    // Clear any active markers or routes
    currentMarker = null;
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
        directionsRenderer = null;
    }
    
    // Reset UI elements
    document.querySelectorAll('.bottom-sheet').forEach(sheet => {
        sheet.classList.add('collapsed');
    });
}

// Initialize Leaflet Map
function initCustomerMap() {
    if (customerMap) {
        customerMap.remove();
        customerMap = null;
    }

    const mapOptions = {
        zoomControl: true,
        attributionControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        minZoom: 5,
        maxZoom: 19
    };

    // Create map instance for customer map
    const customerMapElement = document.getElementById('customer-map');
    if (customerMapElement) {
        customerMap = L.map('customer-map', mapOptions).setView([11.2744, 123.6851], 14);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: ''
        }).addTo(customerMap);

        // Add click handler for setting pickup location
        customerMap.on('click', (e) => {
            const latlng = e.latlng;
            
            // Remove existing marker if any
            if (currentMarker) {
                customerMap.removeLayer(currentMarker);
            }
            
            // Create new marker
            currentMarker = L.marker(latlng, {
                draggable: true,
                title: 'Pickup Location'
            }).addTo(customerMap);
            
            // Update pickup location input
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name;
                    document.getElementById('pickup-location').value = address;
                })
                .catch(error => {
                    console.error('Error getting address:', error);
                    document.getElementById('pickup-location').value = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
                });
            
            // Handle marker drag
            currentMarker.on('dragend', (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
                    .then(response => response.json())
                    .then(data => {
                        const address = data.display_name;
                        document.getElementById('pickup-location').value = address;
                    })
                    .catch(error => {
                        console.error('Error getting address:', error);
                        document.getElementById('pickup-location').value = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                    });
            });
        });

        // Force a resize to ensure proper rendering
        setTimeout(() => {
            customerMap.invalidateSize();
        }, 100);
    }
}

function initRiderMap() {
    if (riderMap) {
        riderMap.remove();
        riderMap = null;
    }

    const mapOptions = {
        zoomControl: true,
        attributionControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        minZoom: 5,
        maxZoom: 19
    };

    // Create map instance for rider map
    const riderMapElement = document.getElementById('rider-map');
    if (riderMapElement) {
        riderMap = L.map('rider-map', mapOptions).setView([11.2744, 123.6851], 14);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: ''
        }).addTo(riderMap);

        // Force a resize to ensure proper rendering
        setTimeout(() => {
            riderMap.invalidateSize();
        }, 100);
    }
}

// Update tab indicator
function updateTabIndicator(tabId) {
    const tabsContainer = document.querySelector('.tabs');
    const allTabs = document.querySelectorAll('.tab-btn');
    const activeTab = document.getElementById(tabId);
    const tabIndicator = document.querySelector('.tab-indicator');
    
    // Remove active class from all tabs
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    activeTab.classList.add('active');
    
    // Calculate the width and position of the active tab
    const tabWidth = activeTab.offsetWidth;
    const tabLeft = activeTab.offsetLeft;
    
    // Update the indicator width and position using CSS custom properties
    tabsContainer.style.setProperty('--indicator-width', `${tabWidth}px`);
    tabsContainer.style.setProperty('--indicator-left', `${tabLeft}px`);
    
    // Update data-active attribute
    if (tabId === 'login-tab') {
        tabsContainer.setAttribute('data-active', 'login');
    } else if (tabId === 'register-tab') {
        tabsContainer.setAttribute('data-active', 'register');
    } else if (tabId === 'admin-login-tab') {
        tabsContainer.setAttribute('data-active', 'admin');
    }
}

// App initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page containers
    const authContainer = document.getElementById('auth-container');
    const customerContainer = document.getElementById('customer-container');
    const riderContainer = document.getElementById('rider-container');
    const adminContainer = document.getElementById('admin-container');

    // Show auth container by default
    showPage('auth-container');

    // Initialize Firebase Auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            const userType = localStorage.getItem('userType');
            if (userType === 'customer') {
                showPage('customer-container');
                Rides.init();
            } else if (userType === 'rider') {
                showPage('rider-container');
                Rides.init();
            } else if (userType === 'admin') {
                showPage('admin-container');
            }
        } else {
            // No user is signed in
            showPage('auth-container');
        }
    });

    // Handle tab switching in auth page
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const adminLoginTab = document.getElementById('admin-login-tab');
    const tabIndicator = document.querySelector('.tab-indicator');

    const loginSelection = document.getElementById('login-selection');
    const registrationSelection = document.getElementById('registration-selection');
    const adminLoginForm = document.getElementById('admin-login-form');

    loginTab.addEventListener('click', () => {
        updateActiveTab('login');
        showAuthForm(loginSelection);
    });

    registerTab.addEventListener('click', () => {
        updateActiveTab('register');
        showAuthForm(registrationSelection);
    });

    adminLoginTab.addEventListener('click', () => {
        updateActiveTab('admin');
        showAuthForm(adminLoginForm);
    });

    function updateActiveTab(tabName) {
        // Remove active class from all tabs
        loginTab.classList.remove('active');
        registerTab.classList.remove('active');
        adminLoginTab.classList.remove('active');

        // Add active class to selected tab
        switch (tabName) {
            case 'login':
                loginTab.classList.add('active');
                break;
            case 'register':
                registerTab.classList.add('active');
                break;
            case 'admin':
                adminLoginTab.classList.add('active');
                break;
        }

        // Update tabs data attribute
        document.querySelector('.tabs').dataset.active = tabName;
    }

    function showAuthForm(formToShow) {
        // Hide all auth forms
        const authForms = document.querySelectorAll('.auth-form');
        authForms.forEach(form => form.classList.remove('active'));

        // Show the selected form
        formToShow.classList.add('active');
    }

    // Handle registration choice selection
    const riderRegChoice = document.getElementById('rider-reg-choice');
    const customerRegChoice = document.getElementById('customer-reg-choice');
    const riderRegForm = document.getElementById('rider-registration-form');
    const customerRegForm = document.getElementById('customer-registration-form');

    riderRegChoice.addEventListener('click', () => {
        registrationSelection.classList.remove('active');
        riderRegForm.classList.add('active');
    });

    customerRegChoice.addEventListener('click', () => {
        registrationSelection.classList.remove('active');
        customerRegForm.classList.add('active');
    });

    // Handle back buttons
    const backToRegSelect = document.getElementById('back-to-reg-select');
    const backToRegSelectCustomer = document.getElementById('back-to-reg-select-customer');

    backToRegSelect.addEventListener('click', () => {
        riderRegForm.classList.remove('active');
        registrationSelection.classList.add('active');
    });

    backToRegSelectCustomer.addEventListener('click', () => {
        customerRegForm.classList.remove('active');
        registrationSelection.classList.add('active');
    });

    // Handle login choice selection
    const riderLoginChoice = document.getElementById('rider-login-choice');
    const customerLoginChoice = document.getElementById('customer-login-choice');
    const riderLoginForm = document.getElementById('rider-login-form');
    const customerLoginForm = document.getElementById('customer-login-form');

    riderLoginChoice.addEventListener('click', () => {
        loginSelection.classList.remove('active');
        riderLoginForm.classList.add('active');
    });

    customerLoginChoice.addEventListener('click', () => {
        loginSelection.classList.remove('active');
        customerLoginForm.classList.add('active');
    });

    // Handle back to login selection
    const backToLoginSelect = document.getElementById('back-to-login-select');
    const backToLoginSelectCustomer = document.getElementById('back-to-login-select-customer');

    backToLoginSelect.addEventListener('click', () => {
        riderLoginForm.classList.remove('active');
        loginSelection.classList.add('active');
    });

    backToLoginSelectCustomer.addEventListener('click', () => {
        customerLoginForm.classList.remove('active');
        loginSelection.classList.add('active');
    });

    // Login forms
    riderLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('rider-login-email').value;
        const password = document.getElementById('rider-login-password').value;
        Auth.login(email, password, 'rider');
    });
    
    customerLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('customer-login-email').value;
        const password = document.getElementById('customer-login-password').value;
        Auth.login(email, password, 'customer');
    });
    
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-login-username').value;
        const password = document.getElementById('admin-login-password').value;
        Auth.adminLogin(username, password);
    });
    
    // Registration forms
    const riderRegistrationForm = document.getElementById('rider-registration-form');
    const customerRegistrationForm = document.getElementById('customer-registration-form');

    riderRegistrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Get form data
        const formData = {
            email: document.getElementById('rider-email').value,
            password: document.getElementById('rider-password').value,
            confirmPassword: document.getElementById('rider-confirm-password').value,
            firstName: document.getElementById('rider-name').value,
            middleName: document.getElementById('rider-middle-name').value,
            lastName: document.getElementById('rider-last-name').value,
            phone: document.getElementById('rider-phone').value,
            address: document.getElementById('rider-address').value,
            age: document.getElementById('rider-age').value,
            vehicleModel: document.getElementById('rider-vehicle-model').value,
            licensePlate: document.getElementById('rider-license-plate').value,
            photo: document.getElementById('rider-photo').files[0],
            vehiclePhoto: document.getElementById('rider-vehicle-photo').files[0],
            licensePhoto: document.getElementById('rider-license-photo').files[0]
        };

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            if (!formData.photo || !formData.vehiclePhoto || !formData.licensePhoto) {
                throw new Error('Please upload all required photos');
            }
            await Auth.register(formData, 'rider');
            // Reset form
            riderRegistrationForm.reset();
            document.getElementById('rider-photo-preview').innerHTML = '📷 Upload Photo';
            document.getElementById('vehicle-photo-preview').innerHTML = '📷 Upload Photo';
            document.getElementById('license-photo-preview').innerHTML = '📷 Upload Photo';
            document.getElementById('rider-photo-preview').style.backgroundImage = '';
            document.getElementById('vehicle-photo-preview').style.backgroundImage = '';
            document.getElementById('license-photo-preview').style.backgroundImage = '';
            // Show success message
            showToast('Registration successful! Logging you in...', 'success');
            // Log the user in automatically
            await Auth.login(formData.email, formData.password, 'rider');
        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Registration failed. Please try again.', 'error');
        }
    });
    
    customerRegistrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Get form data
        const formData = {
            email: document.getElementById('customer-email').value,
            password: document.getElementById('customer-password').value,
            confirmPassword: document.getElementById('customer-confirm-password').value,
            firstName: document.getElementById('customer-name').value,
            middleName: document.getElementById('customer-middle-name').value,
            lastName: document.getElementById('customer-last-name').value,
            phone: document.getElementById('customer-phone').value,
            address: document.getElementById('customer-address').value,
            age: document.getElementById('customer-age').value,
            photo: document.getElementById('customer-photo').files[0]
        };
        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            if (!formData.photo) {
                throw new Error('Please upload your photo');
            }
            await Auth.register(formData, 'customer');
            // Reset form
            customerRegistrationForm.reset();
            document.getElementById('customer-photo-preview').innerHTML = '📷 Upload Photo';
            document.getElementById('customer-photo-preview').style.backgroundImage = '';
            // Show success message
            showToast('Registration successful! Logging you in...', 'success');
            // Log the user in automatically
            await Auth.login(formData.email, formData.password, 'customer');
        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Registration failed. Please try again.', 'error');
        }
    });
    
    // Password reset links
    document.getElementById('rider-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('rider-login-email').value;
        if (email) {
            Auth.requestPasswordReset(email, 'rider');
        } else {
            showToast('Please enter your email address', 'error');
        }
    });
    
    document.getElementById('customer-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('customer-login-email').value;
        if (email) {
            Auth.requestPasswordReset(email, 'customer');
        } else {
            showToast('Please enter your email address', 'error');
        }
    });
    
    // File upload previews
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', () => {
            const previewId = input.id + '-preview';
            handleFileUpload(input, previewId);
        });
    });
    
    // Logout buttons with cleanup
    const customerLogoutBtn = document.getElementById('customer-logout-btn');
    if (customerLogoutBtn) {
        customerLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cleanupMaps();
            Auth.logout();
        });
    }

    const riderLogoutBtn = document.getElementById('rider-logout-btn');
    if (riderLogoutBtn) {
        riderLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cleanupMaps();
            Auth.logout();
        });
    }

    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cleanupMaps();
            Auth.logout();
        });
    }

    // Handle window resize to update indicator position
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            updateTabIndicator(activeTab.id);
        }
    });
}); 