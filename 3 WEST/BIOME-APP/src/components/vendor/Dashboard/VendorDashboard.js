import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingBag,
    faUsers,
    faStar,
    faChartLine,
    faCalendarAlt,
    faExclamationCircle,
    faCheckCircle,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import { 
    fetchDashboardStats, 
    fetchRecentBookings, 
    fetchUpcomingTours 
} from '../../../api/vendorApi';

const VendorDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeCustomers: 0,
        averageRating: 0,
        pendingBookings: 0,
        completedTours: 0
    });

    const [recentBookings, setRecentBookings] = useState([]);
    const [upcomingTours, setUpcomingTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, bookingsData, toursData] = await Promise.all([
                fetchDashboardStats(),
                fetchRecentBookings(),
                fetchUpcomingTours()
            ]);

            setStats(statsData);
            setRecentBookings(bookingsData);
            setUpcomingTours(toursData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'ready':
                return 'bg-success';
            case 'pending':
                return 'bg-warning';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
                <button 
                    className="btn btn-outline-danger ms-3"
                    onClick={fetchDashboardData}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-grid">
            {/* Stats Overview */}
            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faShoppingBag} className="text-primary mb-3" size="2x" />
                        <h3>{stats.totalBookings}</h3>
                        <p className="text-secondary">Total Bookings</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faChartLine} className="text-success mb-3" size="2x" />
                        <h3>{formatCurrency(stats.totalRevenue)}</h3>
                        <p className="text-secondary">Total Revenue</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faStar} className="text-warning mb-3" size="2x" />
                        <h3>{stats.averageRating}</h3>
                        <p className="text-secondary">Average Rating</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faUsers} className="text-info mb-3" size="2x" />
                        <h3>{stats.activeCustomers}</h3>
                        <p className="text-secondary">Active Customers</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faClock} className="text-warning mb-3" size="2x" />
                        <h3>{stats.pendingBookings}</h3>
                        <p className="text-secondary">Pending Bookings</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="2x" />
                        <h3>{stats.completedTours}</h3>
                        <p className="text-secondary">Completed Tours</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Bookings</h5>
                        <button className="btn btn-sm btn-primary">View All</button>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="loading-skeleton" style={{ height: '200px' }}></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Customer</th>
                                            <th>Tour</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Participants</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td>{booking.id}</td>
                                                <td>{booking.customerName}</td>
                                                <td>{booking.tourName}</td>
                                                <td>{booking.date}</td>
                                                <td>{formatCurrency(booking.amount)}</td>
                                                <td>{booking.participants}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary me-2">
                                                        View
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary">
                                                        Message
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upcoming Tours */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Upcoming Tours</h5>
                        <button className="btn btn-sm btn-primary">Manage Tours</button>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="loading-skeleton" style={{ height: '200px' }}></div>
                        ) : (
                            <div className="row">
                                {upcomingTours.map(tour => (
                                    <div key={tour.id} className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="mb-1">{tour.name}</h6>
                                                        <p className="text-secondary mb-0">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                            {tour.date}
                                                        </p>
                                                    </div>
                                                    <span className={`badge ${getStatusBadgeClass(tour.status)}`}>
                                                        {tour.status}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="mb-1">
                                                        <strong>Guide:</strong> {tour.guide}
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong>Bookings:</strong> {tour.bookings}/{tour.capacity}
                                                    </p>
                                                </div>
                                                <div className="progress mb-3">
                                                    <div 
                                                        className="progress-bar bg-success" 
                                                        style={{ width: `${(tour.bookings / tour.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        View Details
                                                    </button>
                                                    {tour.status === 'Pending' && (
                                                        <button className="btn btn-sm btn-success">
                                                            Mark as Ready
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Quick Actions</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <button className="btn btn-primary w-100">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                    Create Tour
                                </button>
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-outline-primary w-100">
                                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                                    Manage Guides
                                </button>
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-outline-primary w-100">
                                    <FontAwesomeIcon icon={faChartLine} className="me-2" />
                                    View Reports
                                </button>
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-outline-primary w-100">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                                    Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard; 