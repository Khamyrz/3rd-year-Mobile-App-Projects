// Menu Items Data
const menuItems = [
    // Pizzas
    {
        id: 'p1',
        name: 'Classic Pepperoni',
        description: 'Pepperoni, mozzarella cheese, and tomato sauce on thin crust',
        price: 299.00,
        image: 'https://via.placeholder.com/150?text=Pepperoni+Pizza',
        category: 'pizza'
    },
    {
        id: 'p2',
        name: 'Hawaiian Supreme',
        description: 'Ham, pineapple, and mozzarella cheese on our signature crust',
        price: 349.00,
        image: 'https://via.placeholder.com/150?text=Hawaiian+Pizza',
        category: 'pizza'
    },
    {
        id: 'p3',
        name: 'Meat Lovers',
        description: 'Pepperoni, ham, sausage, bacon, and ground beef',
        price: 399.00,
        image: 'https://via.placeholder.com/150?text=Meat+Lovers',
        category: 'pizza'
    },
    {
        id: 'p4',
        name: 'Veggie Delight',
        description: 'Mushrooms, bell peppers, onions, olives, and tomatoes',
        price: 349.00,
        image: 'https://via.placeholder.com/150?text=Veggie+Pizza',
        category: 'pizza'
    },
    {
        id: 'p5',
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, bell peppers, onions, and mushrooms',
        price: 399.00,
        image: 'https://via.placeholder.com/150?text=Supreme+Pizza',
        category: 'pizza'
    },
    
    // Foods
    {
        id: 'f1',
        name: 'Spaghetti Bolognese',
        description: 'Classic pasta with rich meat sauce and parmesan cheese',
        price: 199.00,
        image: 'https://via.placeholder.com/150?text=Spaghetti',
        category: 'food'
    },
    {
        id: 'f2',
        name: 'Chicken Alfredo',
        description: 'Creamy pasta with grilled chicken and parmesan cheese',
        price: 249.00,
        image: 'https://via.placeholder.com/150?text=Chicken+Alfredo',
        category: 'food'
    },
    {
        id: 'f3',
        name: 'Beef Lasagna',
        description: 'Layers of pasta, beef, tomato sauce, and cheese',
        price: 279.00,
        image: 'https://via.placeholder.com/150?text=Beef+Lasagna',
        category: 'food'
    },
    {
        id: 'f4',
        name: 'Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
        price: 229.00,
        image: 'https://via.placeholder.com/150?text=Carbonara',
        category: 'food'
    },
    {
        id: 'f5',
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        price: 99.00,
        image: 'https://via.placeholder.com/150?text=Garlic+Bread',
        category: 'food'
    },
    
    // Shakes
    {
        id: 's1',
        name: 'Chocolate Shake',
        description: 'Rich and creamy chocolate milkshake topped with whipped cream',
        price: 129.00,
        image: 'https://via.placeholder.com/150?text=Chocolate+Shake',
        category: 'shake'
    },
    {
        id: 's2',
        name: 'Strawberry Shake',
        description: 'Sweet strawberry milkshake with real fruit and whipped cream',
        price: 129.00,
        image: 'https://via.placeholder.com/150?text=Strawberry+Shake',
        category: 'shake'
    },
    {
        id: 's3',
        name: 'Vanilla Shake',
        description: 'Classic vanilla milkshake with vanilla ice cream',
        price: 119.00,
        image: 'https://via.placeholder.com/150?text=Vanilla+Shake',
        category: 'shake'
    },
    {
        id: 's4',
        name: 'Oreo Shake',
        description: 'Cookies and cream milkshake with crushed Oreo cookies',
        price: 149.00,
        image: 'https://via.placeholder.com/150?text=Oreo+Shake',
        category: 'shake'
    },
    {
        id: 's5',
        name: 'Caramel Shake',
        description: 'Vanilla milkshake with caramel sauce and whipped cream',
        price: 139.00,
        image: 'https://via.placeholder.com/150?text=Caramel+Shake',
        category: 'shake'
    },
    
    // Milk Tea
    {
        id: 'm1',
        name: 'Classic Milk Tea',
        description: 'Traditional milk tea with pearls',
        price: 99.00,
        image: 'https://via.placeholder.com/150?text=Classic+Milk+Tea',
        category: 'milktea'
    },
    {
        id: 'm2',
        name: 'Taro Milk Tea',
        description: 'Creamy taro flavored milk tea with pearls',
        price: 119.00,
        image: 'https://via.placeholder.com/150?text=Taro+Milk+Tea',
        category: 'milktea'
    },
    {
        id: 'm3',
        name: 'Matcha Milk Tea',
        description: 'Japanese green tea flavored milk tea with pearls',
        price: 129.00,
        image: 'https://via.placeholder.com/150?text=Matcha+Milk+Tea',
        category: 'milktea'
    },
    {
        id: 'm4',
        name: 'Wintermelon Milk Tea',
        description: 'Refreshing wintermelon flavored milk tea with pearls',
        price: 109.00,
        image: 'https://via.placeholder.com/150?text=Wintermelon+Milk+Tea',
        category: 'milktea'
    },
    {
        id: 'm5',
        name: 'Brown Sugar Milk Tea',
        description: 'Rich brown sugar milk tea with pearls',
        price: 119.00,
        image: 'https://via.placeholder.com/150?text=Brown+Sugar+Milk+Tea',
        category: 'milktea'
    },
    
    // Snacks
    {
        id: 'sn1',
        name: 'Mozzarella Sticks',
        description: 'Crispy breaded mozzarella sticks with marinara sauce',
        price: 149.00,
        image: 'https://via.placeholder.com/150?text=Mozzarella+Sticks',
        category: 'snack'
    },
    {
        id: 'sn2',
        name: 'Chicken Wings',
        description: 'Crispy chicken wings with your choice of sauce',
        price: 199.00,
        image: 'https://via.placeholder.com/150?text=Chicken+Wings',
        category: 'snack'
    },
    {
        id: 'sn3',
        name: 'French Fries',
        description: 'Crispy golden french fries with ketchup',
        price: 99.00,
        image: 'https://via.placeholder.com/150?text=French+Fries',
        category: 'snack'
    },
    {
        id: 'sn4',
        name: 'Onion Rings',
        description: 'Crispy battered onion rings with dipping sauce',
        price: 119.00,
        image: 'https://via.placeholder.com/150?text=Onion+Rings',
        category: 'snack'
    },
    {
        id: 'sn5',
        name: 'Potato Wedges',
        description: 'Seasoned potato wedges with sour cream',
        price: 109.00,
        image: 'https://via.placeholder.com/150?text=Potato+Wedges',
        category: 'snack'
    }
];

// Global variables
let currentUser = null;
let cartItems = [];
let selectedCategory = 'all';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const fbLoginButton = document.getElementById('fb-login-button');
const userPic = document.getElementById('user-pic');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const menuToggle = document.querySelector('.menu-toggle');
const sideMenu = document.getElementById('side-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartItems_element = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const orderModal = document.getElementById('order-modal');
const messengerBtn = document.getElementById('messenger-btn');
const confirmOrderBtn = document.getElementById('confirm-order-btn');
const successModal = document.getElementById('success-modal');
const closeSuccessBtn = document.getElementById('close-success-btn');
const logoutButton = document.getElementById('logout-button');
const menuContainer = document.getElementById('menu-items');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuLinks = document.querySelectorAll('.menu-link');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Initialize Facebook SDK
document.addEventListener('DOMContentLoaded', function() {
    // Simulating Facebook SDK initialization
    console.log('Facebook SDK initialized');
});

// Event Listeners
fbLoginButton.addEventListener('click', handleFacebookLogin);
menuToggle.addEventListener('click', toggleSideMenu);
cartIcon.addEventListener('click', openCartModal);
checkoutBtn.addEventListener('click', openOrderModal);
messengerBtn.addEventListener('click', sendOrderViaMessenger);
confirmOrderBtn.addEventListener('click', placeOrder);
closeSuccessBtn.addEventListener('click', closeSuccessModal);
logoutButton.addEventListener('click', logout);

// Add event listeners to category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        selectedCategory = this.dataset.category;
        updateCategoryButtons();
        renderMenuItems();
    });
});

// Add event listeners to menu links in sidebar
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        selectedCategory = this.dataset.category;
        updateCategoryButtons();
        renderMenuItems();
        toggleSideMenu();
    });
});

// Add event listeners to close modal buttons
closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.classList.add('hidden');
    });
});

// Functions

// Handle Facebook Login
function handleFacebookLogin() {
    // Simulating Facebook login
    // In a real implementation, this would use the Facebook SDK
    setTimeout(() => {
        currentUser = {
            id: '12345678',
            name: 'John Doe',
            email: 'john.doe@example.com',
            picture: 'https://via.placeholder.com/50?text=User'
        };
        
        // Update UI after successful login
        userPic.src = currentUser.picture;
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;
        
        // Show main app
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        
        // Render menu items
        renderMenuItems();
    }, 1000);
}

// Toggle Side Menu
function toggleSideMenu() {
    sideMenu.classList.toggle('hidden');
    sideMenu.classList.toggle('show');
}

// Update category buttons
function updateCategoryButtons() {
    categoryButtons.forEach(button => {
        if (button.dataset.category === selectedCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Render menu items based on selected category
function renderMenuItems() {
    menuContainer.innerHTML = '';
    
    const filteredItems = selectedCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);
    
    filteredItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-img">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-price">₱${item.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        
        menuContainer.appendChild(menuItemElement);
        
        // Add event listener to Add to Cart button
        const addToCartBtn = menuItemElement.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', function() {
            addToCart(item.id);
        });
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    
    if (item) {
        const existingItem = cartItems.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...item,
                quantity: 1
            });
        }
        
        updateCartCount();
        alert(`Added ${item.name} to cart!`);
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Open cart modal
function openCartModal() {
    renderCartItems();
    updateCartTotal();
    cartModal.classList.remove('hidden');
}

// Render cart items
function renderCartItems() {
    cartItems_element.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItems_element.innerHTML = '<p>Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${item.price.toFixed(2)}</div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItems_element.appendChild(cartItemElement);
        
        // Add event listeners to quantity buttons
        const minusBtn = cartItemElement.querySelector('.minus');
        const plusBtn = cartItemElement.querySelector('.plus');
        const removeBtn = cartItemElement.querySelector('.remove-item');
        
        minusBtn.addEventListener('click', function() {
            updateItemQuantity(item.id, -1);
        });
        
        plusBtn.addEventListener('click', function() {
            updateItemQuantity(item.id, 1);
        });
        
        removeBtn.addEventListener('click', function() {
            removeItemFromCart(item.id);
        });
    });
}

// Update item quantity
function updateItemQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeItemFromCart(itemId);
        } else {
            renderCartItems();
            updateCartTotal();
            updateCartCount();
        }
    }
}

// Remove item from cart
function removeItemFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    renderCartItems();
    updateCartTotal();
    updateCartCount();
}

// Update cart total
function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `₱${total.toFixed(2)}`;
}

// Open order modal
function openOrderModal() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    cartModal.classList.add('hidden');
    orderModal.classList.remove('hidden');
}

// Send order via Facebook Messenger
function sendOrderViaMessenger() {
    // In a real app, this would use the Facebook Messenger SDK or API
    // For this demo, we'll simulate sending the order
    
    // Close the order modal
    orderModal.classList.add('hidden');
    
    // Show success modal
    successModal.classList.remove('hidden');
    
    // Create a formatted order message
    const orderMessage = createOrderMessage();
    console.log('Sending order via Facebook Messenger:', orderMessage);
}

// Place order directly
function placeOrder() {
    const deliveryAddress = document.getElementById('delivery-address').value;
    const contactNumber = document.getElementById('contact-number').value;
    
    if (!deliveryAddress || !contactNumber) {
        alert('Please fill in delivery address and contact number.');
        return;
    }
    
    // In a real app, this would send the order to the server
    // For this demo, we'll simulate sending the order
    
    // Close the order modal
    orderModal.classList.add('hidden');
    
    // Show success modal
    successModal.classList.remove('hidden');
    
    // Create a formatted order message
    const orderMessage = createOrderMessage(deliveryAddress, contactNumber);
    console.log('Placing order:', orderMessage);
    
    // Clear cart after successful order
    cartItems = [];
    updateCartCount();
}

// Create order message
function createOrderMessage(deliveryAddress = '', contactNumber = '') {
    let message = 'New Order from Alberto\'s Pizza App\n\n';
    message += 'Customer: ' + currentUser.name + '\n';
    message += 'Email: ' + currentUser.email + '\n';
    
    if (deliveryAddress) {
        message += 'Delivery Address: ' + deliveryAddress + '\n';
    }
    
    if (contactNumber) {
        message += 'Contact Number: ' + contactNumber + '\n';
    }
    
    message += '\nOrder Items:\n';
    
    cartItems.forEach(item => {
        message += `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ₱${total.toFixed(2)}`;
    
    return message;
}

// Close success modal
function closeSuccessModal() {
    successModal.classList.add('hidden');
}

// Logout
function logout() {
    currentUser = null;
    cartItems = [];
    
    // Clear UI
    updateCartCount();
    
    // Show login screen
    mainApp.classList.add('hidden');
    loginScreen.classList.remove('hidden');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (in a real app)
    // For demo purposes, start with login screen
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
});