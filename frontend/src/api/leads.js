import apiClient from './axios';


export const createLead = async (leadData) => {
  const response = await apiClient.post('/api/leads', leadData);
  return response.data;
};


export const fetchLeads = async () => {
  const response = await apiClient.get('/api/leads');
  return response.data;
};


export const updateLeadStatus = async (id, status) => {
  const response = await apiClient.patch(`/api/leads/${id}`, { status });
  return response.data;
};


export const deleteLead = async (id) => {
  const response = await apiClient.delete(`/api/leads/${id}`);
  return response.data;
};
