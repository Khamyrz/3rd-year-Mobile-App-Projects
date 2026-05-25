import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faCalendarAlt,
    faUsers,
    faMoneyBill,
    faComments,
    faFilter,
    faSort,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import {
    fetchBookings,
    updateBookingStatus,
    addBookingNote
} from '../../../api/vendorApi';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadBookings();
    }, [filterStatus, sortBy, searchQuery]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const filters = {
                status: filterStatus !== 'all' ? filterStatus : undefined,
                sortBy,
                search: searchQuery || undefined
            };
            const data = await fetchBookings(filters);
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
            setError('Failed to load bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            setError(null);
            await updateBookingStatus(bookingId, newStatus);
            loadBookings();
            if (selectedBooking?.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            setError('Failed to update booking status. Please try again.');
        }
    };

    const handleAddNote = async (bookingId, note) => {
        try {
            setError(null);
            await addBookingNote(bookingId, note);
            loadBookings();
            if (selectedBooking?.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, notes: note }));
            }
        } catch (error) {
            console.error('Error adding note:', error);
            setError('Failed to add note. Please try again.');
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
                return 'bg-success';
            case 'pending':
                return 'bg-warning';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadBookings();
    };

    return (
        <div className="dashboard-grid">
            {error && (
                <div className="full-width">
                    <div className="alert alert-danger" role="alert">
                        {error}
                        <button 
                            className="btn btn-outline-danger ms-3"
                            onClick={loadBookings}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="full-width">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <form onSubmit={handleSearch}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search bookings..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button className="btn btn-outline-primary" type="submit">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-4">
                                <select 
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select 
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="date">Tour Date</option>
                                    <option value="booking_date">Booking Date</option>
                                    <option value="amount">Amount</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="full-width">
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div className="loading-skeleton" style={{ height: '400px' }}></div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-5">
                                <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-secondary mb-3" />
                                <h4>No Bookings Found</h4>
                                <p className="text-secondary">No bookings match your current filters</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Tour</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Participants</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td>{booking.id}</td>
                                                <td>{booking.tourName}</td>
                                                <td>
                                                    <div>{booking.customerName}</div>
                                                    <small className="text-secondary">{booking.customerEmail}</small>
                                                </td>
                                                <td>
                                                    <div>{booking.date}</div>
                                                    <small className="text-secondary">Booked: {booking.bookingDate}</small>
                                                </td>
                                                <td>{booking.participants}</td>
                                                <td>{formatCurrency(booking.amount)}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            Details
                                                        </button>
                                                        {booking.status === 'Pending' && (
                                                            <>
                                                                <button 
                                                                    className="btn btn-sm btn-success"
                                                                    onClick={() => handleStatusChange(booking.id, 'Confirmed')}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                                                                >
                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
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

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedBooking(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h6>Tour Information</h6>
                                        <p className="mb-1">
                                            <strong>Tour:</strong> {selectedBooking.tourName}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Date:</strong> {selectedBooking.date}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Participants:</strong> {selectedBooking.participants}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Amount:</strong> {formatCurrency(selectedBooking.amount)}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Payment Status:</strong> {selectedBooking.paymentStatus}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Customer Information</h6>
                                        <p className="mb-1">
                                            <strong>Name:</strong> {selectedBooking.customerName}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Email:</strong> {selectedBooking.customerEmail}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Phone:</strong> {selectedBooking.customerPhone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6>Special Requests</h6>
                                    <p>{selectedBooking.specialRequests || 'None'}</p>
                                </div>

                                <div className="mb-4">
                                    <h6>Notes</h6>
                                    <div className="mb-3">
                                        <textarea 
                                            className="form-control"
                                            rows="3"
                                            placeholder="Add a note..."
                                            value={selectedBooking.notes}
                                            onChange={(e) => setSelectedBooking(prev => ({
                                                ...prev,
                                                notes: e.target.value
                                            }))}
                                        ></textarea>
                                    </div>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleAddNote(selectedBooking.id, selectedBooking.notes)}
                                    >
                                        Save Note
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <h6>Status Management</h6>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
                                            disabled={selectedBooking.status === 'Confirmed'}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                                            Confirm
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
                                            disabled={selectedBooking.status === 'Cancelled'}
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="me-2" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedBooking(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement; 