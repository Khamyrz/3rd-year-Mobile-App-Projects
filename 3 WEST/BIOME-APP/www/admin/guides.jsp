<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIOME Admin - Guide Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="../css/admin.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar (same as dashboard.jsp) -->
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
                <div class="position-sticky pt-3">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="dashboard.jsp">
                                <i class="fas fa-home"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="users.jsp">
                                <i class="fas fa-users"></i> Users
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="guides.jsp">
                                <i class="fas fa-compass"></i> Guides
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="tours.jsp">
                                <i class="fas fa-map"></i> Tours
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="bookings.jsp">
                                <i class="fas fa-calendar-check"></i> Bookings
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="reviews.jsp">
                                <i class="fas fa-star"></i> Reviews
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Guide Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">Print</button>
                        </div>
                    </div>
                </div>

                <!-- Application Status Overview -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card text-white bg-primary">
                            <div class="card-body">
                                <h5 class="card-title">Pending Applications</h5>
                                <h2 class="card-text"><%=request.getAttribute("pendingApplications") != null ? request.getAttribute("pendingApplications") : "0"%></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-success">
                            <div class="card-body">
                                <h5 class="card-title">Active Guides</h5>
                                <h2 class="card-text"><%=request.getAttribute("activeGuides") != null ? request.getAttribute("activeGuides") : "0"%></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-warning">
                            <div class="card-body">
                                <h5 class="card-title">Under Review</h5>
                                <h2 class="card-text"><%=request.getAttribute("underReview") != null ? request.getAttribute("underReview") : "0"%></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-danger">
                            <div class="card-body">
                                <h5 class="card-title">Rejected</h5>
                                <h2 class="card-text"><%=request.getAttribute("rejectedApplications") != null ? request.getAttribute("rejectedApplications") : "0"%></h2>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Guide Applications Table -->
                <div class="card mb-4">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" href="#pending">Pending</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#approved">Approved</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#rejected">Rejected</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Location</th>
                                        <th>Experience</th>
                                        <th>Status</th>
                                        <th>Documents</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <% if(request.getAttribute("guideApplications") != null) { %>
                                        <!-- Loop through applications -->
                                    <% } else { %>
                                        <tr>
                                            <td>G001</td>
                                            <td>Maria Santos</td>
                                            <td>Palawan</td>
                                            <td>5 years</td>
                                            <td><span class="badge bg-warning">Pending</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary">View</button>
                                            </td>
                                            <td>
                                                <div class="btn-group">
                                                    <button class="btn btn-sm btn-success">Approve</button>
                                                    <button class="btn btn-sm btn-danger">Reject</button>
                                                </div>
                                            </td>
                                        </tr>
                                    <% } %>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Document Verification Modal -->
                <div class="modal fade" id="documentModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Document Verification</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6>Government ID</h6>
                                        <img src="" class="img-fluid mb-3" alt="Government ID">
                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" id="idVerified">
                                            <label class="form-check-label" for="idVerified">
                                                Verified
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Tourism License</h6>
                                        <img src="" class="img-fluid mb-3" alt="Tourism License">
                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" id="licenseVerified">
                                            <label class="form-check-label" for="licenseVerified">
                                                Verified
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Notes</label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save Verification</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 