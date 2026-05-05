import { create } from 'zustand';
import type { SweetSelection } from '../types';

type OrderState = {
  selectedDoughId?: string;
  selectedCakeSizeId?: string;
  selectedFilling1Id?: string;
  selectedFilling2Id?: string;
  selectedToppingId?: string;
  sweets: SweetSelection[];
  updateOrder: (data: Partial<Omit<OrderState, 'updateOrder' | 'resetOrder' | 'setSweets'>>) => void;
  setSweets: (sweets: SweetSelection[]) => void;
  resetOrder: () => void;
};

const initialState = {
  selectedDoughId: undefined,
  selectedCakeSizeId: undefined,
  selectedFilling1Id: undefined,
  selectedFilling2Id: undefined,
  selectedToppingId: undefined,
  sweets: [],
};

export const useOrderStore = create<OrderState>((set) => ({
  ...initialState,
  updateOrder: (data) => set((state) => ({ ...state, ...data })),
  setSweets: (sweets) => set(() => ({ sweets })),
  resetOrder: () => set(() => ({ ...initialState })),
}));
