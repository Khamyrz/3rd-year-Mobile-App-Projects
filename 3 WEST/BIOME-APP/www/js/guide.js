// Initialize Firebase
const firebaseConfig = {
    // Your Firebase config here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Guide Dashboard Management
class GuideDashboardManager {
    constructor() {
        this.stats = {
            todayTours: 0,
            todayTourists: 0,
            upcomingBookings: 0,
            rating: 0,
            reviewCount: 0,
            monthlyEarnings: 0
        };
        this.charts = {};
        this.activities = [];
    }

    // Initialize dashboard
    async initializeDashboard() {
        await this.fetchGuideStats();
        await this.fetchRecentActivities();
        this.initializeCharts();
        this.setupEventListeners();
    }

    // Fetch guide statistics
    async fetchGuideStats() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const guideRef = db.collection('guides').doc(user.uid);
            const guideDoc = await guideRef.get();
            
            if (guideDoc.exists) {
                this.stats = {
                    ...this.stats,
                    ...guideDoc.data()
                };
                this.updateStatsDisplay();
            }
        } catch (error) {
            console.error('Error fetching guide stats:', error);
        }
    }

    // Update stats display
    updateStatsDisplay() {
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = this.stats.todayTours;
        document.querySelector('.stat-card:nth-child(1) .stat-label').textContent = `${this.stats.todayTourists} tourists`;
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = this.stats.upcomingBookings;
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = this.stats.rating.toFixed(1);
        document.querySelector('.stat-card:nth-child(3) .stat-label').textContent = `${this.stats.reviewCount} reviews`;
        document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = this.formatCurrency(this.stats.monthlyEarnings);
    }

    // Fetch recent activities
    async fetchRecentActivities() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const activitiesRef = db.collection('guide_activities')
                .where('guideId', '==', user.uid)
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
        this.initializeEarningsChart();
        this.initializeBookingsChart();
        this.initializeReviewsChart();
    }

    // Initialize earnings chart
    initializeEarningsChart() {
        const ctx = document.getElementById('earningsChart').getContext('2d');
        this.charts.earnings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Earnings',
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
                        beginAtZero: true,
                        ticks: {
                            callback: value => '₱' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // Initialize bookings chart
    initializeBookingsChart() {
        const ctx = document.getElementById('bookingsChart').getContext('2d');
        this.charts.bookings = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bookings',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#2196F3'
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

    // Initialize reviews chart
    initializeReviewsChart() {
        const ctx = document.getElementById('reviewsChart').getContext('2d');
        this.charts.reviews = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336']
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

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Help button
        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }
    }

    // Show notifications
    async showNotifications() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const notificationsRef = db.collection('notifications')
                .where('guideId', '==', user.uid)
                .where('read', '==', false)
                .orderBy('timestamp', 'desc')
                .limit(10);

            const snapshot = await notificationsRef.get();
            const notifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Implement notification display logic
            console.log('Notifications:', notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    // Show help
    showHelp() {
        // Implement help display logic
        console.log('Showing help');
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
        try {
            const user = auth.currentUser;
            if (!user) return [];

            const guideRef = db.collection('guides').doc(user.uid);
            const chartDataRef = guideRef.collection('chart_data').doc(chartId);
            const chartDoc = await chartDataRef.get();

            if (chartDoc.exists) {
                return chartDoc.data()[period] || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching chart data:', error);
            return [];
        }
    }

    // Helper functions
    getActivityIcon(type) {
        const icons = {
            'booking': 'fa-calendar-check',
            'review': 'fa-star',
            'message': 'fa-envelope',
            'payment': 'fa-wallet',
            'tour': 'fa-route'
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

    formatCurrency(amount) {
        return '₱' + amount.toLocaleString();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new GuideDashboardManager();
    dashboard.initializeDashboard();

    // Authentication check
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '../../login.html';
            return;
        }

        // Check if user has guide role
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const role = doc.data().role;
                    if (role.toLowerCase() !== 'guide') {
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