import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api' 
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (adminInfo) {
    const parsed = JSON.parse(adminInfo);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo && !error.config?.url?.includes('/auth/admin-login')) {
        localStorage.removeItem('adminInfo');
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const authService = {
  login: (data) => api.post('/auth/admin-login', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const testimonialService = {
  getAll: (params) => api.get('/testimonials', { params }),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
  bulkDelete: (ids) => api.post('/testimonials/bulk-delete', { ids }),
  bulkUpdate: (ids, active) => api.post('/testimonials/bulk-update', { ids, active }),
  reorder: (items) => api.post('/testimonials/reorder', { items }),
};

export const uploadService = {
  image: (file, folder) => {
    const fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const settingService = {
  getAll: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getMaintenance: () => api.get('/settings/maintenance'),
};

export const faqService = {
  getAll: (params) => api.get('/faqs', { params }),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

export const complaintService = {
  create: (data) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

export default api;
