import type { Settings } from '../types';
import { api } from './api';

export async function getPublicSettings() {
  const { data } = await api.get<Settings>('/settings');
  return data;
}

export async function getAdminSettings() {
  const { data } = await api.get<Settings>('/admin/settings');
  return data;
}

export async function updateAdminSettings(settings: Partial<Settings>) {
  const { data } = await api.patch<Settings>('/admin/settings', settings);
  return data;
}
