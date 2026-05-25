<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - Admin Dashboard</title>
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-logo">
            <img src="../img/logo.png" alt="BIOME Logo" height="40">
        </div>
        <nav class="sidebar-nav">
            <a href="dashboard.jsp" class="nav-item active">
                <i class="fas fa-home"></i>
                <span>Dashboard</span>
            </a>
            <a href="users.jsp" class="nav-item">
                <i class="fas fa-users"></i>
                <span>Users</span>
            </a>
            <a href="guides.jsp" class="nav-item">
                <i class="fas fa-user-tie"></i>
                <span>Guides</span>
            </a>
            <a href="tours.jsp" class="nav-item">
                <i class="fas fa-route"></i>
                <span>Tours</span>
            </a>
            <a href="bookings.jsp" class="nav-item">
                <i class="fas fa-calendar"></i>
                <span>Bookings</span>
            </a>
            <a href="reviews.jsp" class="nav-item">
                <i class="fas fa-star"></i>
                <span>Reviews</span>
            </a>
            <a href="earnings.jsp" class="nav-item">
                <i class="fas fa-wallet"></i>
                <span>Earnings</span>
            </a>
            <a href="reports.jsp" class="nav-item">
                <i class="fas fa-chart-bar"></i>
                <span>Reports</span>
            </a>
            <a href="settings.jsp" class="nav-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
        </nav>
    </div>

    <div class="topbar">
        <div class="search-bar">
            <input type="text" placeholder="Search...">
            <button class="btn btn-primary search-btn">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div class="user-profile">
            <div class="notifications">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">8</span>
            </div>
            <span>Admin</span>
            <img src="../img/admin-profile.jpg" alt="Admin" width="40" height="40" style="border-radius: 50%;">
        </div>
    </div>

    <main class="main-content">
        <div class="dashboard-header">
            <h1>Dashboard Overview</h1>
            <div class="header-actions">
                <button class="btn btn-outline">
                    <i class="fas fa-calendar"></i>
                    Last 30 Days
                </button>
                <button class="btn btn-outline">
                    <i class="fas fa-download"></i>
                    Export Report
                </button>
            </div>
        </div>

        <div class="metrics-grid">
            <div class="metric-item">
                <h4>Total Users</h4>
                <div class="metric-value">
                    <%= request.getAttribute("totalUsers") != null ? request.getAttribute("totalUsers") : "15,234" %>
                </div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>12.5%</span>
                </div>
            </div>
            <div class="metric-item">
                <h4>Active Guides</h4>
                <div class="metric-value">
                    <%= request.getAttribute("activeGuides") != null ? request.getAttribute("activeGuides") : "342" %>
                </div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>8.3%</span>
                </div>
            </div>
            <div class="metric-item">
                <h4>Total Bookings</h4>
                <div class="metric-value">
                    <%= request.getAttribute("totalBookings") != null ? request.getAttribute("totalBookings") : "2,845" %>
                </div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>15.7%</span>
                </div>
            </div>
            <div class="metric-item">
                <h4>Total Revenue</h4>
                <div class="metric-value">
                    <%= request.getAttribute("totalRevenue") != null ? request.getAttribute("totalRevenue") : "₱4.2M" %>
                </div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>18.2%</span>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3>Revenue Overview</h3>
                    <select class="form-control">
                        <option value="week">This Week</option>
                        <option value="month" selected>This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <canvas id="revenueChart"></canvas>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3>User Growth</h3>
                    <select class="form-control">
                        <option value="week">This Week</option>
                        <option value="month" selected>This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <canvas id="userGrowthChart"></canvas>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3>Popular Destinations</h3>
                    <select class="form-control">
                        <option value="bookings">By Bookings</option>
                        <option value="revenue">By Revenue</option>
                    </select>
                </div>
                <canvas id="destinationsChart"></canvas>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3>Booking Status</h3>
                    <select class="form-control">
                        <option value="today">Today</option>
                        <option value="week" selected>This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
                <canvas id="bookingStatusChart"></canvas>
            </div>
        </div>

        <div class="recent-activities">
            <div class="section-header">
                <h3>Recent Activities</h3>
                <button class="btn btn-outline">View All</button>
            </div>
            <div class="activity-list">
                <% 
                Object[] activities = (Object[]) request.getAttribute("recentActivities");
                if (activities == null) {
                    // Default activities if none are provided
                    String[] defaultActivities = {
                        "New Guide Application|Maria Santos submitted a new guide application|2 minutes ago",
                        "New Booking|John Smith booked Palawan Island Hopping Tour|15 minutes ago",
                        "New Review|5-star review received for Chocolate Hills Adventure|1 hour ago",
                        "Reported Issue|Customer reported an issue with booking #12345|2 hours ago",
                        "Withdrawal Request|Guide requested withdrawal of ₱25,000|3 hours ago"
                    };
                    for (String activity : defaultActivities) {
                        String[] parts = activity.split("\\|");
                %>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-<%= parts[0].contains("Guide") ? "user-plus" : 
                                         parts[0].contains("Booking") ? "calendar-check" :
                                         parts[0].contains("Review") ? "star" :
                                         parts[0].contains("Issue") ? "exclamation-circle" : "wallet" %>"></i>
                    </div>
                    <div class="activity-details">
                        <h4><%= parts[0] %></h4>
                        <p><%= parts[1] %></p>
                    </div>
                    <span class="activity-time"><%= parts[2] %></span>
                </div>
                <%
                    }
                } else {
                    // Handle actual activities from the request
                    for (Object activity : activities) {
                        // Add logic to display actual activities
                    }
                }
                %>
            </div>
        </div>

        <div class="performance-metrics">
            <div class="section-header">
                <h3>Platform Performance</h3>
                <button class="btn btn-outline">View Details</button>
            </div>
            <div class="metrics-grid">
                <div class="metric-item">
                    <h4>Average Response Time</h4>
                    <div class="metric-value">1.2s</div>
                    <div class="trend neutral">
                        <i class="fas fa-minus"></i>
                        <span>0.1s</span>
                    </div>
                </div>
                <div class="metric-item">
                    <h4>Server Uptime</h4>
                    <div class="metric-value">99.9%</div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>0.1%</span>
                    </div>
                </div>
                <div class="metric-item">
                    <h4>Error Rate</h4>
                    <div class="metric-value">0.05%</div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-down"></i>
                        <span>0.02%</span>
                    </div>
                </div>
                <div class="metric-item">
                    <h4>Active Sessions</h4>
                    <div class="metric-value">1,234</div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>5.3%</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Revenue',
                        data: [850000, 1200000, 950000, 1400000],
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

            // User Growth Chart
            const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
            new Chart(userGrowthCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'New Users',
                        data: [120, 150, 180, 210],
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

            // Popular Destinations Chart
            const destinationsCtx = document.getElementById('destinationsChart').getContext('2d');
            new Chart(destinationsCtx, {
                type: 'bar',
                data: {
                    labels: ['Palawan', 'Boracay', 'Cebu', 'Siargao', 'Bohol'],
                    datasets: [{
                        label: 'Bookings',
                        data: [450, 380, 320, 280, 250],
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

            // Booking Status Chart
            const bookingStatusCtx = document.getElementById('bookingStatusChart').getContext('2d');
            new Chart(bookingStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Upcoming', 'Cancelled', 'In Progress'],
                    datasets: [{
                        data: [45, 30, 15, 10],
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

            // Initialize filters
            document.querySelectorAll('.form-control').forEach(select => {
                select.addEventListener('change', () => {
                    // Update charts based on selected period
                });
            });
        });
    </script>
</body>
</html> 