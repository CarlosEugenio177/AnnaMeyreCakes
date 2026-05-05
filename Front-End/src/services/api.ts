import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amc_admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Não foi possível concluir a solicitação.';
}
