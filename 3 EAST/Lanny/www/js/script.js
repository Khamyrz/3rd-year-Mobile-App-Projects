// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    initializeUI();
    
    // Load menu items
    loadMenuItems();
});

// Global variables
let currentUser = null;
let cart = [];
let menuItems = [];
let fbPageId = '123456789012345'; // Replace with your actual Facebook Page ID
let isLoading = false;

// Show loading spinner
function showLoading() {
    if (document.getElementById('loadingSpinner')) return;
    
    isLoading = true;
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-overlay"></div>
        <div class="spinner-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(spinner);
}

// Hide loading spinner
function hideLoading() {
    isLoading = false;
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

// Handle Facebook Login
function handleFacebookLogin() {
    if (isLoading) return;
    
    showLoading();
    
    FB.login(function(response) {
        if (response.authResponse) {
            // User successfully logged in
            console.log('Login successful');
            FB.AppEvents.logEvent('Login Success');
            getUserInfo(response.authResponse.accessToken);
        } else {
            // User cancelled login or did not fully authorize
            console.log('Login cancelled or not fully authorized');
            FB.AppEvents.logEvent('Login Failed');
            hideLoading();
            showLoginError('Login was cancelled or not fully authorized');
        }
    }, {
        scope: 'public_profile,email',
        auth_type: 'rerequest',
        return_scopes: true
    });
}

// Get user information
function getUserInfo(accessToken) {
    FB.api('/me', {fields: 'name,email,picture.width(200)'}, function(response) {
        if (response && !response.error) {
            currentUser = {
                id: response.id,
                name: response.name,
                email: response.email,
                picture: response.picture ? response.picture.data.url : null,
                accessToken: accessToken
            };
            
            // Store user info in localStorage for persistence
            try {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } catch (e) {
                console.error('Error saving user data:', e);
            }
            
            // Update UI with user info
            document.getElementById('userName').textContent = currentUser.name;
            if (currentUser.picture) {
                document.getElementById('userProfilePic').src = currentUser.picture;
            } else {
                document.getElementById('userProfilePic').src = 'img/default-profile.png';
            }
            
            // Show main screen
            hideLoading();
            showMainScreen();
            
            // Log success
            FB.AppEvents.logEvent('Get User Info Success');
        } else {
            console.error('Error getting user info:', response ? response.error : 'No response');
            hideLoading();
            showLoginError('Could not get user information');
            FB.AppEvents.logEvent('Get User Info Failed');
        }
    });
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
}

// Show main screen
function showMainScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    // Reset views
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('mapView').classList.add('hidden');
    document.getElementById('cartView').classList.add('hidden');
    document.getElementById('checkoutView').classList.add('hidden');
    document.getElementById('orderConfirmation').classList.add('hidden');
    
    // Remove overlay if exists
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Initialize UI elements and event listeners
function initializeUI() {
    // Create loading spinner style
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
        }
        .spinner-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        .spinner-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Check for stored user data
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            // Verify the stored session is still valid
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    showMainScreen();
                    document.getElementById('userName').textContent = currentUser.name;
                    if (currentUser.picture) {
                        document.getElementById('userProfilePic').src = currentUser.picture;
                    } else {
                        document.getElementById('userProfilePic').src = 'img/default-profile.png';
                    }
                } else {
                    // Session expired, clear stored data
                    localStorage.removeItem('currentUser');
                    currentUser = null;
                    showLoginScreen();
                }
            });
        }
    } catch (e) {
        console.error('Error reading stored user data:', e);
    }
    
    // Facebook login button
    document.getElementById('fbLoginBtn').addEventListener('click', handleFacebookLogin);
    
    // Side menu toggle
    document.getElementById('menuBtn').addEventListener('click', function() {
        document.getElementById('sideMenu').classList.add('active');
        document.querySelector('.overlay').classList.add('active');
    });
    
    // Close side menu when clicking overlay
    document.querySelector('.overlay').addEventListener('click', function() {
        document.getElementById('sideMenu').classList.remove('active');
        this.classList.remove('active');
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        FB.logout(function(response) {
            currentUser = null;
            cart = [];
            showLoginScreen();
        });
    });
    
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', function() {
        showCartView();
    });
    
    // Back buttons
    document.getElementById('backToMenuFromCartBtn').addEventListener('click', function() {
        hideCartView();
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        document.getElementById('mapView').classList.add('hidden');
    });
    
    document.getElementById('backToCartBtn').addEventListener('click', function() {
        document.getElementById('checkoutView').classList.add('hidden');
        showCartView();
    });
    
    document.getElementById('backToHomeBtn').addEventListener('click', function() {
        document.getElementById('orderConfirmation').classList.add('hidden');
        showMainScreen();
    });
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length > 0) {
            showCheckoutView();
        } else {
            alert('Your cart is empty. Please add items to proceed.');
        }
    });
    
    // Place Order button
    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        const address = document.getElementById('addressInput').value.trim();
        if (!address) {
            alert('Please enter your delivery address.');
            return;
        }
        
        sendOrderToFacebook(address);
    });
    
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterMenuItems(this.textContent.trim());
        });
    });
}

// Load menu items
function loadMenuItems() {
    // Sample menu items (in a real app, these would come from an API)
    menuItems = [
        {
            id: 1,
            name: 'Classic Pepperoni',
            description: 'Traditional pizza with pepperoni, mozzarella cheese and tomato sauce',
            price: 299.00,
            category: 'Classic',
            image: 'img/menu/pepperoni.png'
        },
        {
            id: 2,
            name: 'Hawaiian Supreme',
            description: 'Ham, pineapple and mozzarella cheese on a tomato base',
            price: 329.00,
            category: 'Classic',
            image: 'img/menu/hawaiian.png'
        },
        {
            id: 3,
            name: 'Alberto\'s Special',
            description: 'Our signature pizza with special toppings and cheese blend',
            price: 399.00,
            category: 'Specialty',
            image: 'img/menu/special.png'
        },
        {
            id: 4,
            name: 'Vegetarian Delight',
            description: 'Fresh vegetables, olives and mozzarella on a pesto base',
            price: 349.00,
            category: 'Specialty',
            image: 'img/menu/veggie.png'
        },
        {
            id: 5,
            name: 'Meat Lovers',
            description: 'Loaded with pepperoni, ham, bacon, and Italian sausage',
            price: 429.00,
            category: 'Bestsellers',
            image: 'img/menu/meat.png'
        },
        {
            id: 6,
            name: 'Cheesy Garlic Bread',
            description: 'Garlic butter and mozzarella cheese on freshly baked bread',
            price: 149.00,
            category: 'Sides',
            image: 'img/menu/garlic.png'
        }
    ];
    
    displayMenuItems(menuItems);
}

// Display menu items
function displayMenuItems(items) {
    const menuItemsContainer = document.querySelector('.menu-items-container');
    menuItemsContainer.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-img">
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-desc">${item.description}</p>
                <p class="menu-item-price">₱${formatPrice(item.price)}</p>
                <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        
        menuItemsContainer.appendChild(itemElement);
    });
    
    // Add event listeners to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

// Filter menu items by category
function filterMenuItems(category) {
    if (category === 'All') {
        displayMenuItems(menuItems);
    } else {
        const filteredItems = menuItems.filter(item => item.category === category);
        displayMenuItems(filteredItems);
    }
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${item.name} added to cart`);
}

// Update cart count in UI
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// Show cart view
function showCartView() {
    document.getElementById('cartView').classList.remove('hidden');
    renderCartItems();
    updateCartTotals();
}

// Hide cart view
function hideCartView() {
    document.getElementById('cartView').classList.add('hidden');
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">₱${formatPrice(item.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to quantity buttons
    const decreaseButtons = document.querySelectorAll('.decrease-btn');
    const increaseButtons = document.querySelectorAll('.increase-btn');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(itemId);
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            increaseQuantity(itemId);
        });
    });
}

// Increase item quantity
function increaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity += 1;
        renderCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

// Decrease item quantity
function decreaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity -= 1;
        
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== itemId);
        }
        
        renderCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotalAmount').textContent = `₱${formatPrice(subtotal)}`;
    document.getElementById('deliveryFee').textContent = `₱${formatPrice(deliveryFee)}`;
    document.getElementById('totalAmount').textContent = `₱${formatPrice(total)}`;
}

// Show checkout view
function showCheckoutView() {
    document.getElementById('cartView').classList.add('hidden');
    document.getElementById('checkoutView').classList.remove('hidden');
    
    // Populate order summary
    const orderItemsList = document.getElementById('orderItemsList');
    orderItemsList.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₱${formatPrice(item.price * item.quantity)}</span>
        `;
        
        orderItemsList.appendChild(orderItem);
    });
    
    // Update final total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 50;
    document.getElementById('finalAmount').textContent = `₱${formatPrice(total)}`;
}

// Send order to Facebook page
function sendOrderToFacebook(address) {
    // Format order details
    const orderItems = cart.map(item => `${item.name} x ${item.quantity} - ₱${formatPrice(item.price * item.quantity)}`).join('\n');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + 50; // Adding delivery fee
    
    const orderDetails = `
New Order from ${currentUser.name}:

${orderItems}

Subtotal: ₱${formatPrice(subtotal)}
Delivery Fee: ₱50.00
TOTAL: ₱${formatPrice(total)}

Delivery Address:
${address}

Payment Method: ${document.querySelector('input[name="payment"]:checked').value === 'cash' ? 'Cash on Delivery' : 'Credit/Debit Card'}

Customer Details:
Name: ${currentUser.name}
FB ID: ${currentUser.id}
    `;
    
    // In a real implementation, you would use the Facebook Graph API to send a message
    // to your page. This requires a page access token and proper permissions.
    // For demonstration purposes, we'll simulate this process
    
    console.log("Sending order to Facebook page:", orderDetails);
    
    // Simulate API call to send message to Facebook page
    setTimeout(() => {
        // Generate random order number
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        document.getElementById('orderNumber').textContent = orderNumber;
        
        // Show order confirmation
        document.getElementById('checkoutView').classList.add('hidden');
        document.getElementById('orderConfirmation').classList.remove('hidden');
        
        // Clear cart
        cart = [];
        updateCartCount();
    }, 1000);
    
    // For a real implementation, you would use:
    /*
    FB.api(
        `/${fbPageId}/messages`,
        'POST',
        {
            recipient: {id: fbPageId},
            message: {text: orderDetails},
            access_token: 'YOUR_PAGE_ACCESS_TOKEN'
        },
        function(response) {
            if (response && !response.error) {
                // Handle success
            } else {
                // Handle error
            }
        }
    );
    */
}

// Format price using PHP endpoint
function formatPrice(price) {
    // In a real application, you would call a PHP endpoint to format the price
    // For simplicity, we'll format it in JavaScript
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '500';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

// Show login error
function showLoginError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = '#ff4444';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}