import api from './api';

export const getCustomers = async (page = 0, size = 10, search = '') => {
  const response = await api.get(`/api/customers?page=${page}&size=${size}${search ? `&search=${search}` : ''}`);
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/api/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await api.post('/api/customers', customerData);
  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const response = await api.put(`/api/customers/${id}`, customerData);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/api/customers/${id}`);
  return response.data;
};
