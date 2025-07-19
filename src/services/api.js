import axios from 'axios';
import toast from 'react-hot-toast';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get booking history
  getBookingHistory: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings/history?${queryParams}`);
    return response.data;
  },

  // Get booking details by UUID
  getBookingDetails: async (uuid) => {
    const response = await api.get(`/bookings/${uuid}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (uuid, reason) => {
    const response = await api.patch(`/bookings/${uuid}/cancel`, { reason });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Format API error
  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      return error.response.data.errors.map(err => err.msg).join(', ');
    }
    return error.message || 'An unexpected error occurred';
  },
};

// Health check
export const healthCheck = async () => {
  try {
    // Only check health if backend URL is available
    if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
      // For demo purposes, return mock health data when backend is not available
      return {
        status: 'Demo Mode',
        environment: 'frontend-only',
        uptime: 0,
        message: 'Backend not available - running in demo mode'
      };
    }

    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    // Return demo mode status for deployment
    return {
      status: 'Demo Mode',
      environment: 'frontend-only',
      uptime: 0,
      message: 'Backend not available - running in demo mode'
    };
  }
};

export default api;
