// User Management
const loadUsers = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/users?${queryParams}`);
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error loading users:', error);
        throw error;
    }
};

const updateUserStatus = async (userId, status) => {
    try {
        const response = await fetch(`/api/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};

// Guide Management
const loadGuideApplications = async (status = 'pending') => {
    try {
        const response = await fetch(`/api/admin/guides/applications?status=${status}`);
        const applications = await response.json();
        return applications;
    } catch (error) {
        console.error('Error loading guide applications:', error);
        throw error;
    }
};

const reviewGuideApplication = async (applicationId, decision, feedback = '') => {
    try {
        const response = await fetch(`/api/admin/guides/applications/${applicationId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ decision, feedback }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error reviewing guide application:', error);
        throw error;
    }
};

// Tour Management
const loadTours = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/tours?${queryParams}`);
        const tours = await response.json();
        return tours;
    } catch (error) {
        console.error('Error loading tours:', error);
        throw error;
    }
};

const updateTourStatus = async (tourId, status) => {
    try {
        const response = await fetch(`/api/admin/tours/${tourId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating tour status:', error);
        throw error;
    }
};

// Booking Management
const loadBookings = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/bookings?${queryParams}`);
        const bookings = await response.json();
        return bookings;
    } catch (error) {
        console.error('Error loading bookings:', error);
        throw error;
    }
};

const resolveBookingDispute = async (bookingId, resolution) => {
    try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/resolve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resolution }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error resolving booking dispute:', error);
        throw error;
    }
};

// Review Management
const loadReviews = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/reviews?${queryParams}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error loading reviews:', error);
        throw error;
    }
};

const moderateReview = async (reviewId, action, reason = '') => {
    try {
        const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, reason }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error moderating review:', error);
        throw error;
    }
};

// Earnings Management
const loadEarnings = async (period = 'month') => {
    try {
        const response = await fetch(`/api/admin/earnings?period=${period}`);
        const earnings = await response.json();
        return earnings;
    } catch (error) {
        console.error('Error loading earnings:', error);
        throw error;
    }
};

const processWithdrawal = async (withdrawalId, status, notes = '') => {
    try {
        const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, notes }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        throw error;
    }
};

// Report Generation
const generateReport = async (type, filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/reports/${type}?${queryParams}`);
        const report = await response.json();
        return report;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};

const exportReport = async (type, format, filters = {}) => {
    try {
        const queryParams = new URLSearchParams({ ...filters, format });
        const response = await fetch(`/api/admin/reports/${type}/export?${queryParams}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error exporting report:', error);
        throw error;
    }
};

// Settings Management
const loadSettings = async () => {
    try {
        const response = await fetch('/api/admin/settings');
        const settings = await response.json();
        return settings;
    } catch (error) {
        console.error('Error loading settings:', error);
        throw error;
    }
};

const updateSettings = async (settings) => {
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
};

// Activity Monitoring
const loadActivities = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/admin/activities?${queryParams}`);
        const activities = await response.json();
        return activities;
    } catch (error) {
        console.error('Error loading activities:', error);
        throw error;
    }
};

// Utility Functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

// Export functions for use in other modules
export {
    loadUsers,
    updateUserStatus,
    loadGuideApplications,
    reviewGuideApplication,
    loadTours,
    updateTourStatus,
    loadBookings,
    resolveBookingDispute,
    loadReviews,
    moderateReview,
    loadEarnings,
    processWithdrawal,
    generateReport,
    exportReport,
    loadSettings,
    updateSettings,
    loadActivities,
    formatCurrency,
    formatDate,
    formatTime,
};

// Initialize Firebase
const firebaseConfig = {
    // Your Firebase config here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Dashboard Data Management
class DashboardManager {
    constructor() {
        this.stats = {
            totalUsers: 0,
            activeGuides: 0,
            totalBookings: 0,
            totalRevenue: 0
        };
        this.charts = {};
        this.activities = [];
    }

    // Initialize dashboard
    async initializeDashboard() {
        await this.fetchDashboardStats();
        await this.fetchRecentActivities();
        this.initializeCharts();
        this.setupEventListeners();
    }

    // Fetch dashboard statistics
    async fetchDashboardStats() {
        try {
            const statsRef = db.collection('dashboard_stats').doc('current');
            const statsDoc = await statsRef.get();
            
            if (statsDoc.exists) {
                this.stats = statsDoc.data();
                this.updateStatsDisplay();
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    }

    // Update stats display
    updateStatsDisplay() {
        document.querySelector('.metric-item:nth-child(1) .metric-value').textContent = this.stats.totalUsers;
        document.querySelector('.metric-item:nth-child(2) .metric-value').textContent = this.stats.activeGuides;
        document.querySelector('.metric-item:nth-child(3) .metric-value').textContent = this.stats.totalBookings;
        document.querySelector('.metric-item:nth-child(4) .metric-value').textContent = `₱${this.stats.totalRevenue.toLocaleString()}`;
    }

    // Fetch recent activities
    async fetchRecentActivities() {
        try {
            const activitiesRef = db.collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(5);
            
            const snapshot = await activitiesRef.get();
            this.activities = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            this.updateActivitiesDisplay();
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }

    // Update activities display
    updateActivitiesDisplay() {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <span class="activity-time">${this.getTimeAgo(activity.timestamp)}</span>
            </div>
        `).join('');
    }

    // Initialize charts
    initializeCharts() {
        this.initializeRevenueChart();
        this.initializeUserGrowthChart();
        this.initializeDestinationsChart();
        this.initializeBookingStatusChart();
    }

    // Initialize revenue chart
    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue',
                    data: [0, 0, 0, 0],
                    borderColor: '#2196F3',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '₱' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // Initialize user growth chart
    initializeUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        this.charts.userGrowth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'New Users',
                    data: [0, 0, 0, 0],
                    borderColor: '#4CAF50',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initialize destinations chart
    initializeDestinationsChart() {
        const ctx = document.getElementById('destinationsChart').getContext('2d');
        this.charts.destinations = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Palawan', 'Boracay', 'Cebu', 'Siargao', 'Bohol'],
                datasets: [{
                    label: 'Bookings',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: '#FFC107'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initialize booking status chart
    initializeBookingStatusChart() {
        const ctx = document.getElementById('bookingStatusChart').getContext('2d');
        this.charts.bookingStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Upcoming', 'Cancelled', 'In Progress'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#FFC107']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Period selector change
        document.querySelectorAll('.form-control').forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateChartData(e.target.closest('.chart-card').querySelector('canvas').id, e.target.value);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        const searchBtn = document.querySelector('.search-btn');
        
        searchBtn.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(searchInput.value);
            }
        });
    }

    // Handle search
    async handleSearch(query) {
        if (!query.trim()) return;

        try {
            const results = await db.collection('search_index')
                .where('keywords', 'array-contains', query.toLowerCase())
                .limit(10)
                .get();

            // Handle search results
            console.log('Search results:', results.docs.map(doc => doc.data()));
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }

    // Update chart data
    async updateChartData(chartId, period) {
        try {
            const data = await this.fetchChartData(chartId, period);
            this.charts[chartId].data.datasets[0].data = data;
            this.charts[chartId].update();
        } catch (error) {
            console.error(`Error updating ${chartId} chart:`, error);
        }
    }

    // Fetch chart data
    async fetchChartData(chartId, period) {
        // Implement data fetching logic for each chart type
        return [];
    }

    // Helper functions
    getActivityIcon(type) {
        const icons = {
            'user': 'fa-user-plus',
            'booking': 'fa-calendar-check',
            'review': 'fa-star',
            'issue': 'fa-exclamation-circle',
            'withdrawal': 'fa-wallet'
        };
        return icons[type] || 'fa-info-circle';
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `${interval} years ago`;
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} months ago`;
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} days ago`;
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} minutes ago`;
        
        return 'just now';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    dashboard.initializeDashboard();

    // Authentication check
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '../../login.html';
            return;
        }

        // Check if user has admin role
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const role = doc.data().role;
                    if (role.toLowerCase() !== 'admin') {
                        window.location.href = '../../login.html';
                    }
                } else {
                    window.location.href = '../../login.html';
                }
            })
            .catch((error) => {
                console.error('Error checking user role:', error);
                window.location.href = '../../login.html';
            });
    });
});

// Logout function
function logoutUser() {
    auth.signOut().then(() => {
        window.location.href = '../../login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
} 