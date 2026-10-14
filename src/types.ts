export type Category = 'camisetas' | 'moletons' | 'calcas' | 'jaquetas' | 'acessorios';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  sizes: string[];
  badge?: 'novo' | 'oferta' | 'bestseller';
  description: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  calcas: 'Calças',
  jaquetas: 'Jaquetas',
  acessorios: 'Acessórios',
};
