import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://insurance-backend-z3gy.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 400 && data.validationErrors) {
        Object.values(data.validationErrors).forEach(msg => toast.error(msg));
      } else if (data.message) {
        toast.error(data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;
