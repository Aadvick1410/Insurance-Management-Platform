import api from './api';

export const getDashboardMetrics = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};

export const downloadMonthlyReportPdf = async () => {
  const response = await api.get('/reports/pdf', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Monthly_Business_Report.pdf');
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
