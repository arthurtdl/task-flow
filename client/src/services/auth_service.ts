import api from './api';
import { LoginCredentials, AuthResponse } from '@/types/auth_types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  me: async(): Promise<AuthResponse> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  logout: async(): Promise<void> => {
    await api.post('/auth/logout');
  }
};