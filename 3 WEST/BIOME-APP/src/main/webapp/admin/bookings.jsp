<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - Booking Management</title>
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
            <a href="dashboard.jsp" class="nav-item">
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
            <a href="bookings.jsp" class="nav-item active">
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
            <input type="text" placeholder="Search bookings by ID, tourist, or guide...">
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
        <div class="bookings-header">
            <h1>Booking Management</h1>
            <div class="header-actions">
                <button class="btn btn-outline">
                    <i class="fas fa-filter"></i>
                    Filters
                </button>
                <button class="btn btn-outline">
                    <i class="fas fa-download"></i>
                    Export
                </button>
            </div>
        </div>

        <div class="booking-stats">
            <%
            int pendingCount = (Integer) request.getAttribute("pendingCount") != null ? 
                (Integer) request.getAttribute("pendingCount") : 25;
            int confirmedCount = (Integer) request.getAttribute("confirmedCount") != null ? 
                (Integer) request.getAttribute("confirmedCount") : 156;
            int completedCount = (Integer) request.getAttribute("completedCount") != null ? 
                (Integer) request.getAttribute("completedCount") : 845;
            int cancelledCount = (Integer) request.getAttribute("cancelledCount") != null ? 
                (Integer) request.getAttribute("cancelledCount") : 12;
            %>
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending</h3>
                    <p><%= pendingCount %></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon confirmed">
                    <i class="fas fa-check"></i>
                </div>
                <div class="stat-info">
                    <h3>Confirmed</h3>
                    <p><%= confirmedCount %></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon completed">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <div class="stat-info">
                    <h3>Completed</h3>
                    <p><%= completedCount %></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon cancelled">
                    <i class="fas fa-times"></i>
                </div>
                <div class="stat-info">
                    <h3>Cancelled</h3>
                    <p><%= cancelledCount %></p>
                </div>
            </div>
        </div>

        <div class="bookings-filters">
            <div class="filter-group">
                <label>Status</label>
                <select class="form-control">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Date Range</label>
                <select class="form-control">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Location</label>
                <select class="form-control">
                    <option value="">All Locations</option>
                    <option value="cebu">Cebu</option>
                    <option value="palawan">Palawan</option>
                    <option value="boracay">Boracay</option>
                    <option value="bohol">Bohol</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Payment Status</label>
                <select class="form-control">
                    <option value="">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>
        </div>

        <div class="bookings-table">
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Tourist</th>
                        <th>Tour</th>
                        <th>Guide</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                    Object[] bookings = (Object[]) request.getAttribute("bookings");
                    if (bookings == null) {
                        // Default booking data for demonstration
                        String[][] defaultBookings = {
                            {"BK-2024-001", "John Smith", "Cebu City Heritage Walk", "Maria Santos", "Jun 15, 2024", "₱2,500", "Confirmed", "Paid"},
                            {"BK-2024-002", "Sarah Lee", "Palawan Island Hopping", "John Rivera", "Jun 16, 2024", "₱3,500", "Pending", "Pending"}
                        };
                        for (String[] booking : defaultBookings) {
                    %>
                    <tr>
                        <td><%= booking[0] %></td>
                        <td>
                            <div class="user-info">
                                <img src="../img/profile-placeholder.jpg" alt="Tourist">
                                <span><%= booking[1] %></span>
                            </div>
                        </td>
                        <td><%= booking[2] %></td>
                        <td>
                            <div class="user-info">
                                <img src="../img/profile-placeholder.jpg" alt="Guide">
                                <span><%= booking[3] %></span>
                            </div>
                        </td>
                        <td><%= booking[4] %></td>
                        <td><%= booking[5] %></td>
                        <td><span class="status <%= booking[6].toLowerCase() %>"><%= booking[6] %></span></td>
                        <td><span class="payment <%= booking[7].toLowerCase() %>"><%= booking[7] %></span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-outline btn-sm">View</button>
                                <button class="btn btn-primary btn-sm">Update</button>
                            </div>
                        </td>
                    </tr>
                    <%
                        }
                    } else {
                        // Handle actual booking data from the request
                        // Add logic to display actual bookings
                    }
                    %>
                </tbody>
            </table>
        </div>

        <div class="pagination">
            <button class="btn btn-outline">Previous</button>
            <div class="page-numbers">
                <button class="btn btn-outline active">1</button>
                <button class="btn btn-outline">2</button>
                <button class="btn btn-outline">3</button>
                <span>...</span>
                <button class="btn btn-outline">10</button>
            </div>
            <button class="btn btn-outline">Next</button>
        </div>

        <!-- Booking Details Modal -->
        <div class="modal" id="bookingModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Booking Details</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="booking-details">
                    <div class="booking-id">
                        <h3>Booking #BK-2024-001</h3>
                        <span class="status confirmed">Confirmed</span>
                    </div>
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4>Tourist Information</h4>
                            <div class="user-profile">
                                <img src="../img/profile-placeholder.jpg" alt="Tourist">
                                <div class="user-info">
                                    <h5>John Smith</h5>
                                    <p>john.smith@email.com</p>
                                    <p>+63 912 345 6789</p>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Tour Details</h4>
                            <div class="tour-info">
                                <h5>Cebu City Heritage Walk</h5>
                                <p><i class="fas fa-map-marker-alt"></i> Cebu City, Philippines</p>
                                <p><i class="fas fa-clock"></i> 4 hours</p>
                                <p><i class="fas fa-users"></i> 2 persons</p>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Guide Information</h4>
                            <div class="user-profile">
                                <img src="../img/profile-placeholder.jpg" alt="Guide">
                                <div class="user-info">
                                    <h5>Maria Santos</h5>
                                    <p>maria.santos@email.com</p>
                                    <p>+63 923 456 7890</p>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Payment Information</h4>
                            <div class="payment-info">
                                <div class="payment-item">
                                    <span>Tour Price</span>
                                    <span>₱2,000</span>
                                </div>
                                <div class="payment-item">
                                    <span>Service Fee</span>
                                    <span>₱500</span>
                                </div>
                                <div class="payment-item total">
                                    <span>Total Amount</span>
                                    <span>₱2,500</span>
                                </div>
                                <div class="payment-status">
                                    <span>Payment Status:</span>
                                    <span class="status paid">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-danger">Cancel Booking</button>
                        <button class="btn btn-outline">Send Message</button>
                        <button class="btn btn-primary">Update Status</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('bookingModal');
            const viewButtons = document.querySelectorAll('.btn-outline');
            const closeBtn = modal.querySelector('.close-btn');

            // Show modal for viewing booking details
            viewButtons.forEach(button => {
                if (button.textContent === 'View') {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
                        // Load booking data
                        loadBookingData(button.closest('tr'));
                    });
                }
            });

            // Close modal
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });

            // Initialize filters
            document.querySelectorAll('.form-control').forEach(select => {
                select.addEventListener('change', () => {
                    // Filter bookings implementation
                });
            });

            // Initialize search
            const searchInput = document.querySelector('.search-bar input');
            searchInput.addEventListener('input', (e) => {
                // Search bookings implementation
            });
        });

        function loadBookingData(bookingRow) {
            const modal = document.getElementById('bookingModal');
            const bookingId = bookingRow.cells[0].textContent;
            const tourist = bookingRow.cells[1].querySelector('span').textContent;
            const tour = bookingRow.cells[2].textContent;
            const guide = bookingRow.cells[3].querySelector('span').textContent;
            const status = bookingRow.cells[6].querySelector('.status').textContent;
            const payment = bookingRow.cells[7].querySelector('.payment').textContent;

            modal.querySelector('.booking-id h3').textContent = `Booking #${bookingId}`;
            modal.querySelector('.booking-id .status').textContent = status;
            modal.querySelector('.booking-id .status').className = `status ${status.toLowerCase()}`;

            // Update other modal content with the booking data
            modal.querySelector('.user-info h5').textContent = tourist;
            modal.querySelector('.tour-info h5').textContent = tour;
            modal.querySelector('.guide-info h5').textContent = guide;
            modal.querySelector('.payment-status .status').textContent = payment;
            modal.querySelector('.payment-status .status').className = `status ${payment.toLowerCase()}`;
        }
    </script>
</body>
</html> 