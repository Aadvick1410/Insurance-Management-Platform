import api from './api';

export const getDashboardMetrics = async () => {
  const response = await api.get('/api/reports/dashboard');
  return response.data;
};
