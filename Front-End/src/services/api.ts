import axios from 'axios';

function resolveApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (typeof window === 'undefined') {
    return configuredUrl ?? 'http://localhost:3000';
  }

  const { protocol, hostname } = window.location;
  const isLocalFrontend = hostname === 'localhost' || hostname === '127.0.0.1';
  const configuredIsLocalhost = configuredUrl?.includes('localhost') || configuredUrl?.includes('127.0.0.1');

  if (configuredUrl && (!configuredIsLocalhost || isLocalFrontend)) {
    return configuredUrl;
  }

  return `${protocol}//${hostname}:3000`;
}

export const api = axios.create({
  baseURL: resolveApiUrl(),
  withCredentials: true,
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
