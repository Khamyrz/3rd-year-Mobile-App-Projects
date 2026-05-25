import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Dashboard API functions
export const fetchDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/stats`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch dashboard statistics');
    }
};

export const fetchRecentBookings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/recent-bookings`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch recent bookings');
    }
};

export const fetchUpcomingTours = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/upcoming-tours`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch upcoming tours');
    }
};

// Tour Management API functions
export const fetchTours = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/tours`, { params: filters });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch tours');
    }
};

export const createTour = async (tourData) => {
    try {
        const formData = new FormData();
        Object.keys(tourData).forEach(key => {
            if (key === 'images') {
                tourData[key].forEach(image => {
                    formData.append('images', image);
                });
            } else if (Array.isArray(tourData[key])) {
                formData.append(key, JSON.stringify(tourData[key]));
            } else {
                formData.append(key, tourData[key]);
            }
        });

        const response = await axios.post(`${API_BASE_URL}/vendor/tours`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to create tour');
    }
};

export const updateTour = async (tourId, tourData) => {
    try {
        const formData = new FormData();
        Object.keys(tourData).forEach(key => {
            if (key === 'images') {
                tourData[key].forEach(image => {
                    if (image instanceof File) {
                        formData.append('images', image);
                    }
                });
                formData.append('existingImages', JSON.stringify(tourData[key].filter(image => !(image instanceof File))));
            } else if (Array.isArray(tourData[key])) {
                formData.append(key, JSON.stringify(tourData[key]));
            } else {
                formData.append(key, tourData[key]);
            }
        });

        const response = await axios.put(`${API_BASE_URL}/vendor/tours/${tourId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update tour');
    }
};

export const deleteTour = async (tourId) => {
    try {
        await axios.delete(`${API_BASE_URL}/vendor/tours/${tourId}`);
    } catch (error) {
        throw new Error('Failed to delete tour');
    }
};

// Booking Management API functions
export const fetchBookings = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/bookings`, { params: filters });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch bookings');
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/vendor/bookings/${bookingId}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update booking status');
    }
};

export const addBookingNote = async (bookingId, note) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/vendor/bookings/${bookingId}/notes`, { note });
        return response.data;
    } catch (error) {
        throw new Error('Failed to add booking note');
    }
};

// Analytics and Reports
export const fetchRevenueAnalytics = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/analytics/revenue`, { params: { period } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch revenue analytics');
    }
};

export const fetchBookingAnalytics = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/analytics/bookings`, { params: { period } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch booking analytics');
    }
};

export const generateReport = async (type, dateRange) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/reports/${type}`, {
            params: dateRange,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to generate report');
    }
};

// Profile and Settings
export const updateVendorProfile = async (profileData) => {
    try {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (key === 'logo' && profileData[key] instanceof File) {
                formData.append('logo', profileData[key]);
            } else {
                formData.append(key, profileData[key]);
            }
        });

        const response = await axios.put(`${API_BASE_URL}/vendor/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update vendor profile');
    }
};

export const updateVendorSettings = async (settings) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/vendor/settings`, settings);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update vendor settings');
    }
}; 