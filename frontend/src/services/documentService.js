import api from './api';

export const uploadDocument = async (formData) => {
  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getDocumentsByCustomer = async (customerId) => {
  const response = await api.get(`/documents/customer/${customerId}`);
  return response.data;
};

export const getDocumentsByPolicy = async (policyId) => {
  const response = await api.get(`/documents/policy/${policyId}`);
  return response.data;
};

export const getDocumentsByClaim = async (claimId) => {
  const response = await api.get(`/documents/claim/${claimId}`);
  return response.data;
};

export const downloadDocument = async (id, fileName) => {
  const response = await api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};
