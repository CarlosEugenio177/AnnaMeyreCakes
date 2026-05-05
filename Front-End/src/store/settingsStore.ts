import { create } from 'zustand';
import type { Settings } from '../types';
import { getPublicSettings } from '../services/settingsService';

type SettingsState = {
  settings: Settings | null;
  isLoading: boolean;
  error?: string;
  loadSettings: () => Promise<void>;
  setSettings: (settings: Settings) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  loadSettings: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const settings = await getPublicSettings();
      set({ settings, isLoading: false });
    } catch {
      set({ error: 'Não foi possível carregar o status da loja.', isLoading: false });
    }
  },
  setSettings: (settings) => set({ settings }),
}));
