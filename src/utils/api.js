// API utility functions

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
};

export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'POST', body: data }),
  
  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body: data }),
  
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

// Auth API calls
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Pantry API calls
export const pantryApi = {
  getItems: () => api.get('/pantry/items'),
  addItem: (item) => api.post('/pantry/items', item),
  updateItem: (id, item) => api.put(`/pantry/items/${id}`, item),
  deleteItem: (id) => api.delete(`/pantry/items/${id}`),
  getCategories: () => api.get('/pantry/categories'),
  getExpiringItems: (days = 7) => api.get(`/pantry/expiring?days=${days}`),
};
