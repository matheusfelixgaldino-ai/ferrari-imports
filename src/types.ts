export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  sizes: string[];
  badge?: 'novo' | 'oferta' | 'bestseller';
  description: string;
  stock?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryDef {
  id: number;
  slug: string;
  label: string;
  sort_order: number;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export const CATEGORY_LABELS: Record<string, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  calcas: 'Calças',
  jaquetas: 'Jaquetas',
  acessorios: 'Acessórios',
  conjuntos: 'Conjuntos',
  bermudas: 'Bermudas',
  ofertas: 'Ofertas',
};
