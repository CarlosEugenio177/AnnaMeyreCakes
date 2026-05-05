import type { LoginResponse } from '../types';
import { api } from './api';

export async function loginAdmin(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}
