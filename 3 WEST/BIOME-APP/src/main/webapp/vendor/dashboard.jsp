<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Dashboard - BIOME</title>
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="logo">
                <h2>BIOME Vendor</h2>
            </div>
            <ul class="nav-links">
                <li class="active"><a href="#"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="#"><i class="fas fa-box"></i> Products</a></li>
                <li><a href="#"><i class="fas fa-shopping-cart"></i> Orders</a></li>
                <li><a href="#"><i class="fas fa-chart-line"></i> Analytics</a></li>
                <li><a href="#"><i class="fas fa-star"></i> Reviews</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
            </ul>
        </nav>

        <main class="main-content">
            <header class="top-bar">
                <div class="search-bar">
                    <input type="text" placeholder="Search products...">
                </div>
                <div class="user-profile">
                    <span>Welcome, Vendor</span>
                    <img src="../images/vendor-avatar.jpg" alt="Vendor">
                </div>
            </header>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-shopping-cart"></i>
                    <div class="stat-info">
                        <h3>Total Orders</h3>
                        <p>156</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-box"></i>
                    <div class="stat-info">
                        <h3>Products</h3>
                        <p>45</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-dollar-sign"></i>
                    <div class="stat-info">
                        <h3>Revenue</h3>
                        <p>$12.5K</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div class="stat-info">
                        <h3>Rating</h3>
                        <p>4.8</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="grid-item recent-orders">
                    <h3>Recent Orders</h3>
                    <div class="order-list">
                        <!-- Orders will be populated here -->
                        <% for(int i = 0; i < 5; i++) { %>
                        <div class="order-item">
                            <div class="order-info">
                                <p>Order #1234</p>
                                <span>2 hours ago</span>
                            </div>
                            <div class="order-status">
                                <span class="status-pending">Pending</span>
                                <p class="order-amount">$125.00</p>
                            </div>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item product-list">
                    <h3>Top Products</h3>
                    <div class="product-items">
                        <!-- Products will be populated here -->
                        <% for(int i = 0; i < 5; i++) { %>
                        <div class="product-item">
                            <img src="../images/product-placeholder.jpg" alt="Product">
                            <div class="product-info">
                                <p>Product Name</p>
                                <span>$99.99</span>
                            </div>
                            <div class="product-stats">
                                <span><i class="fas fa-shopping-cart"></i> 24</span>
                                <span><i class="fas fa-star"></i> 4.5</span>
                            </div>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item recent-reviews">
                    <h3>Recent Reviews</h3>
                    <div class="review-list">
                        <!-- Reviews will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <img src="../images/user-avatar.jpg" alt="User">
                                    <span>John Doe</span>
                                </div>
                                <div class="review-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                </div>
                            </div>
                            <p class="review-text">Great product and fast delivery! Would definitely buy again.</p>
                        </div>
                        <% } %>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="../js/dashboard.js"></script>
</body>
</html> 