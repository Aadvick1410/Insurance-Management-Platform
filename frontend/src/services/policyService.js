import api from './api';

export const getPolicies = async (page = 0, size = 10, search = '', status = '') => {
  let url = `/policies?page=${page}&size=${size}`;
  if (search) url += `&search=${search}`;
  if (status) url += `&status=${status}`;
  const response = await api.get(url);
  return response.data;
};

export const getPolicyById = async (id) => {
  const response = await api.get(`/policies/${id}`);
  return response.data;
};

export const createPolicy = async (policyData) => {
  const response = await api.post('/policies', policyData);
  return response.data;
};

export const updatePolicy = async (id, policyData) => {
  const response = await api.put(`/policies/${id}`, policyData);
  return response.data;
};

export const renewPolicy = async (id) => {
  const response = await api.put(`/policies/${id}/renew`);
  return response.data;
};

export const cancelPolicy = async (id) => {
  const response = await api.put(`/policies/${id}/cancel`);
  return response.data;
};
