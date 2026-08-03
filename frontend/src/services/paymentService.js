import api from './api';

export const getPayments = async (page = 0, size = 10) => {
  const response = await api.get(`/api/payments?page=${page}&size=${size}`);
  return response.data;
};

export const getPaymentHistory = async (policyId) => {
  const response = await api.get(`/api/payments/policy/${policyId}`);
  return response.data;
};

export const recordPayment = async (paymentData) => {
  const response = await api.post('/api/payments', paymentData);
  return response.data;
};

export const getOverduePayments = async () => {
  const response = await api.get('/api/payments/overdue');
  return response.data;
};

export const getPaymentsDueSoon = async (days = 7) => {
  const response = await api.get(`/api/payments/due-soon?days=${days}`);
  return response.data;
};
