import { Product } from '@/types/store';

export const seedProducts: Product[] = [
  {
    id: 'white-oversized-tee',
    slug: 'white-oversized-tee',
    name: 'Oversized Tee Blanc',
    color: 'Blanc',
    price: 249,
    currency: 'MAD',
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Coupe oversize propre, tombé lourd et présence minimaliste pour un look quotidien premium.',
    materials: 'Coton lourd premium, coupe ample, col renforcé',
    image: '/products/white-oversized-tee.svg',
    featured: true,
    stockStatus: 'en_stock'
  },
  {
    id: 'black-oversized-tee',
    slug: 'black-oversized-tee',
    name: 'Oversized Tee Noir',
    color: 'Noir',
    price: 249,
    currency: 'MAD',
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Version noir profond pour une silhouette plus cinématique et urbaine, pensée pour le layering.',
    materials: 'Coton lourd premium, coupe ample, finition dense',
    image: '/products/black-oversized-tee.svg',
    featured: true,
    stockStatus: 'en_stock'
  }
];
