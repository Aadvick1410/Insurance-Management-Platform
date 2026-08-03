import api from './api';

export const getPayments = async (page = 0, size = 10) => {
  const response = await api.get(`/payments?page=${page}&size=${size}`);
  return response.data;
};

export const getPaymentHistory = async (policyId) => {
  const response = await api.get(`/payments/policy/${policyId}`);
  return response.data;
};

export const recordPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const getOverduePayments = async () => {
  const response = await api.get('/payments/overdue');
  return response.data;
};

export const getPaymentsDueSoon = async (days = 7) => {
  const response = await api.get(`/payments/due-soon?days=${days}`);
  return response.data;
};
