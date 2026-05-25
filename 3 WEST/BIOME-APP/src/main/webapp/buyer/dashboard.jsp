<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buyer Dashboard - BIOME</title>
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="logo">
                <h2>BIOME Buyer</h2>
            </div>
            <ul class="nav-links">
                <li class="active"><a href="#"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="#"><i class="fas fa-shopping-bag"></i> My Orders</a></li>
                <li><a href="#"><i class="fas fa-heart"></i> Wishlist</a></li>
                <li><a href="#"><i class="fas fa-map-marker-alt"></i> Track Orders</a></li>
                <li><a href="#"><i class="fas fa-star"></i> Reviews</a></li>
                <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
            </ul>
        </nav>

        <main class="main-content">
            <header class="top-bar">
                <div class="search-bar">
                    <input type="text" placeholder="Search products...">
                </div>
                <div class="user-profile">
                    <span>Welcome, Buyer</span>
                    <img src="../images/buyer-avatar.jpg" alt="Buyer">
                </div>
            </header>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-shopping-bag"></i>
                    <div class="stat-info">
                        <h3>Total Orders</h3>
                        <p>12</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-box"></i>
                    <div class="stat-info">
                        <h3>In Progress</h3>
                        <p>3</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-heart"></i>
                    <div class="stat-info">
                        <h3>Wishlist</h3>
                        <p>8</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div class="stat-info">
                        <h3>Reviews Given</h3>
                        <p>15</p>
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
                                <span>Ordered on: June 1, 2024</span>
                            </div>
                            <div class="order-status">
                                <span class="status-delivered">Delivered</span>
                                <p class="order-amount">$125.00</p>
                            </div>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item wishlist">
                    <h3>Wishlist Items</h3>
                    <div class="product-items">
                        <!-- Wishlist items will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="product-item">
                            <img src="../images/product-placeholder.jpg" alt="Product">
                            <div class="product-info">
                                <p>Product Name</p>
                                <span>$99.99</span>
                            </div>
                            <button class="btn-add-cart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item tracking">
                    <h3>Order Tracking</h3>
                    <div class="tracking-list">
                        <!-- Tracking info will be populated here -->
                        <div class="tracking-item">
                            <div class="tracking-status">
                                <i class="fas fa-truck"></i>
                                <div class="status-info">
                                    <p>Order #1234 is out for delivery</p>
                                    <span>Expected delivery: June 5, 2024</span>
                                </div>
                            </div>
                            <a href="#" class="btn-track">Track</a>
                        </div>
                    </div>
                </div>

                <div class="grid-item recommended">
                    <h3>Recommended for You</h3>
                    <div class="product-items">
                        <!-- Recommended products will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="product-item">
                            <img src="../images/product-placeholder.jpg" alt="Product">
                            <div class="product-info">
                                <p>Product Name</p>
                                <span>$79.99</span>
                            </div>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <span>4.5 (128 reviews)</span>
                            </div>
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