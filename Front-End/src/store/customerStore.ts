import { create } from 'zustand';
import { getCurrentCustomer, logoutCustomer } from '../services/customerService';
import type { CustomerProfile } from '../types';

type CustomerState = {
  customer: CustomerProfile | null;
  isLoaded: boolean;
  loadCustomer: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customer: null,
  isLoaded: false,
  loadCustomer: async () => {
    try {
      const customer = await getCurrentCustomer();
      set({ customer, isLoaded: true });
    } catch {
      set({ customer: null, isLoaded: true });
    }
  },
  logout: async () => {
    await logoutCustomer();
    set({ customer: null, isLoaded: true });
  },
}));
