import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(
            (error.response && error.response.data) || error.message
        );
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me')
};

// User API
export const userAPI = {
    // ✅ Get user profile details
    getProfile: () => api.get('/user/profile'),
    
    // ✅ Update user profile
    updateProfile: (data) => api.put('/user/profile', data),
    
    // ✅ Get dashboard data
    getDashboard: () => api.get('/user/dashboard')
};

// KYC API
export const kycAPI = {
    submitKYC: (formData) => api.post('/kyc/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getKYCStatus: () => api.get('/kyc/status')
};

// Payment API
export const paymentAPI = {
    getPricingPlans: () => api.get('/payment/plans'),
    validateDiscountCode: (code) => api.post('/payment/validate-discount', { code }),
    createPayment: (data) => api.post('/payment/create', data),
    createCheckoutSession: (paymentId) => api.post('/payment/create-checkout-session', { paymentId }),
    verifyStripePayment: (data) => api.post('/payment/verify-stripe-payment', data),
    uploadPaymentProof: (formData) => api.post('/payment/upload-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getUserPayments: () => api.get('/payment/my-payments')
};

// License API
export const licenseAPI = {
    getUserLicenses: () => api.get('/license/my-licenses'),
    activateLicense: (key) => api.post('/license/activation', {
        key,
        extensionName: 'Google Ads Transparency'
    })
};

// Pricing API (Public)
export const pricingAPI = {
    getAllPlans: () => api.get('/pricing/plans'),
    getPlanById: (planId) => api.get(`/pricing/plans/${planId}`),
    calculatePrice: (planId, discountCode = null) =>
        api.post('/pricing/calculate', { plan_id: planId, discount_code: discountCode })
};

export default api;
