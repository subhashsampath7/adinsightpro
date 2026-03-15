import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            window.location.href = '/login';
        }
        return Promise.reject(
            (error.response && error.response.data) || error.message
        );
    }
);

// Admin API
export const adminAPI = {
    login: (data) => api.post('/admin/login', data),
    getStats: () => api.get('/admin/stats'),
    getAllUsers: () => api.get('/admin/users'),
    getUserProfile: (userId) => api.get(`/admin/users/${userId}`),
    suspendUser: (data) => api.post('/admin/users/suspend', data), // ✅ NEW
    activateUser: (data) => api.post('/admin/users/activate', data), // ✅ NEW
    getPendingKYC: () => api.get('/admin/kyc/pending'),
    reviewKYC: (data) => api.post('/admin/kyc/review', data),
    getAllPayments: () => api.get('/admin/payments'),
    reviewPayment: (data) => api.post('/admin/payments/review', data),
    getAllLicenses: () => api.get('/admin/licenses'),
    updatePricing: (data) => api.put('/admin/pricing/update', data),
    getAllDiscountCodes: () => api.get('/admin/discount-codes'),
    createDiscountCode: (data) => api.post('/admin/discount-codes/create', data),
    toggleDiscountCode: (data) => api.put('/admin/discount-codes/toggle', data)
};

export default api;
