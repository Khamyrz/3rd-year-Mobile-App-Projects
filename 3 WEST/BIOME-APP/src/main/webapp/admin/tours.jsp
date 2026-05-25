<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - Tour Management</title>
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
            <a href="tours.jsp" class="nav-item active">
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
            <input type="text" placeholder="Search tours by name, location, or guide...">
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
        <div class="tours-header">
            <h1>Tour Management</h1>
            <div class="header-actions">
                <button class="btn btn-outline">
                    <i class="fas fa-filter"></i>
                    Filters
                </button>
                <button class="btn btn-outline">
                    <i class="fas fa-download"></i>
                    Export
                </button>
                <button class="btn btn-primary" id="addTourBtn">
                    <i class="fas fa-plus"></i>
                    Add Tour
                </button>
            </div>
        </div>

        <div class="tours-filters">
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
                <label>Category</label>
                <select class="form-control">
                    <option value="">All Categories</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="food">Food & Culinary</option>
                    <option value="nature">Nature & Wildlife</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Price Range</label>
                <select class="form-control">
                    <option value="">All Prices</option>
                    <option value="budget">Budget (Under ₱2,000)</option>
                    <option value="mid">Mid-Range (₱2,000-₱5,000)</option>
                    <option value="premium">Premium (Above ₱5,000)</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Status</label>
                <select class="form-control">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
        </div>

        <div class="tours-grid">
            <%
            Object[] tours = (Object[]) request.getAttribute("tours");
            if (tours == null) {
                // Default tour data for demonstration
                String[][] defaultTours = {
                    {"Cebu City Heritage Walk", "Cultural", "Cebu City", "Maria Santos", "4.9", "156", "₱2,500", "Active"},
                    {"Palawan Island Hopping", "Adventure", "Palawan", "John Rivera", "4.8", "132", "₱3,500", "Active"}
                };
                for (String[] tour : defaultTours) {
            %>
            <div class="tour-card">
                <div class="tour-header">
                    <img src="../img/tour-placeholder.jpg" alt="Tour" class="tour-image">
                    <div class="tour-info">
                        <h3><%= tour[0] %></h3>
                        <span class="tour-category"><%= tour[1] %></span>
                        <span class="tour-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <%= tour[2] %>
                        </span>
                    </div>
                </div>
                <div class="tour-guide">
                    <img src="../img/profile-placeholder.jpg" alt="Guide" class="guide-avatar">
                    <div class="guide-info">
                        <span class="guide-name"><%= tour[3] %></span>
                        <div class="guide-rating">
                            <i class="fas fa-star"></i>
                            <span><%= tour[4] %></span>
                            <span class="tour-count">(<%= tour[5] %> tours)</span>
                        </div>
                    </div>
                </div>
                <div class="tour-stats">
                    <div class="stat">
                        <span class="stat-label">Price</span>
                        <span class="stat-value"><%= tour[6] %></span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Status</span>
                        <span class="stat-value <%= tour[7].toLowerCase() %>"><%= tour[7] %></span>
                    </div>
                </div>
                <div class="tour-actions">
                    <button class="btn btn-outline btn-sm">View Details</button>
                    <button class="btn btn-outline btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm">Deactivate</button>
                </div>
            </div>
            <%
                }
            } else {
                // Handle actual tour data from the request
                // Add logic to display actual tours
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

        <!-- Add/Edit Tour Modal -->
        <div class="modal" id="tourModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Tour</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <form class="tour-form" action="tours" method="POST">
                    <div class="form-group">
                        <label>Tour Name</label>
                        <input type="text" class="form-control" name="tourName" placeholder="Enter tour name" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select class="form-control" name="category" required>
                            <option value="adventure">Adventure</option>
                            <option value="cultural">Cultural</option>
                            <option value="food">Food & Culinary</option>
                            <option value="nature">Nature & Wildlife</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <select class="form-control" name="location" required>
                            <option value="cebu">Cebu</option>
                            <option value="palawan">Palawan</option>
                            <option value="boracay">Boracay</option>
                            <option value="bohol">Bohol</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Guide</label>
                        <select class="form-control" name="guide" required>
                            <option value="1">Maria Santos</option>
                            <option value="2">John Rivera</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Price (₱)</label>
                        <input type="number" class="form-control" name="price" placeholder="Enter price" required>
                    </div>
                    <div class="form-group">
                        <label>Duration (hours)</label>
                        <input type="number" class="form-control" name="duration" placeholder="Enter duration" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control" name="description" rows="4" placeholder="Enter tour description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Inclusions</label>
                        <textarea class="form-control" name="inclusions" rows="4" placeholder="Enter tour inclusions"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Meeting Point</label>
                        <input type="text" class="form-control" name="meetingPoint" placeholder="Enter meeting point" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tour Images</label>
                        <input type="file" class="form-control" name="images" multiple accept="image/*">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Tour</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('tourModal');
            const addTourBtn = document.getElementById('addTourBtn');
            const closeBtn = modal.querySelector('.close-btn');
            const editButtons = document.querySelectorAll('.btn-outline');
            const tourForm = document.querySelector('.tour-form');

            // Show modal for adding new tour
            addTourBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                modal.querySelector('h2').textContent = 'Add New Tour';
                tourForm.reset();
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

            // Edit tour
            editButtons.forEach(button => {
                if (button.textContent === 'Edit') {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
                        modal.querySelector('h2').textContent = 'Edit Tour';
                        // Load tour data into form
                        loadTourData(button.closest('.tour-card'));
                    });
                }
            });

            // Form submission
            tourForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add form validation
                const price = tourForm.querySelector('input[name="price"]').value;
                const duration = tourForm.querySelector('input[name="duration"]').value;
                
                if (price <= 0) {
                    alert('Price must be greater than 0!');
                    return;
                }

                if (duration <= 0) {
                    alert('Duration must be greater than 0!');
                    return;
                }

                // Submit form
                tourForm.submit();
            });

            // Initialize filters
            document.querySelectorAll('.form-control').forEach(select => {
                select.addEventListener('change', () => {
                    // Filter tours implementation
                });
            });

            // Initialize search
            const searchInput = document.querySelector('.search-bar input');
            searchInput.addEventListener('input', (e) => {
                // Search tours implementation
            });
        });

        function loadTourData(tourCard) {
            const form = document.querySelector('.tour-form');
            const name = tourCard.querySelector('h3').textContent;
            const category = tourCard.querySelector('.tour-category').textContent;
            const location = tourCard.querySelector('.tour-location').textContent.trim();
            const guide = tourCard.querySelector('.guide-name').textContent;
            const price = tourCard.querySelector('.stat-value').textContent.replace('₱', '').replace(',', '');
            const status = tourCard.querySelector('.stat-value.active').textContent;

            form.querySelector('input[name="tourName"]').value = name;
            form.querySelector('select[name="category"]').value = category.toLowerCase();
            form.querySelector('select[name="location"]').value = location.toLowerCase();
            form.querySelector('select[name="guide"]').value = guide;
            form.querySelector('input[name="price"]').value = price;
            form.querySelector('select[name="status"]').value = status.toLowerCase();
        }
    </script>
</body>
</html> 