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
            if (!customerMap) {
                initCustomerMap();
            } else {
                customerMap.invalidateSize();
            }
        }, 100);
    } else if (pageId === 'rider-container') {
        setTimeout(() => {
            if (!riderMap) {
                initRiderMap();
            } else {
                riderMap.invalidateSize();
            }
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

// File upload handler
function handleFileUpload(input, previewId) {
    const file = input.files[0];
    if (!file) return null;
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.style.backgroundImage = `url(${e.target.result})`;
                preview.innerHTML = '';
            }
            resolve(e.target.result);
        };
        
        reader.onerror = function(e) {
            reject(e);
        };
        
        reader.readAsDataURL(file);
    });
}

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
    const mapOptions = {
        zoomControl: false,
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

    const tileLayerOptions = {
        maxZoom: 19,
        attribution: '',
        className: 'map-tiles',
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true
    };

    // Create map instance for customer map
    const customerMapElement = document.getElementById('customer-map');
    if (customerMapElement && !customerMap) {
        customerMap = L.map('customer-map', mapOptions).setView([11.2744, 123.6851], 14);

        // Add custom zoom control
        L.control.zoom({
            position: 'topright'
        }).addTo(customerMap);

        // Add high-resolution tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', tileLayerOptions).addTo(customerMap);

        // Remove any remaining attributions
        const attributionControl = customerMap.attributionControl;
        if (attributionControl) {
            customerMap.removeControl(attributionControl);
        }

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
    const mapOptions = {
        zoomControl: false,
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

    const tileLayerOptions = {
        maxZoom: 19,
        attribution: '',
        className: 'map-tiles',
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true
    };

    // Create map instance for rider map
    const riderMapElement = document.getElementById('rider-map');
    if (riderMapElement && !riderMap) {
        riderMap = L.map('rider-map', mapOptions).setView([11.2744, 123.6851], 14);

        // Add custom zoom control
        L.control.zoom({
            position: 'topright'
        }).addTo(riderMap);

        // Add high-resolution tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', tileLayerOptions).addTo(riderMap);

        // Remove any remaining attributions
        const attributionControl = riderMap.attributionControl;
        if (attributionControl) {
            riderMap.removeControl(attributionControl);
        }

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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth
    Auth.init();
    
    // Initialize rides
    Rides.init();
    
    // Initialize tab indicator for default active tab
    updateTabIndicator('login-tab');
    
    // Tab switching
    document.getElementById('login-tab').addEventListener('click', () => {
        updateTabIndicator('login-tab');
        showLoginSelection();
    });
    
    document.getElementById('register-tab').addEventListener('click', () => {
        updateTabIndicator('register-tab');
        showRegistrationSelection();
    });
    
    document.getElementById('admin-login-tab').addEventListener('click', () => {
        updateTabIndicator('admin-login-tab');
        showAdminLoginForm();
    });
    
    // Login type selection
    const riderLoginChoice = document.getElementById('rider-login-choice');
    if (riderLoginChoice) {
        riderLoginChoice.addEventListener('click', showRiderLoginForm);
    }
    
    const customerLoginChoice = document.getElementById('customer-login-choice');
    if (customerLoginChoice) {
        customerLoginChoice.addEventListener('click', showCustomerLoginForm);
    }
    
    // Registration type selection
    document.getElementById('rider-reg-choice').addEventListener('click', () => {
        showRiderRegistrationForm();
    });
    
    document.getElementById('customer-reg-choice').addEventListener('click', () => {
        showCustomerRegistrationForm();
    });
    
    // Back buttons
    const backToLoginButtons = document.querySelectorAll('[id^="back-to-login-select"]');
    backToLoginButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateTabIndicator('login-tab');
            showLoginSelection();
        });
    });
    
    document.getElementById('back-to-reg-select').addEventListener('click', () => {
        updateTabIndicator('register-tab');
        showRegistrationSelection();
    });
    
    document.getElementById('back-to-reg-select-customer').addEventListener('click', () => {
        updateTabIndicator('register-tab');
        showRegistrationSelection();
    });
    
    // Login forms
    const riderLoginForm = document.getElementById('rider-login-form');
    if (riderLoginForm) {
        riderLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('rider-login-email').value;
            const password = document.getElementById('rider-login-password').value;
            Auth.login(email, password, 'rider');
        });
    }
    
    const customerLoginForm = document.getElementById('customer-login-form');
    if (customerLoginForm) {
        customerLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('customer-login-email').value;
            const password = document.getElementById('customer-login-password').value;
            Auth.login(email, password, 'customer');
        });
    }
    
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-login-username').value;
        const password = document.getElementById('admin-login-password').value;
        Auth.adminLogin(username, password);
    });
    
    // Registration forms
    document.getElementById('rider-registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('rider-name').value,
            lastName: document.getElementById('rider-last-name').value,
            middleName: document.getElementById('rider-middle-name').value,
            email: document.getElementById('rider-email').value,
            phone: document.getElementById('rider-phone').value,
            password: document.getElementById('rider-password').value,
            age: document.getElementById('rider-age').value,
            address: document.getElementById('rider-address').value,
            vehicleModel: document.getElementById('rider-vehicle-model').value,
            licensePlate: document.getElementById('rider-license-plate').value
        };
        
        // Validate password confirmation
        const confirmPassword = document.getElementById('rider-confirm-password').value;
        if (formData.password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // Handle file uploads
        try {
            formData.photoUrl = await handleFileUpload(document.getElementById('rider-photo'), 'rider-photo-preview');
            formData.vehiclePhotoUrl = await handleFileUpload(document.getElementById('rider-vehicle-photo'), 'vehicle-photo-preview');
            formData.licensePhotoUrl = await handleFileUpload(document.getElementById('rider-license-photo'), 'license-photo-preview');
            
            Auth.register(formData, 'rider');
        } catch (error) {
            showToast('Error uploading files. Please try again.', 'error');
        }
    });
    
    document.getElementById('customer-registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('customer-name').value,
            lastName: document.getElementById('customer-last-name').value,
            middleName: document.getElementById('customer-middle-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value,
            password: document.getElementById('customer-password').value,
            age: document.getElementById('customer-age').value,
            address: document.getElementById('customer-address').value
        };
        
        // Validate password confirmation
        const confirmPassword = document.getElementById('customer-confirm-password').value;
        if (formData.password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // Handle file upload
        try {
            formData.photoUrl = await handleFileUpload(document.getElementById('customer-photo'), 'customer-photo-preview');
            
            Auth.register(formData, 'customer');
        } catch (error) {
            showToast('Error uploading files. Please try again.', 'error');
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