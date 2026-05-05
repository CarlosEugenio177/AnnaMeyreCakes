import { create } from 'zustand';
import type { LoginResponse } from '../types';

type AuthState = {
  token: string | null;
  user: LoginResponse['user'] | null;
  setSession: (session: LoginResponse) => void;
  logout: () => void;
};

const storedToken = localStorage.getItem('amc_admin_token');
const storedUser = localStorage.getItem('amc_admin_user');

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as LoginResponse['user']) : null,
  setSession: (session) => {
    localStorage.setItem('amc_admin_token', session.accessToken);
    localStorage.setItem('amc_admin_user', JSON.stringify(session.user));
    set({ token: session.accessToken, user: session.user });
  },
  logout: () => {
    localStorage.removeItem('amc_admin_token');
    localStorage.removeItem('amc_admin_user');
    set({ token: null, user: null });
  },
}));
