import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEdit,
    faTrash,
    faCalendarAlt,
    faUsers,
    faMoneyBill,
    faMapMarkerAlt,
    faImage,
    faSort,
    faFilter
} from '@fortawesome/free-solid-svg-icons';
import { 
    fetchTours,
    createTour,
    updateTour,
    deleteTour
} from '../../../api/vendorApi';

const TourManagement = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
        duration: '',
        location: '',
        date: '',
        images: [],
        included: [],
        excluded: [],
        requirements: []
    });

    useEffect(() => {
        loadTours();
    }, [filterStatus, sortBy]);

    const loadTours = async () => {
        try {
            setLoading(true);
            setError(null);
            const filters = {
                status: filterStatus !== 'all' ? filterStatus : undefined,
                sortBy
            };
            const data = await fetchTours(filters);
            setTours(data);
        } catch (error) {
            console.error('Error loading tours:', error);
            setError('Failed to load tours. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTour = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await createTour(formData);
            setShowCreateModal(false);
            resetForm();
            loadTours();
        } catch (error) {
            console.error('Error creating tour:', error);
            setError('Failed to create tour. Please try again.');
        }
    };

    const handleUpdateTour = async (tourId) => {
        try {
            setError(null);
            await updateTour(tourId, formData);
            setShowCreateModal(false);
            resetForm();
            loadTours();
        } catch (error) {
            console.error('Error updating tour:', error);
            setError('Failed to update tour. Please try again.');
        }
    };

    const handleDeleteTour = async (tourId) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                setError(null);
                await deleteTour(tourId);
                loadTours();
            } catch (error) {
                console.error('Error deleting tour:', error);
                setError('Failed to delete tour. Please try again.');
            }
        }
    };

    const handleEditTour = (tour) => {
        setSelectedTour(tour);
        setFormData({
            name: tour.name,
            description: tour.description,
            price: tour.price,
            capacity: tour.capacity,
            duration: tour.duration,
            location: tour.location,
            date: tour.date,
            images: tour.images,
            included: tour.included,
            excluded: tour.excluded,
            requirements: tour.requirements
        });
        setShowCreateModal(true);
    };

    const resetForm = () => {
        setSelectedTour(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            capacity: '',
            duration: '',
            location: '',
            date: '',
            images: [],
            included: [],
            excluded: [],
            requirements: []
        });
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleListInput = (e, field) => {
        const value = e.target.value;
        if (e.key === 'Enter' && value.trim()) {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            e.target.value = '';
        }
    };

    const removeListItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="dashboard-grid">
            {error && (
                <div className="full-width">
                    <div className="alert alert-danger" role="alert">
                        {error}
                        <button 
                            className="btn btn-outline-danger ms-3"
                            onClick={loadTours}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="full-width">
                <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-3">
                            <select 
                                className="form-select" 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select 
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Date</option>
                                <option value="price">Price</option>
                                <option value="bookings">Bookings</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Create Tour
                        </button>
                    </div>
                </div>
            </div>

            {/* Tours List */}
            <div className="full-width">
                {loading ? (
                    <div className="card">
                        <div className="card-body">
                            <div className="loading-skeleton" style={{ height: '400px' }}></div>
                        </div>
                    </div>
                ) : tours.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-secondary mb-3" />
                            <h4>No Tours Available</h4>
                            <p className="text-secondary">Start by creating your first tour!</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    resetForm();
                                    setShowCreateModal(true);
                                }}
                            >
                                Create Tour
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {tours.map(tour => (
                            <div key={tour.id} className="col-md-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="card-title">{tour.name}</h5>
                                                <p className="text-secondary mb-0">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                    {tour.date}
                                                </p>
                                            </div>
                                            <div className="btn-group">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEditTour(tour)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteTour(tour.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <small className="text-secondary d-block">
                                                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                                                    {tour.bookings}/{tour.capacity} Booked
                                                </small>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-secondary d-block">
                                                    <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                                                    ${tour.price}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="progress mb-3">
                                            <div 
                                                className="progress-bar bg-success" 
                                                style={{ width: `${(tour.bookings / tour.capacity) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-secondary mb-0">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                            {tour.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Tour Modal */}
            {showCreateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedTour ? 'Edit Tour' : 'Create New Tour'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={selectedTour ? () => handleUpdateTour(selectedTour.id) : handleCreateTour}>
                                    <div className="mb-3">
                                        <label className="form-label">Tour Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={formData.description}
                                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.price}
                                                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Capacity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.capacity}
                                                onChange={e => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Duration</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.duration}
                                                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.location}
                                                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.date}
                                            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Images</label>
                                        <div className="d-flex gap-2 mb-2">
                                            {formData.images.map((image, index) => (
                                                <div 
                                                    key={index}
                                                    className="position-relative"
                                                    style={{ width: '100px', height: '100px' }}
                                                >
                                                    <img 
                                                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                        alt={`Tour ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== index)
                                                        }))}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <label 
                                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                <FontAwesomeIcon icon={faImage} size="2x" />
                                                <input 
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">What's Included</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Press Enter to add item"
                                            onKeyPress={e => handleListInput(e, 'included')}
                                        />
                                        <div className="mt-2">
                                            {formData.included.map((item, index) => (
                                                <span key={index} className="badge bg-success me-2 mb-2">
                                                    {item}
                                                    <button
                                                        type="button"
                                                        className="btn-close ms-2"
                                                        onClick={() => removeListItem('included', index)}
                                                    ></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">What's Not Included</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Press Enter to add item"
                                            onKeyPress={e => handleListInput(e, 'excluded')}
                                        />
                                        <div className="mt-2">
                                            {formData.excluded.map((item, index) => (
                                                <span key={index} className="badge bg-danger me-2 mb-2">
                                                    {item}
                                                    <button
                                                        type="button"
                                                        className="btn-close ms-2"
                                                        onClick={() => removeListItem('excluded', index)}
                                                    ></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Requirements</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Press Enter to add item"
                                            onKeyPress={e => handleListInput(e, 'requirements')}
                                        />
                                        <div className="mt-2">
                                            {formData.requirements.map((item, index) => (
                                                <span key={index} className="badge bg-info me-2 mb-2">
                                                    {item}
                                                    <button
                                                        type="button"
                                                        className="btn-close ms-2"
                                                        onClick={() => removeListItem('requirements', index)}
                                                    ></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowCreateModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {selectedTour ? 'Update Tour' : 'Create Tour'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourManagement; 