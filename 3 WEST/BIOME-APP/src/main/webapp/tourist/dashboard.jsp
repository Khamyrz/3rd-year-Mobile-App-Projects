<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tourist Dashboard - BIOME</title>
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="logo">
                <h2>BIOME Tourist</h2>
            </div>
            <ul class="nav-links">
                <li class="active"><a href="#"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="#"><i class="fas fa-map-marked-alt"></i> My Tours</a></li>
                <li><a href="#"><i class="fas fa-calendar-alt"></i> Itinerary</a></li>
                <li><a href="#"><i class="fas fa-user-tie"></i> Local Guides</a></li>
                <li><a href="#"><i class="fas fa-car"></i> Transportation</a></li>
                <li><a href="#"><i class="fas fa-star"></i> Reviews</a></li>
                <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
            </ul>
        </nav>

        <main class="main-content">
            <header class="top-bar">
                <div class="search-bar">
                    <input type="text" placeholder="Search tours and destinations...">
                </div>
                <div class="user-profile">
                    <span>Welcome, Tourist</span>
                    <img src="../img/tourist-avatar.jpg" alt="Tourist">
                </div>
            </header>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-map-marked-alt"></i>
                    <div class="stat-info">
                        <h3>Booked Tours</h3>
                        <p>5</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <div class="stat-info">
                        <h3>Completed</h3>
                        <p>3</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-info">
                        <h3>Upcoming</h3>
                        <p>2</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-heart"></i>
                    <div class="stat-info">
                        <h3>Favorites</h3>
                        <p>12</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="grid-item upcoming-tours">
                    <h3>Upcoming Tours</h3>
                    <div class="tour-list">
                        <!-- Tours will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="tour-item">
                            <img src="../images/tour-placeholder.jpg" alt="Tour">
                            <div class="tour-info">
                                <h4>Mountain Trek Adventure</h4>
                                <p><i class="fas fa-calendar"></i> June 15, 2024</p>
                                <p><i class="fas fa-clock"></i> Duration: 3 days</p>
                                <p><i class="fas fa-user-tie"></i> Guide: John Smith</p>
                            </div>
                            <div class="tour-actions">
                                <button class="btn-view-details">View Details</button>
                                <button class="btn-cancel">Cancel</button>
                            </div>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item recommended-guides">
                    <h3>Recommended Local Guides</h3>
                    <div class="guide-list">
                        <!-- Guides will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="guide-item">
                            <img src="../images/guide-avatar.jpg" alt="Guide">
                            <div class="guide-info">
                                <h4>Sarah Johnson</h4>
                                <p><i class="fas fa-map-marker-alt"></i> Mountain Region Expert</p>
                                <div class="guide-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span>(128 tours)</span>
                                </div>
                            </div>
                            <button class="btn-contact">Contact</button>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item transportation">
                    <h3>Available Transportation</h3>
                    <div class="transport-list">
                        <!-- Transport options will be populated here -->
                        <% for(int i = 0; i < 2; i++) { %>
                        <div class="transport-item">
                            <div class="transport-info">
                                <i class="fas fa-car"></i>
                                <div class="info">
                                    <h4>SUV - Premium</h4>
                                    <p>4 seats available</p>
                                    <p>Air-conditioned</p>
                                </div>
                            </div>
                            <div class="transport-price">
                                <p>$75/day</p>
                                <button class="btn-book">Book Now</button>
                            </div>
                        </div>
                        <% } %>
                    </div>
                </div>

                <div class="grid-item travel-history">
                    <h3>Travel History</h3>
                    <div class="history-list">
                        <!-- History will be populated here -->
                        <% for(int i = 0; i < 3; i++) { %>
                        <div class="history-item">
                            <div class="history-info">
                                <h4>Beach Paradise Tour</h4>
                                <p><i class="fas fa-calendar-alt"></i> May 1-3, 2024</p>
                                <p><i class="fas fa-map-marker-alt"></i> Coastal Region</p>
                            </div>
                            <div class="history-rating">
                                <button class="btn-review">Write Review</button>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
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