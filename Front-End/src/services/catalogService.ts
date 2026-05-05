import type { Catalog } from '../types';
import { api } from './api';

export async function getCatalog() {
  const { data } = await api.get<Catalog>('/catalog');
  return data;
}
