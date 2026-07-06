export type Product = {
  id: string;
  slug: string;
  name: string;
  color: 'Blanc' | 'Noir' | string;
  price: number;
  currency: 'MAD';
  sizes: string[];
  description: string;
  materials: string;
  image: string;
  featured?: boolean;
  stockStatus: 'en_stock' | 'rupture';
};

export type OrderPayload = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  color: string;
  note?: string;
};
