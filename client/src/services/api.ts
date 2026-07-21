import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-console
  console.log(`🌐 ${config.method?.toUpperCase()} -> ${config.url}`, config.data);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url;

    // Expected, so it's not ERROR
    if (url === "/auth/me" && error.response?.status === 401) {
      return Promise.reject(error);
    }

    console.error(
      "❌ Erro na API:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;