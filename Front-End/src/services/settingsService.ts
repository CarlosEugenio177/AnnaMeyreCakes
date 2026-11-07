import type { AdminSettings, Settings } from '../types';
import { api } from './api';

export async function getPublicSettings() {
  const { data } = await api.get<Settings>('/settings');
  return data;
}

export async function getAdminSettings() {
  const { data } = await api.get<AdminSettings>('/admin/settings');
  return data;
}

export async function updateAdminSettings(settings: Partial<AdminSettings>) {
  const { data } = await api.patch<AdminSettings>('/admin/settings', settings);
  return data;
}
