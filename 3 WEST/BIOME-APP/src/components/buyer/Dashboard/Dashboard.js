import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faCalendarAlt, 
    faBell, 
    faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        upcomingTours: 0,
        notifications: 0
    });

    useEffect(() => {
        // Fetch dashboard stats
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // TODO: Implement API call to fetch stats
            // For now using mock data
            setStats({
                totalOrders: 12,
                upcomingTours: 3,
                notifications: 5
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    return (
        <div className="dashboard-grid">
            {/* Stats Overview */}
            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-primary mb-3" size="2x" />
                        <h3>{stats.totalOrders}</h3>
                        <p className="text-secondary">Total Orders</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-success mb-3" size="2x" />
                        <h3>{stats.upcomingTours}</h3>
                        <p className="text-secondary">Upcoming Tours</p>
                    </div>
                </div>
            </div>

            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <FontAwesomeIcon icon={faBell} className="text-warning mb-3" size="2x" />
                        <h3>{stats.notifications}</h3>
                        <p className="text-secondary">New Notifications</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Recent Orders</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Tour</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* TODO: Implement order list */}
                                    <tr>
                                        <td>#12345</td>
                                        <td>Mountain Trek Adventure</td>
                                        <td>2024-03-15</td>
                                        <td><span className="badge bg-success">Confirmed</span></td>
                                        <td>$299.99</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                            Need Help?
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <h6>Contact Support</h6>
                                <p>Our team is here to help 24/7</p>
                                <button className="btn btn-primary">Contact Us</button>
                            </div>
                            <div className="col-md-4">
                                <h6>FAQs</h6>
                                <p>Find answers to common questions</p>
                                <button className="btn btn-outline-primary">View FAQs</button>
                            </div>
                            <div className="col-md-4">
                                <h6>Tour Guide</h6>
                                <p>Learn how to use the platform</p>
                                <button className="btn btn-outline-primary">Start Tour</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 