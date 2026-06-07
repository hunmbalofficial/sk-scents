import axios from 'axios';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
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
  getAll: (params?: Record<string, string>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const orderService = {
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  getAll: (params?: Record<string, string>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
};

export const authService = {
  login: (data: Record<string, string>) => api.post('/auth/admin-login', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const testimonialService = {
  getAll: (params?: Record<string, unknown>) => api.get('/testimonials', { params }),
  getById: (id: string) => api.get(`/testimonials/${id}`),
  create: (data: Record<string, unknown>) => api.post('/testimonials', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
  bulkDelete: (ids: string[]) => api.post('/testimonials/bulk-delete', { ids }),
  bulkUpdate: (ids: string[], active: boolean) => api.post('/testimonials/bulk-update', { ids, active }),
  reorder: (items: { id: string; order: number }[]) => api.post('/testimonials/reorder', { items }),
};

export const uploadService = {
  image: (file: File, folder?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const settingService = {
  getAll: () => api.get('/settings'),
  update: (data: Record<string, unknown>) => api.put('/settings', data),
  getMaintenance: () => api.get('/settings/maintenance'),
};

export const faqService = {
  getAll: (params?: Record<string, string>) => api.get('/faqs', { params }),
  create: (data: Record<string, unknown>) => api.post('/faqs', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/faqs/${id}`, data),
  delete: (id: string) => api.delete(`/faqs/${id}`),
};

export const complaintService = {
  create: (data: Record<string, unknown>) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  update: (id: string, data: Record<string, unknown>) => api.put(`/complaints/${id}`, data),
  delete: (id: string) => api.delete(`/complaints/${id}`),
};

export default api;
