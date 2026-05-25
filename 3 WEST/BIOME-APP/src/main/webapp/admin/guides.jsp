<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME - Guide Management</title>
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
            <a href="guides.jsp" class="nav-item active">
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
            <input type="text" placeholder="Search guides by name, location, or specialty...">
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
        <div class="guides-header">
            <h1>Guide Management</h1>
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

        <div class="guide-verification">
            <div class="verification-header">
                <h2>Guide Applications</h2>
                <div class="verification-stats">
                    <%
                    int pendingCount = (Integer) request.getAttribute("pendingCount") != null ? 
                        (Integer) request.getAttribute("pendingCount") : 12;
                    int reviewCount = (Integer) request.getAttribute("reviewCount") != null ? 
                        (Integer) request.getAttribute("reviewCount") : 8;
                    int approvedCount = (Integer) request.getAttribute("approvedCount") != null ? 
                        (Integer) request.getAttribute("approvedCount") : 45;
                    int rejectedCount = (Integer) request.getAttribute("rejectedCount") != null ? 
                        (Integer) request.getAttribute("rejectedCount") : 15;
                    %>
                    <div class="stat">
                        <span class="stat-value"><%= pendingCount %></span>
                        <span class="stat-label">Pending</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value"><%= reviewCount %></span>
                        <span class="stat-label">Under Review</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value"><%= approvedCount %></span>
                        <span class="stat-label">Approved</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value"><%= rejectedCount %></span>
                        <span class="stat-label">Rejected</span>
                    </div>
                </div>
            </div>

            <div class="verification-steps">
                <div class="step completed">
                    <i class="fas fa-user-check"></i>
                    <h4>Identity Verification</h4>
                    <p>12 pending verifications</p>
                </div>
                <div class="step active">
                    <i class="fas fa-file-alt"></i>
                    <h4>Document Review</h4>
                    <p>8 documents to review</p>
                </div>
                <div class="step">
                    <i class="fas fa-certificate"></i>
                    <h4>License Validation</h4>
                    <p>5 licenses to validate</p>
                </div>
                <div class="step">
                    <i class="fas fa-check-circle"></i>
                    <h4>Final Approval</h4>
                    <p>3 guides awaiting approval</p>
                </div>
            </div>

            <div class="applications-list">
                <%
                Object[] applications = (Object[]) request.getAttribute("applications");
                if (applications == null) {
                    // Default application data for demonstration
                    String[][] defaultApplications = {
                        {"Maria Santos", "Cebu City, Philippines", "Jun 15, 2024", "75", "Document Review"},
                        {"John Rivera", "Palawan, Philippines", "Jun 14, 2024", "50", "License Validation"}
                    };
                    for (String[] application : defaultApplications) {
                %>
                <div class="application-item">
                    <div class="applicant-info">
                        <img src="../img/profile-placeholder.jpg" alt="Applicant" class="applicant-avatar">
                        <div class="applicant-details">
                            <h4><%= application[0] %></h4>
                            <p><%= application[1] %></p>
                            <span class="application-date">Applied: <%= application[2] %></span>
                        </div>
                    </div>
                    <div class="application-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: <%= application[3] %>%"></div>
                        </div>
                        <span class="progress-label"><%= Integer.parseInt(application[3]) / 25 %>/4 Steps Completed</span>
                    </div>
                    <div class="application-status <%= application[4].toLowerCase().replace(" ", "-") %>">
                        <%= application[4] %>
                    </div>
                    <div class="application-actions">
                        <button class="btn btn-primary">Review</button>
                        <button class="btn btn-outline">View Details</button>
                    </div>
                </div>
                <%
                    }
                } else {
                    // Handle actual application data from the request
                    // Add logic to display actual applications
                }
                %>
            </div>
        </div>

        <div class="guides-filters">
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
                <label>Specialty</label>
                <select class="form-control">
                    <option value="">All Specialties</option>
                    <option value="adventure">Adventure Tours</option>
                    <option value="cultural">Cultural Tours</option>
                    <option value="food">Food Tours</option>
                    <option value="nature">Nature Tours</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Rating</label>
                <select class="form-control">
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
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
        </div>

        <div class="guides-grid">
            <%
            Object[] guides = (Object[]) request.getAttribute("guides");
            if (guides == null) {
                // Default guide data for demonstration
                String[][] defaultGuides = {
                    {"Maria Santos", "4.9", "124", "Cebu City, Philippines", "156", "1.2K", "98", 
                     new String[]{"Adventure Tours", "Cultural Tours", "Food Tours"}},
                    {"John Rivera", "4.8", "98", "Palawan, Philippines", "132", "980", "95",
                     new String[]{"Nature Tours", "Island Hopping", "Diving"}}
                };
                for (String[] guide : defaultGuides) {
            %>
            <div class="guide-card">
                <div class="guide-header">
                    <img src="../img/profile-placeholder.jpg" alt="Guide" class="guide-avatar">
                    <div class="guide-info">
                        <h3><%= guide[0] %></h3>
                        <div class="guide-rating">
                            <i class="fas fa-star"></i>
                            <span><%= guide[1] %></span>
                            <span class="review-count">(<%= guide[2] %> reviews)</span>
                        </div>
                        <span class="guide-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <%= guide[3] %>
                        </span>
                    </div>
                    <button class="btn btn-icon">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                <div class="guide-stats">
                    <div class="stat">
                        <span class="stat-value"><%= guide[4] %></span>
                        <span class="stat-label">Tours</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value"><%= guide[5] %></span>
                        <span class="stat-label">Tourists</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value"><%= guide[6] %>%</span>
                        <span class="stat-label">Success</span>
                    </div>
                </div>
                <div class="guide-specialties">
                    <% for (String specialty : (String[]) guide[7]) { %>
                    <span class="specialty-tag"><%= specialty %></span>
                    <% } %>
                </div>
                <div class="guide-actions">
                    <button class="btn btn-outline btn-sm">View Profile</button>
                    <button class="btn btn-outline btn-sm">Tours</button>
                    <button class="btn btn-danger btn-sm">Suspend</button>
                </div>
            </div>
            <%
                }
            } else {
                // Handle actual guide data from the request
                // Add logic to display actual guides
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

        <!-- Guide Application Review Modal -->
        <div class="modal" id="applicationModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Guide Application Review</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="application-review">
                    <div class="applicant-profile">
                        <img src="../img/profile-placeholder.jpg" alt="Applicant" class="applicant-avatar">
                        <div class="applicant-info">
                            <h3>Maria Santos</h3>
                            <p>Cebu City, Philippines</p>
                            <span class="application-id">Application ID: APP-2024-001</span>
                        </div>
                    </div>
                    <div class="review-sections">
                        <div class="review-section">
                            <h4>Personal Information</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Full Name</label>
                                    <span>Maria Santos</span>
                                </div>
                                <div class="info-item">
                                    <label>Date of Birth</label>
                                    <span>January 15, 1990</span>
                                </div>
                                <div class="info-item">
                                    <label>Contact Number</label>
                                    <span>+63 912 345 6789</span>
                                </div>
                                <div class="info-item">
                                    <label>Email</label>
                                    <span>maria.santos@email.com</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-section">
                            <h4>Documents</h4>
                            <div class="document-list">
                                <div class="document-item">
                                    <i class="fas fa-id-card"></i>
                                    <span>Government ID</span>
                                    <button class="btn btn-outline btn-sm">View</button>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-certificate"></i>
                                    <span>Tourism License</span>
                                    <button class="btn btn-outline btn-sm">View</button>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Police Clearance</span>
                                    <button class="btn btn-outline btn-sm">View</button>
                                </div>
                            </div>
                        </div>
                        <div class="review-section">
                            <h4>Experience & Qualifications</h4>
                            <div class="qualifications-list">
                                <div class="qualification-item">
                                    <h5>Tour Guide Experience</h5>
                                    <p>5 years experience as a local guide in Cebu</p>
                                </div>
                                <div class="qualification-item">
                                    <h5>Languages</h5>
                                    <p>English (Fluent), Filipino (Native), Cebuano (Native)</p>
                                </div>
                                <div class="qualification-item">
                                    <h5>Certifications</h5>
                                    <p>DOT Accredited Tour Guide, First Aid Certified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="review-actions">
                        <div class="form-group">
                            <label>Review Notes</label>
                            <textarea class="form-control" rows="4" placeholder="Add your review notes here..."></textarea>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-danger">Reject</button>
                            <button class="btn btn-outline">Request More Info</button>
                            <button class="btn btn-primary">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('applicationModal');
            const reviewButtons = document.querySelectorAll('.btn-primary');
            const closeBtn = modal.querySelector('.close-btn');

            // Show modal for reviewing application
            reviewButtons.forEach(button => {
                if (button.textContent === 'Review') {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
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
                    // Filter guides implementation
                });
            });

            // Initialize search
            const searchInput = document.querySelector('.search-bar input');
            searchInput.addEventListener('input', (e) => {
                // Search guides implementation
            });
        });
    </script>
</body>
</html> 