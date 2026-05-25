import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faStar, 
    faImage, 
    faThumbsUp, 
    faReply, 
    faCamera 
} from '@fortawesome/free-solid-svg-icons';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
        fetchPendingReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // TODO: Implement API call
            // Mock data for now
            setReviews([
                {
                    id: 1,
                    tourName: 'Mountain Trek Adventure',
                    rating: 5,
                    comment: 'Amazing experience! The views were breathtaking.',
                    date: '2024-03-01',
                    images: ['trek1.jpg', 'trek2.jpg'],
                    likes: 12,
                    replies: 3
                },
                // Add more mock reviews
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoading(false);
        }
    };

    const fetchPendingReviews = async () => {
        try {
            // TODO: Implement API call
            setPendingReviews([
                {
                    id: 1,
                    tourName: 'Beach Paradise Tour',
                    tourDate: '2024-02-15',
                    deadline: '2024-03-15'
                }
            ]);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };

    const handleSubmitReview = async (tourId) => {
        try {
            // TODO: Implement API call to submit review
            console.log('Submitting review:', {
                tourId,
                rating,
                reviewText,
                images: selectedImages
            });
            
            // Clear form
            setRating(0);
            setReviewText('');
            setSelectedImages([]);
            
            // Refresh reviews
            fetchReviews();
            fetchPendingReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const renderStars = (count) => {
        return Array(5).fill(0).map((_, index) => (
            <FontAwesomeIcon 
                key={index}
                icon={faStar}
                className={index < count ? 'text-warning' : 'text-secondary'}
            />
        ));
    };

    return (
        <div className="dashboard-grid">
            {/* Review Statistics */}
            <div className="full-width">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-4">Your Review Statistics</h5>
                        <div className="row text-center">
                            <div className="col-md-3">
                                <h3>{reviews.length}</h3>
                                <p className="text-secondary">Total Reviews</p>
                            </div>
                            <div className="col-md-3">
                                <h3>4.5</h3>
                                <p className="text-secondary">Average Rating</p>
                            </div>
                            <div className="col-md-3">
                                <h3>{pendingReviews.length}</h3>
                                <p className="text-secondary">Pending Reviews</p>
                            </div>
                            <div className="col-md-3">
                                <h3>85%</h3>
                                <p className="text-secondary">With Photos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Reviews */}
            {pendingReviews.length > 0 && (
                <div className="full-width">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Pending Reviews</h5>
                        </div>
                        <div className="card-body">
                            {pendingReviews.map(tour => (
                                <div key={tour.id} className="border-bottom p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6>{tour.tourName}</h6>
                                            <p className="text-secondary mb-0">
                                                <small>Tour Date: {tour.tourDate}</small>
                                            </p>
                                        </div>
                                        <span className="badge bg-warning">
                                            Due by {tour.deadline}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rating</label>
                                        <div>
                                            {Array(5).fill(0).map((_, index) => (
                                                <FontAwesomeIcon 
                                                    key={index}
                                                    icon={faStar}
                                                    className={`me-2 ${index < rating ? 'text-warning' : 'text-secondary'}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setRating(index + 1)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Your Review</label>
                                        <textarea 
                                            className="form-control"
                                            rows="3"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="Share your experience..."
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Add Photos</label>
                                        <div className="d-flex gap-2 mb-2">
                                            {selectedImages.map((image, index) => (
                                                <div 
                                                    key={index}
                                                    className="position-relative"
                                                    style={{ width: '100px', height: '100px' }}
                                                >
                                                    <img 
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Upload ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                            <label 
                                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                <FontAwesomeIcon icon={faCamera} size="2x" />
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
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleSubmitReview(tour.id)}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Past Reviews */}
            <div className="full-width">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Your Reviews</h5>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="loading-skeleton" style={{ height: '200px' }}></div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-5">
                                <FontAwesomeIcon icon={faStar} size="3x" className="text-secondary mb-3" />
                                <h4>No reviews yet</h4>
                                <p className="text-secondary">Your submitted reviews will appear here</p>
                            </div>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="border-bottom p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6>{review.tourName}</h6>
                                        <small className="text-secondary">{review.date}</small>
                                    </div>
                                    <div className="mb-2">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p>{review.comment}</p>
                                    {review.images && review.images.length > 0 && (
                                        <div className="review-images mb-3">
                                            {review.images.map((image, index) => (
                                                <img 
                                                    key={index}
                                                    src={image}
                                                    alt={`Review ${index + 1}`}
                                                    className="rounded"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-sm btn-outline-primary">
                                            <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                                            {review.likes}
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary">
                                            <FontAwesomeIcon icon={faReply} className="me-1" />
                                            {review.replies}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews; 