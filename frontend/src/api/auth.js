import apiClient from './axios';


export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};
