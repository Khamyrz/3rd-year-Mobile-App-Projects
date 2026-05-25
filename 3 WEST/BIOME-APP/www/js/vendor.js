// Vendor Dashboard Functions
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    setupEventListeners();
});

// Initialize Dashboard
function initializeDashboard() {
    fetchDashboardStats();
    fetchRecentOrders();
    fetchInventoryAlerts();
    fetchRecentReviews();
}

// Dashboard Statistics
async function fetchDashboardStats() {
    try {
        // TODO: Replace with actual API call
        const stats = {
            todayOrders: 12,
            todayOrdersChange: 33.7,
            revenue: 15750,
            revenueChange: 12.4,
            visitors: 247,
            visitorsChange: 18.2,
            rating: 4.8,
            ratingChange: 0
        };
        updateDashboardStats(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        showErrorNotification('Failed to load dashboard statistics');
    }
}

function updateDashboardStats(stats) {
    // Update Today's Orders
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.todayOrders;
    updateStatChange('.stat-card:nth-child(1) .stat-change', stats.todayOrdersChange);

    // Update Revenue
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = formatCurrency(stats.revenue);
    updateStatChange('.stat-card:nth-child(2) .stat-change', stats.revenueChange);

    // Update Store Visitors
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.visitors;
    updateStatChange('.stat-card:nth-child(3) .stat-change', stats.visitorsChange);

    // Update Average Rating
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.rating;
    updateStatChange('.stat-card:nth-child(4) .stat-change', stats.ratingChange);
}

// Recent Orders
async function fetchRecentOrders() {
    try {
        // TODO: Replace with actual API call
        const orders = [
            {
                id: '1234',
                product: 'Handwoven Bag',
                quantity: 2,
                time: '2 hours ago',
                status: 'pending',
                amount: 3000,
                image: '../../img/product-placeholder.jpg'
            },
            {
                id: '1233',
                product: 'Traditional Scarf',
                quantity: 1,
                time: '5 hours ago',
                status: 'processing',
                amount: 550,
                image: '../../img/product-placeholder.jpg'
            }
        ];
        updateRecentOrders(orders);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        showErrorNotification('Failed to load recent orders');
    }
}

function updateRecentOrders(orders) {
    const orderList = document.querySelector('.order-list');
    orderList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <img src="${order.image}" alt="${order.product}">
                <div>
                    <h4>Order #${order.id}</h4>
                    <p>${order.product} × ${order.quantity}</p>
                    <span class="order-time">${order.time}</span>
                </div>
            </div>
            <div class="order-status">
                <span class="status-tag status-${order.status}">${capitalizeFirstLetter(order.status)}</span>
                <p class="order-amount">${formatCurrency(order.amount)}</p>
            </div>
        </div>
    `).join('');
}

// Inventory Alerts
async function fetchInventoryAlerts() {
    try {
        // TODO: Replace with actual API call
        const alerts = [
            {
                type: 'low-stock',
                product: 'Handwoven Bag',
                variant: 'Brown',
                quantity: 3
            },
            {
                type: 'out-stock',
                product: 'Traditional Scarf',
                variant: 'Green',
                quantity: 0
            }
        ];
        updateInventoryAlerts(alerts);
    } catch (error) {
        console.error('Error fetching inventory alerts:', error);
        showErrorNotification('Failed to load inventory alerts');
    }
}

function updateInventoryAlerts(alerts) {
    const alertList = document.querySelector('.alert-list');
    alertList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <i class="fas fa-${alert.type === 'low-stock' ? 'exclamation-triangle' : 'times-circle'}"></i>
            <div class="alert-info">
                <h4>${alert.type === 'low-stock' ? 'Low Stock Alert' : 'Out of Stock'}</h4>
                <p>${alert.product} (${alert.variant})${alert.type === 'low-stock' ? ` - Only ${alert.quantity} left` : ''}</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="handleRestock('${alert.product}', '${alert.variant}')">Restock</button>
        </div>
    `).join('');
}

// Recent Reviews
async function fetchRecentReviews() {
    try {
        // TODO: Replace with actual API call
        const reviews = [
            {
                reviewer: 'John D.',
                rating: 5,
                date: 'Today',
                text: 'Beautiful handwoven bag! The quality is excellent and the craftsmanship is outstanding.',
                avatar: '../../img/profile-placeholder.jpg'
            }
        ];
        updateRecentReviews(reviews);
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        showErrorNotification('Failed to load recent reviews');
    }
}

function updateRecentReviews(reviews) {
    const reviewList = document.querySelector('.review-list');
    reviewList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.avatar}" alt="${review.reviewer}">
                    <div>
                        <h4>${review.reviewer}</h4>
                        <div class="rating">
                            ${generateStarRating(review.rating)}
                        </div>
                    </div>
                </div>
                <span class="review-date">${review.date}</span>
            </div>
            <p class="review-text">${review.text}</p>
            <button class="btn btn-text" onclick="handleReviewReply('${review.reviewer}')">Reply</button>
        </div>
    `).join('');
}

// Sales Chart
function initializeCharts() {
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => updateSalesChart(e.target.value));
    }
    updateSalesChart('week');
}

async function updateSalesChart(period) {
    try {
        // TODO: Replace with actual API call
        const data = await fetchSalesData(period);
        // TODO: Implement chart rendering using a charting library like Chart.js
        console.log('Updating sales chart with data:', data);
    } catch (error) {
        console.error('Error updating sales chart:', error);
        showErrorNotification('Failed to update sales chart');
    }
}

// Event Handlers
function setupEventListeners() {
    // Add New Product Button
    const addProductBtn = document.querySelector('.dashboard-header .btn-primary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', handleAddProduct);
    }

    // Search Bar
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(e.target.value);
            }
        });
    }

    // Notification Bell
    const notificationBell = document.querySelector('.notifications');
    if (notificationBell) {
        notificationBell.addEventListener('click', handleNotifications);
    }
}

// Action Handlers
function handleAddProduct() {
    // TODO: Implement add product functionality
    window.location.href = 'products.html?action=new';
}

function handleSearch(query) {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
}

function handleNotifications() {
    // TODO: Implement notifications panel
    console.log('Opening notifications panel');
}

function handleRestock(product, variant) {
    // TODO: Implement restock functionality
    console.log('Restocking:', product, variant);
}

function handleReviewReply(reviewer) {
    // TODO: Implement review reply functionality
    console.log('Replying to review from:', reviewer);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(amount);
}

function updateStatChange(selector, change) {
    const element = document.querySelector(selector);
    if (element) {
        if (change === 0) {
            element.className = 'stat-change neutral';
            element.textContent = 'Same as last period';
        } else {
            element.className = `stat-change ${change > 0 ? 'positive' : 'negative'}`;
            element.textContent = `${change > 0 ? '+' : ''}${change}% vs last period`;
        }
    }
}

function generateStarRating(rating) {
    return Array(5).fill(null).map((_, index) => 
        `<i class="fas fa-star${index >= rating ? '-o' : ''}"></i>`
    ).join('');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showErrorNotification(message) {
    // TODO: Implement error notification UI
    console.error(message);
} 