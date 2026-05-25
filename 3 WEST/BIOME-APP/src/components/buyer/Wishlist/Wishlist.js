import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHeart, 
    faShare, 
    faFilter, 
    faSort 
} from '@fortawesome/free-solid-svg-icons';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date');
    const [filterBy, setFilterBy] = useState('all');

    useEffect(() => {
        fetchWishlistItems();
    }, [sortBy, filterBy]);

    const fetchWishlistItems = async () => {
        try {
            // TODO: Implement API call
            // Mock data for now
            setWishlistItems([
                {
                    id: 1,
                    title: 'Beach Paradise Tour',
                    image: 'beach-tour.jpg',
                    price: 399.99,
                    rating: 4.5,
                    location: 'Maldives',
                    date: '2024-04-01'
                },
                // Add more mock items
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setLoading(false);
        }
    };

    const handleShare = (itemId) => {
        // TODO: Implement share functionality
        console.log('Sharing item:', itemId);
    };

    const handleRemove = (itemId) => {
        setWishlistItems(items => items.filter(item => item.id !== itemId));
        // TODO: Implement API call to remove item
    };

    return (
        <div className="dashboard-grid">
            {/* Controls */}
            <div className="full-width">
                <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-3">
                            <select 
                                className="form-select" 
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                            >
                                <option value="all">All Tours</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="popular">Popular</option>
                            </select>
                            <select 
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Date</option>
                                <option value="price">Price</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFilter} className="me-3" />
                            <FontAwesomeIcon icon={faSort} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Wishlist Items */}
            {loading ? (
                <div className="full-width">
                    <div className="card loading-skeleton" style={{ height: '200px' }}></div>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="full-width">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <FontAwesomeIcon icon={faHeart} size="3x" className="text-secondary mb-3" />
                            <h4>Your wishlist is empty</h4>
                            <p className="text-secondary">Start exploring tours to add to your wishlist!</p>
                            <button className="btn btn-primary">Explore Tours</button>
                        </div>
                    </div>
                </div>
            ) : (
                wishlistItems.map(item => (
                    <div key={item.id} className="half-width">
                        <div className="card">
                            <img 
                                src={item.image} 
                                className="card-img-top" 
                                alt={item.title}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="card-title mb-2">{item.title}</h5>
                                    <span className="badge bg-primary">${item.price}</span>
                                </div>
                                <p className="card-text text-secondary mb-2">
                                    <small>{item.location}</small>
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="star-rating">
                                        {/* Implement star rating component */}
                                        {item.rating} ★
                                    </div>
                                    <div>
                                        <button 
                                            className="btn btn-outline-primary btn-sm me-2"
                                            onClick={() => handleShare(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faShare} /> Share
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faHeart} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Wishlist; 