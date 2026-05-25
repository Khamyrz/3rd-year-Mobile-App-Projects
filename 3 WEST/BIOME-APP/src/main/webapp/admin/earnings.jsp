<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - Earnings Management</title>
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
            <a href="bookings.jsp" class="nav-item">
                <i class="fas fa-calendar"></i>
                <span>Bookings</span>
            </a>
            <a href="reviews.jsp" class="nav-item">
                <i class="fas fa-star"></i>
                <span>Reviews</span>
            </a>
            <a href="earnings.jsp" class="nav-item active">
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
            <input type="text" placeholder="Search transactions by ID, guide, or tour...">
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
        <div class="earnings-header">
            <h1>Earnings Management</h1>
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

        <div class="earnings-stats">
            <%
            String totalRevenue = (String) request.getAttribute("totalRevenue") != null ? 
                (String) request.getAttribute("totalRevenue") : "₱4.2M";
            String platformFees = (String) request.getAttribute("platformFees") != null ? 
                (String) request.getAttribute("platformFees") : "₱840K";
            String guideEarnings = (String) request.getAttribute("guideEarnings") != null ? 
                (String) request.getAttribute("guideEarnings") : "₱3.36M";
            int pendingPayouts = (Integer) request.getAttribute("pendingPayouts") != null ? 
                (Integer) request.getAttribute("pendingPayouts") : 25;
            %>
            <div class="stat-card">
                <div class="stat-icon revenue">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <p><%= totalRevenue %></p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        18.2% vs last month
                    </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon fees">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="stat-info">
                    <h3>Platform Fees</h3>
                    <p><%= platformFees %></p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        15.7% vs last month
                    </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon earnings">
                    <i class="fas fa-hand-holding-usd"></i>
                </div>
                <div class="stat-info">
                    <h3>Guide Earnings</h3>
                    <p><%= guideEarnings %></p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        12.5% vs last month
                    </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending Payouts</h3>
                    <p><%= pendingPayouts %></p>
                    <span class="trend neutral">
                        <i class="fas fa-minus"></i>
                        Same as last month
                    </span>
                </div>
            </div>
        </div>

        <div class="earnings-filters">
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
                <label>Transaction Type</label>
                <select class="form-control">
                    <option value="">All Types</option>
                    <option value="booking">Booking Payment</option>
                    <option value="payout">Guide Payout</option>
                    <option value="refund">Refund</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Status</label>
                <select class="form-control">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Amount Range</label>
                <select class="form-control">
                    <option value="">All Amounts</option>
                    <option value="0-1000">₱0 - ₱1,000</option>
                    <option value="1000-5000">₱1,000 - ₱5,000</option>
                    <option value="5000+">Above ₱5,000</option>
                </select>
            </div>
        </div>

        <div class="transactions-table">
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Guide</th>
                        <th>Tour</th>
                        <th>Amount</th>
                        <th>Platform Fee</th>
                        <th>Net Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                    Object[] transactions = (Object[]) request.getAttribute("transactions");
                    if (transactions == null) {
                        // Default transaction data for demonstration
                        String[][] defaultTransactions = {
                            {"TR-2024-001", "Jun 15, 2024", "Booking Payment", "Maria Santos", "Cebu City Heritage Walk", 
                             "₱2,500", "₱500", "₱2,000", "Completed"},
                            {"TR-2024-002", "Jun 14, 2024", "Guide Payout", "John Rivera", "Palawan Island Hopping", 
                             "₱3,500", "₱700", "₱2,800", "Pending"}
                        };
                        for (String[] transaction : defaultTransactions) {
                    %>
                    <tr>
                        <td><%= transaction[0] %></td>
                        <td><%= transaction[1] %></td>
                        <td><span class="transaction-type <%= transaction[2].toLowerCase().replace(" ", "-") %>">
                            <%= transaction[2] %>
                        </span></td>
                        <td>
                            <div class="user-info">
                                <img src="../img/profile-placeholder.jpg" alt="Guide">
                                <span><%= transaction[3] %></span>
                            </div>
                        </td>
                        <td><%= transaction[4] %></td>
                        <td><%= transaction[5] %></td>
                        <td><%= transaction[6] %></td>
                        <td><%= transaction[7] %></td>
                        <td><span class="status <%= transaction[8].toLowerCase() %>"><%= transaction[8] %></span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-outline btn-sm">View</button>
                                <% if (transaction[2].equals("Guide Payout") && transaction[8].equals("Pending")) { %>
                                    <button class="btn btn-primary btn-sm">Process</button>
                                <% } %>
                            </div>
                        </td>
                    </tr>
                    <%
                        }
                    } else {
                        // Handle actual transaction data from the request
                        // Add logic to display actual transactions
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

        <!-- Transaction Details Modal -->
        <div class="modal" id="transactionModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Transaction Details</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="transaction-details">
                    <div class="transaction-id">
                        <h3>Transaction #TR-2024-001</h3>
                        <span class="status completed">Completed</span>
                    </div>
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4>Transaction Information</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Type</label>
                                    <span>Booking Payment</span>
                                </div>
                                <div class="info-item">
                                    <label>Date</label>
                                    <span>Jun 15, 2024</span>
                                </div>
                                <div class="info-item">
                                    <label>Payment Method</label>
                                    <span>Credit Card</span>
                                </div>
                                <div class="info-item">
                                    <label>Reference</label>
                                    <span>BK-2024-001</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Guide Information</h4>
                            <div class="user-profile">
                                <img src="../img/profile-placeholder.jpg" alt="Guide">
                                <div class="user-info">
                                    <h5>Maria Santos</h5>
                                    <p>maria.santos@email.com</p>
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
                            <h4>Payment Breakdown</h4>
                            <div class="payment-info">
                                <div class="payment-item">
                                    <span>Tour Price</span>
                                    <span>₱2,500</span>
                                </div>
                                <div class="payment-item">
                                    <span>Platform Fee (20%)</span>
                                    <span>₱500</span>
                                </div>
                                <div class="payment-item">
                                    <span>Guide Earnings (80%)</span>
                                    <span>₱2,000</span>
                                </div>
                                <div class="payment-item total">
                                    <span>Total Amount</span>
                                    <span>₱2,500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="transaction-actions">
                        <button class="btn btn-danger">Cancel Transaction</button>
                        <button class="btn btn-outline">Download Receipt</button>
                        <button class="btn btn-primary">Process Payout</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('transactionModal');
            const viewButtons = document.querySelectorAll('.btn-outline');
            const closeBtn = modal.querySelector('.close-btn');

            // Show modal for viewing transaction details
            viewButtons.forEach(button => {
                if (button.textContent === 'View') {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
                        // Load transaction data
                        loadTransactionData(button.closest('tr'));
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
                    // Filter transactions implementation
                });
            });

            // Initialize search
            const searchInput = document.querySelector('.search-bar input');
            searchInput.addEventListener('input', (e) => {
                // Search transactions implementation
            });
        });

        function loadTransactionData(transactionRow) {
            const modal = document.getElementById('transactionModal');
            const transactionId = transactionRow.cells[0].textContent;
            const date = transactionRow.cells[1].textContent;
            const type = transactionRow.cells[2].querySelector('.transaction-type').textContent.trim();
            const guide = transactionRow.cells[3].querySelector('span').textContent;
            const tour = transactionRow.cells[4].textContent;
            const amount = transactionRow.cells[5].textContent;
            const fee = transactionRow.cells[6].textContent;
            const net = transactionRow.cells[7].textContent;
            const status = transactionRow.cells[8].querySelector('.status').textContent;

            modal.querySelector('.transaction-id h3').textContent = `Transaction #${transactionId}`;
            modal.querySelector('.transaction-id .status').textContent = status;
            modal.querySelector('.transaction-id .status').className = `status ${status.toLowerCase()}`;

            // Update transaction information
            modal.querySelector('.info-grid .info-item:nth-child(1) span').textContent = type;
            modal.querySelector('.info-grid .info-item:nth-child(2) span').textContent = date;

            // Update guide information
            modal.querySelector('.user-info h5').textContent = guide;

            // Update tour information
            modal.querySelector('.tour-info h5').textContent = tour;

            // Update payment information
            modal.querySelector('.payment-info .payment-item:nth-child(1) span:last-child').textContent = amount;
            modal.querySelector('.payment-info .payment-item:nth-child(2) span:last-child').textContent = fee;
            modal.querySelector('.payment-info .payment-item:nth-child(3) span:last-child').textContent = net;
            modal.querySelector('.payment-info .payment-item.total span:last-child').textContent = amount;

            // Show/hide action buttons based on transaction type and status
            const processButton = modal.querySelector('.btn-primary');
            if (type === 'Guide Payout' && status === 'Pending') {
                processButton.style.display = 'block';
            } else {
                processButton.style.display = 'none';
            }
        }
    </script>
</body>
</html> 