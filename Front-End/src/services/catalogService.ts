import type { Catalog } from '../types';
import { api } from './api';

export async function getCatalog() {
  const { data } = await api.get<PublicCatalog>('/catalog');
  return toCatalog(data);
}

type PublicCatalog = {
  doughs: Array<{ publicId: string; name: string; colorHex: string }>;
  fillings: Array<{ publicId: string; name: string; extraPrice: string | number; colorHex: string }>;
  toppings: Array<{ publicId: string; name: string; colorHex: string }>;
  cakeSizes: Array<{ publicId: string; slices: number; price: string | number }>;
  sweetTypes: Array<{
    publicId: string;
    name: string;
    pricePer100: string | number;
    flavors: Array<{ publicId: string; name: string; sweetTypePublicId: string }>;
  }>;
};

function toCatalog(data: PublicCatalog): Catalog {
  return {
    doughs: data.doughs.map((item) => ({ ...item, id: item.publicId })),
    fillings: data.fillings.map((item) => ({ ...item, id: item.publicId })),
    toppings: data.toppings.map((item) => ({ ...item, id: item.publicId })),
    cakeSizes: data.cakeSizes.map((item) => ({ ...item, id: item.publicId })),
    sweetTypes: data.sweetTypes.map((item) => ({
      ...item,
      id: item.publicId,
      flavors: item.flavors.map((flavor) => ({
        ...flavor,
        id: flavor.publicId,
        sweetTypeId: flavor.sweetTypePublicId,
      })),
    })),
  };
}
