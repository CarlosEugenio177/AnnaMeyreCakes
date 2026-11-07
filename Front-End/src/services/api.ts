import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Por padrao a API e servida na mesma origem, em /api (Vercel em producao e
// proxy do Vite em desenvolvimento). VITE_API_URL permite apontar para outra API.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token do admin expirado ou invalido: encerra a sessao para o app voltar ao login.
    if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.headers?.Authorization) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

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
