import api from './api';

export const getClaims = async (page = 0, size = 10) => {
  const response = await api.get(`/claims?page=${page}&size=${size}`);
  return response.data;
};

export const getClaimById = async (id) => {
  const response = await api.get(`/claims/${id}`);
  return response.data;
};

export const getClaimsByPolicy = async (policyId) => {
  const response = await api.get(`/claims/policy/${policyId}`);
  return response.data;
};

export const createClaim = async (claimData) => {
  const response = await api.post('/claims', claimData);
  return response.data;
};

export const updateClaimDetails = async (id, claimData) => {
  const response = await api.put(`/claims/${id}`, claimData);
  return response.data;
};

export const updateClaimStatus = async (id, status) => {
  const response = await api.patch(`/claims/${id}/status?status=${status}`);
  return response.data;
};
