<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - User Management</title>
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
            <a href="users.jsp" class="nav-item active">
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
            <input type="text" placeholder="Search users by name, email, or role...">
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
        <div class="users-header">
            <h1>User Management</h1>
            <div class="header-actions">
                <button class="btn btn-outline">
                    <i class="fas fa-filter"></i>
                    Filters
                </button>
                <button class="btn btn-outline">
                    <i class="fas fa-download"></i>
                    Export
                </button>
                <button class="btn btn-primary" id="addUserBtn">
                    <i class="fas fa-plus"></i>
                    Add User
                </button>
            </div>
        </div>

        <div class="users-filters">
            <div class="filter-group">
                <label>Role</label>
                <select class="form-control">
                    <option value="">All Roles</option>
                    <option value="tourist">Tourist</option>
                    <option value="guide">Guide</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Status</label>
                <select class="form-control">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Joined Date</label>
                <select class="form-control">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Sort By</label>
                <select class="form-control">
                    <option value="recent">Most Recent</option>
                    <option value="name">Name</option>
                    <option value="role">Role</option>
                    <option value="status">Status</option>
                </select>
            </div>
        </div>

        <div class="users-grid">
            <%
            // Get users from request attribute or use default data
            Object[] users = (Object[]) request.getAttribute("users");
            if (users == null) {
                // Default user data for demonstration
                String[][] defaultUsers = {
                    {"John Smith", "Tourist", "john.smith@email.com", "+63 912 345 6789", "Jun 15, 2024", "12", "8", "Active"},
                    {"Maria Santos", "Guide", "maria.santos@email.com", "+63 923 456 7890", "May 1, 2024", "25", "4.9", "Active"}
                };
                for (String[] user : defaultUsers) {
            %>
            <div class="user-card">
                <div class="user-header">
                    <img src="../img/profile-placeholder.jpg" alt="User" class="user-avatar">
                    <div class="user-info">
                        <h3><%= user[0] %></h3>
                        <span class="user-role"><%= user[1] %></span>
                    </div>
                    <button class="btn btn-icon">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                <div class="user-details">
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span><%= user[2] %></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span><%= user[3] %></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Joined <%= user[4] %></span>
                    </div>
                </div>
                <div class="user-stats">
                    <div class="user-stat">
                        <span class="stat-label"><%= user[1].equals("Tourist") ? "Bookings" : "Tours" %></span>
                        <span class="stat-value"><%= user[5] %></span>
                    </div>
                    <div class="user-stat">
                        <span class="stat-label"><%= user[1].equals("Tourist") ? "Reviews" : "Rating" %></span>
                        <span class="stat-value"><%= user[6] %></span>
                    </div>
                    <div class="user-stat">
                        <span class="stat-label">Status</span>
                        <span class="stat-value <%= user[7].toLowerCase() %>"><%= user[7] %></span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn-outline btn-sm">View Profile</button>
                    <button class="btn btn-outline btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm">Suspend</button>
                </div>
            </div>
            <%
                }
            } else {
                // Handle actual user data from the request
                // Add logic to display actual users
            }
            %>
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

        <!-- Add/Edit User Modal -->
        <div class="modal" id="userModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New User</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <form class="user-form" action="users" method="POST">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-control" name="fullName" placeholder="Enter full name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" name="email" placeholder="Enter email address" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" class="form-control" name="phone" placeholder="Enter phone number" required>
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select class="form-control" name="role" required>
                            <option value="tourist">Tourist</option>
                            <option value="guide">Guide</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" name="password" placeholder="Enter password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm password" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('userModal');
            const addUserBtn = document.getElementById('addUserBtn');
            const closeBtn = modal.querySelector('.close-btn');
            const editButtons = document.querySelectorAll('.btn-outline');
            const userForm = document.querySelector('.user-form');

            // Show modal for adding new user
            addUserBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                modal.querySelector('h2').textContent = 'Add New User';
                userForm.reset();
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

            // Edit user
            editButtons.forEach(button => {
                if (button.textContent === 'Edit') {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
                        modal.querySelector('h2').textContent = 'Edit User';
                        // Load user data into form
                        loadUserData(button.closest('.user-card'));
                    });
                }
            });

            // Form submission
            userForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add form validation
                const password = userForm.querySelector('input[name="password"]').value;
                const confirmPassword = userForm.querySelector('input[name="confirmPassword"]').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                // Submit form
                userForm.submit();
            });

            // Initialize filters
            document.querySelectorAll('.form-control').forEach(select => {
                select.addEventListener('change', () => {
                    // Filter users implementation
                });
            });

            // Initialize search
            const searchInput = document.querySelector('.search-bar input');
            searchInput.addEventListener('input', (e) => {
                // Search users implementation
            });
        });

        function loadUserData(userCard) {
            const form = document.querySelector('.user-form');
            const name = userCard.querySelector('h3').textContent;
            const email = userCard.querySelector('.fas.fa-envelope').nextElementSibling.textContent;
            const phone = userCard.querySelector('.fas.fa-phone').nextElementSibling.textContent;
            const role = userCard.querySelector('.user-role').textContent;
            const status = userCard.querySelector('.stat-value.active').textContent;

            form.querySelector('input[name="fullName"]').value = name;
            form.querySelector('input[name="email"]').value = email;
            form.querySelector('input[name="phone"]').value = phone;
            form.querySelector('select[name="role"]').value = role.toLowerCase();
            form.querySelector('select[name="status"]').value = status.toLowerCase();
        }
    </script>
</body>
</html> 