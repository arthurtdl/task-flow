import api from './api';
import { User, CreateUser } from '@/types/user_types'

export const userService = {
  createUser: async (data: CreateUser): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get(`/users/${email}`);
    return response.data.data;
  },
};