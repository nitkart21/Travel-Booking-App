import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Travel APIs
export const travelAPI = {
    getAll: (params) => api.get('/travel', { params }),
    getById: (id) => api.get(`/travel/${id}`),
    create: (data) => api.post('/travel', data),
    update: (id, data) => api.put(`/travel/${id}`, data),
    delete: (id) => api.delete(`/travel/${id}`),
};

// Booking APIs
export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: (params) => api.get('/bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.put(`/bookings/${id}/cancel`),
    getAll: (params) => api.get('/bookings/admin/all', { params }),
    updateStatus: (id, data) => api.put(`/bookings/admin/${id}`, data),
};

// Review APIs
export const reviewAPI = {
    create: (data) => api.post('/reviews', data),
    getByService: (serviceId, params) => api.get(`/reviews/service/${serviceId}`, { params }),
    getMyReviews: () => api.get('/reviews/my'),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
};

// Admin APIs
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Chatbot API
export const chatbotAPI = {
    sendMessage: (message) => api.post('/chatbot/message', { message }),
    getSuggestions: () => api.get('/chatbot/suggestions'),
};

// Flight API (Amadeus Integration)
export const flightAPI = {
    search: (params) => api.get('/flights/search', { params }),
    getAirports: (keyword) => api.get('/flights/airports', { params: { keyword } }),
    getCities: () => api.get('/flights/cities'),
    getPriceAnalysis: (origin, destination) => api.get('/flights/price-analysis', { params: { origin, destination } }),
};

export default api;

