// Guide Search and Filtering
const searchGuides = (query) => {
    // Implementation for searching guides by name, expertise, or location
    const searchResults = guides.filter(guide => {
        const searchString = `${guide.name} ${guide.expertise.join(' ')} ${guide.location}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
    });
    return searchResults;
};

const filterGuides = (filters) => {
    // Implementation for filtering guides by various criteria
    return guides.filter(guide => {
        let matches = true;
        if (filters.expertise) {
            matches = matches && guide.expertise.includes(filters.expertise);
        }
        if (filters.location) {
            matches = matches && guide.location === filters.location;
        }
        if (filters.rating) {
            matches = matches && guide.rating >= filters.rating;
        }
        if (filters.priceRange) {
            matches = matches && guide.basePrice >= filters.priceRange[0] && guide.basePrice <= filters.priceRange[1];
        }
        return matches;
    });
};

// Guide Profile Management
const loadGuideProfile = async (guideId) => {
    try {
        const response = await fetch(`/api/guides/${guideId}`);
        const guideData = await response.json();
        return guideData;
    } catch (error) {
        console.error('Error loading guide profile:', error);
        throw error;
    }
};

const updateGuideProfile = async (guideId, profileData) => {
    try {
        const response = await fetch(`/api/guides/${guideId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating guide profile:', error);
        throw error;
    }
};

// Booking Management
const checkAvailability = async (guideId, date) => {
    try {
        const response = await fetch(`/api/guides/${guideId}/availability?date=${date}`);
        const availability = await response.json();
        return availability;
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
};

const createBooking = async (bookingData) => {
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

// Review Management
const loadGuideReviews = async (guideId, filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/guides/${guideId}/reviews?${queryParams}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error loading guide reviews:', error);
        throw error;
    }
};

const submitReview = async (guideId, reviewData) => {
    try {
        const response = await fetch(`/api/guides/${guideId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};

// Tour Package Management
const loadTourPackages = async (guideId) => {
    try {
        const response = await fetch(`/api/guides/${guideId}/packages`);
        const packages = await response.json();
        return packages;
    } catch (error) {
        console.error('Error loading tour packages:', error);
        throw error;
    }
};

const calculateTourPrice = (packageId, numberOfPeople, date) => {
    // Implementation for calculating tour price based on various factors
    const basePrice = packages[packageId].basePrice;
    let finalPrice = basePrice * numberOfPeople;

    // Apply peak season surcharge
    const isPeakSeason = checkPeakSeason(date);
    if (isPeakSeason) {
        finalPrice *= 1.2; // 20% peak season surcharge
    }

    // Apply group discount
    if (numberOfPeople >= 5) {
        finalPrice *= 0.9; // 10% group discount
    }

    return finalPrice;
};

// Messaging System
const sendMessage = async (guideId, messageData) => {
    try {
        const response = await fetch(`/api/guides/${guideId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Utility Functions
const checkPeakSeason = (date) => {
    const peakSeasons = [
        { start: '12-15', end: '01-15' }, // Christmas and New Year
        { start: '03-15', end: '05-15' }, // Summer Season
    ];

    const checkDate = new Date(date);
    const month = checkDate.getMonth() + 1;
    const day = checkDate.getDate();
    const dateString = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return peakSeasons.some(season => {
        const [startMonth, startDay] = season.start.split('-').map(Number);
        const [endMonth, endDay] = season.end.split('-').map(Number);
        
        const start = new Date(checkDate.getFullYear(), startMonth - 1, startDay);
        const end = new Date(checkDate.getFullYear(), endMonth - 1, endDay);
        
        if (startMonth > endMonth) {
            end.setFullYear(end.getFullYear() + 1);
        }
        
        return checkDate >= start && checkDate <= end;
    });
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
};

const validateBookingData = (bookingData) => {
    const errors = {};

    if (!bookingData.tourPackage) {
        errors.tourPackage = 'Please select a tour package';
    }

    if (!bookingData.date) {
        errors.date = 'Please select a date';
    } else {
        const selectedDate = new Date(bookingData.date);
        const today = new Date();
        if (selectedDate < today) {
            errors.date = 'Please select a future date';
        }
    }

    if (!bookingData.numberOfPeople || bookingData.numberOfPeople < 1) {
        errors.numberOfPeople = 'Please enter a valid number of people';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize guide search
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchResults = searchGuides(e.target.value);
            updateSearchResults(searchResults);
        }, 300));
    }

    // Initialize booking form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const bookingData = {
                tourPackage: formData.get('tour'),
                date: formData.get('date'),
                numberOfPeople: parseInt(formData.get('people')),
                specialRequests: formData.get('requests'),
            };

            const validation = validateBookingData(bookingData);
            if (!validation.isValid) {
                displayValidationErrors(validation.errors);
                return;
            }

            try {
                const booking = await createBooking(bookingData);
                displayBookingConfirmation(booking);
            } catch (error) {
                displayErrorMessage('Failed to create booking. Please try again.');
            }
        });
    }

    // Initialize review filters
    const reviewFilter = document.querySelector('.filter-select');
    if (reviewFilter) {
        reviewFilter.addEventListener('change', async (e) => {
            const filters = {
                sort: e.target.value,
            };
            const guideId = getGuideIdFromUrl();
            const reviews = await loadGuideReviews(guideId, filters);
            updateReviewsList(reviews);
        });
    }
});

// Helper Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const displayValidationErrors = (errors) => {
    // Implementation for displaying form validation errors
    Object.entries(errors).forEach(([field, message]) => {
        const errorElement = document.querySelector(`.error-${field}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    });
};

const displayBookingConfirmation = (booking) => {
    // Implementation for displaying booking confirmation
    const confirmationModal = document.querySelector('.confirmation-modal');
    if (confirmationModal) {
        confirmationModal.querySelector('.booking-reference').textContent = booking.reference;
        confirmationModal.querySelector('.booking-details').innerHTML = `
            <p>Tour: ${booking.tourPackage}</p>
            <p>Date: ${new Date(booking.date).toLocaleDateString()}</p>
            <p>People: ${booking.numberOfPeople}</p>
            <p>Total: ${formatCurrency(booking.totalPrice)}</p>
        `;
        confirmationModal.style.display = 'block';
    }
};

const displayErrorMessage = (message) => {
    // Implementation for displaying error messages
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

const updateSearchResults = (results) => {
    // Implementation for updating search results in the UI
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = results.map(guide => `
            <div class="guide-card">
                <img src="${guide.photo}" alt="${guide.name}">
                <h3>${guide.name}</h3>
                <p>${guide.expertise.join(', ')}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(guide.rating))}</span>
                    <span class="rating-value">${guide.rating.toFixed(1)}</span>
                </div>
            </div>
        `).join('');
    }
};

const updateReviewsList = (reviews) => {
    // Implementation for updating reviews list in the UI
    const reviewsContainer = document.querySelector('.reviews-list');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <img src="${review.userPhoto}" alt="${review.userName}">
                    <div class="reviewer-info">
                        <h4>${review.userName}</h4>
                        <div class="review-meta">
                            <div class="rating-stars">${'★'.repeat(review.rating)}</div>
                            <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                ${review.photos ? `
                    <div class="review-photos">
                        ${review.photos.map(photo => `
                            <img src="${photo}" alt="Review Photo">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
};

const getGuideIdFromUrl = () => {
    // Implementation for extracting guide ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

// Tour Management Functions
const loadMyTours = async (guideId) => {
    try {
        const response = await fetch(`/api/guides/${guideId}/tours`);
        const tours = await response.json();
        displayTours(tours);
    } catch (error) {
        console.error('Error loading tours:', error);
        displayErrorMessage('Failed to load tours. Please try again.');
    }
};

const createTour = async (tourData) => {
    try {
        const response = await fetch('/api/tours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tourData),
        });
        const newTour = await response.json();
        displaySuccessMessage('Tour package created successfully!');
        return newTour;
    } catch (error) {
        console.error('Error creating tour:', error);
        displayErrorMessage('Failed to create tour. Please try again.');
        throw error;
    }
};

const updateTour = async (tourId, tourData) => {
    try {
        const response = await fetch(`/api/tours/${tourId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tourData),
        });
        const updatedTour = await response.json();
        displaySuccessMessage('Tour package updated successfully!');
        return updatedTour;
    } catch (error) {
        console.error('Error updating tour:', error);
        displayErrorMessage('Failed to update tour. Please try again.');
        throw error;
    }
};

const deleteTour = async (tourId) => {
    try {
        await fetch(`/api/tours/${tourId}`, {
            method: 'DELETE',
        });
        displaySuccessMessage('Tour package deleted successfully!');
    } catch (error) {
        console.error('Error deleting tour:', error);
        displayErrorMessage('Failed to delete tour. Please try again.');
        throw error;
    }
};

const displayTours = (tours) => {
    const tourGrid = document.querySelector('.tour-grid');
    if (!tourGrid) return;

    tourGrid.innerHTML = tours.map(tour => `
        <div class="tour-card" data-tour-id="${tour.id}">
            <div class="tour-image">
                <img src="${tour.image || '../../img/tour-placeholder.jpg'}" alt="${tour.title}">
                <span class="tour-status status-${tour.status.toLowerCase()}">${tour.status}</span>
            </div>
            <div class="tour-details">
                <h3 class="tour-title">${tour.title}</h3>
                <div class="tour-meta">
                    <span><i class="fas fa-clock"></i> ${tour.duration} hours</span>
                    <span><i class="fas fa-users"></i> Max ${tour.maxGroupSize} people</span>
                    <span><i class="fas fa-tag"></i> ₱${tour.price}</span>
                </div>
                <p class="tour-description">${tour.description}</p>
                <div class="tour-footer">
                    <span class="tour-price">₱${tour.price}</span>
                    <div class="tour-actions">
                        <button class="btn btn-outline btn-sm edit-tour" onclick="editTour('${tour.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-tour" onclick="deleteTour('${tour.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Booking Management Functions
const loadBookings = async (guideId, filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/guides/${guideId}/bookings?${queryParams}`);
        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
        displayErrorMessage('Failed to load bookings. Please try again.');
    }
};

const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const updatedBooking = await response.json();
        displaySuccessMessage(`Booking ${status.toLowerCase()} successfully!`);
        return updatedBooking;
    } catch (error) {
        console.error('Error updating booking status:', error);
        displayErrorMessage('Failed to update booking status. Please try again.');
        throw error;
    }
};

const displayBookings = (bookings) => {
    const bookingsList = document.querySelector('.bookings-list');
    if (!bookingsList) return;

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div class="booking-info">
                    <p class="booking-id">#${booking.id}</p>
                    <div class="tourist-info">
                        <div class="tourist-avatar">
                            <img src="${booking.tourist.avatar || '../../img/profile-placeholder.jpg'}" alt="${booking.tourist.name}">
                        </div>
                        <div>
                            <h4>${booking.tourist.name}</h4>
                            <p>${booking.tourist.email}</p>
                        </div>
                    </div>
                </div>
                <span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <div class="detail-item">
                    <span class="detail-label">Tour Package</span>
                    <span class="detail-value">${booking.tourPackage}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date & Time</span>
                    <span class="detail-value">${booking.date} at ${booking.time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Group Size</span>
                    <span class="detail-value">${booking.groupSize} people</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value">₱${booking.totalAmount}</span>
                </div>
            </div>
            <div class="booking-actions">
                ${getBookingActionButtons(booking.status, booking.id)}
            </div>
        </div>
    `).join('');

    // Add event listeners for action buttons
    addBookingActionListeners();
};

const getBookingActionButtons = (status, bookingId) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return `
                <button class="btn btn-success" onclick="updateBookingStatus('${bookingId}', 'CONFIRMED')">
                    <i class="fas fa-check"></i> Confirm
                </button>
                <button class="btn btn-danger" onclick="updateBookingStatus('${bookingId}', 'REJECTED')">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
        case 'confirmed':
            return `
                <button class="btn btn-primary" onclick="updateBookingStatus('${bookingId}', 'COMPLETED')">
                    <i class="fas fa-flag-checkered"></i> Mark as Completed
                </button>
                <button class="btn btn-danger" onclick="updateBookingStatus('${bookingId}', 'CANCELLED')">
                    <i class="fas fa-ban"></i> Cancel
                </button>
            `;
        default:
            return '';
    }
};

const addBookingActionListeners = () => {
    // Add event listeners for booking filters
    const filterInputs = document.querySelectorAll('.bookings-filter select, .bookings-filter input');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const filters = {
                status: document.querySelector('select[name="status"]').value,
                dateFrom: document.querySelector('input[name="dateFrom"]').value,
                dateTo: document.querySelector('input[name="dateTo"]').value,
            };
            loadBookings(getCurrentGuideId(), filters);
        });
    });
};

// Helper Functions
const getCurrentGuideId = () => {
    // Get the current guide's ID from auth context
    const user = auth.currentUser;
    return user ? user.uid : null;
};

const displaySuccessMessage = (message) => {
    // Implementation for displaying success messages
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

// Initialize features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const guideId = getCurrentGuideId();
    if (!guideId) return;

    // Load tours if on tours page
    if (window.location.pathname.includes('tours.html')) {
        loadMyTours(guideId);
    }

    // Load bookings if on bookings page
    if (window.location.pathname.includes('bookings.html')) {
        loadBookings(guideId);
    }
});

// Export functions for use in other modules
export {
    searchGuides,
    filterGuides,
    loadGuideProfile,
    updateGuideProfile,
    checkAvailability,
    createBooking,
    loadGuideReviews,
    submitReview,
    loadTourPackages,
    calculateTourPrice,
    sendMessage,
    formatCurrency,
    validateBookingData,
}; 