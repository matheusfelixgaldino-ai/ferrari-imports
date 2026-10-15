import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from './supabase';
import { PRODUCTS } from './data';
import type { Product, CategoryDef } from './types';

interface CatalogContextValue {
  products: Product[];
  categories: CategoryDef[];
  loading: boolean;
  refresh: () => Promise<void>;
  saveProduct: (p: Partial<Product> & { name: string; price: number }) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: number) => Promise<{ success: boolean; error?: string }>;
  togglePublish: (id: number, published: boolean) => Promise<{ success: boolean; error?: string }>;
  saveCategory: (c: Partial<CategoryDef> & { slug: string; label: string }) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: number) => Promise<{ success: boolean; error?: string }>;
  reorderCategories: (cats: CategoryDef[]) => Promise<{ success: boolean; error?: string }>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

const STATIC_CATEGORIES: CategoryDef[] = [
  { id: 1, slug: 'camisetas', label: 'Camisetas', sort_order: 1 },
  { id: 2, slug: 'moletons', label: 'Moletons', sort_order: 2 },
  { id: 3, slug: 'calcas', label: 'Calças', sort_order: 3 },
  { id: 4, slug: 'jaquetas', label: 'Jaquetas', sort_order: 4 },
  { id: 5, slug: 'acessorios', label: 'Acessórios', sort_order: 5 },
];

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryDef[]>(STATIC_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [{ data: prodData, error: prodErr }, { data: catData, error: catErr }] = await Promise.all([
        supabase.from('products').select('*').order('id'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);

      if (prodErr) throw prodErr;
      if (catErr) throw catErr;

      if (catData && catData.length > 0) {
        setCategories(catData as CategoryDef[]);
      }

      if (prodData && prodData.length > 0) {
        const mapped: Product[] = prodData.map((p: Record<string, unknown>) => ({
          id: p.id as number,
          name: p.name as string,
          category: (p.category_slug as string) || 'acessorios',
          price: Number(p.price),
          oldPrice: p.old_price ? Number(p.old_price) : undefined,
          image: (p.image as string) || '',
          sizes: (p.sizes as string[]) || [],
          badge: (p.badge as 'novo' | 'oferta' | 'bestseller') || undefined,
          description: (p.description as string) || '',
          stock: (p.stock as number) ?? 0,
          published: (p.published as boolean) ?? true,
          created_at: p.created_at as string,
          updated_at: p.updated_at as string,
        }));
        setProducts(mapped);
      }
    } catch {
      // keep static data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProduct = useCallback(
    async (p: Partial<Product> & { name: string; price: number }): Promise<{ success: boolean; error?: string }> => {
      try {
        const payload = {
          name: p.name,
          description: p.description || '',
          category_slug: p.category || 'acessorios',
          price: p.price,
          old_price: p.oldPrice ?? null,
          image: p.image || '',
          sizes: p.sizes || [],
          badge: p.badge || null,
          stock: p.stock ?? 0,
          published: p.published ?? true,
        };

        if (p.id) {
          const { error } = await supabase.from('products').update(payload).eq('id', p.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('products').insert(payload);
          if (error) throw error;
        }

        await refresh();
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar produto';
        return { success: false, error: msg };
      }
    },
    [refresh],
  );

  const deleteProduct = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await refresh();
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir produto';
        return { success: false, error: msg };
      }
    },
    [refresh],
  );

  const togglePublish = useCallback(
    async (id: number, published: boolean): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.from('products').update({ published }).eq('id', id);
        if (error) throw error;
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, published } : p)));
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao alterar status';
        return { success: false, error: msg };
      }
    },
    [],
  );

  const saveCategory = useCallback(
    async (c: Partial<CategoryDef> & { slug: string; label: string }): Promise<{ success: boolean; error?: string }> => {
      try {
        const payload = {
          slug: c.slug,
          label: c.label,
          sort_order: c.sort_order ?? 0,
        };

        if (c.id) {
          const { error } = await supabase.from('categories').update(payload).eq('id', c.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('categories').insert(payload);
          if (error) throw error;
        }

        await refresh();
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar categoria';
        return { success: false, error: msg };
      }
    },
    [refresh],
  );

  const deleteCategory = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        await refresh();
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir categoria';
        return { success: false, error: msg };
      }
    },
    [refresh],
  );

  const reorderCategories = useCallback(
    async (cats: CategoryDef[]): Promise<{ success: boolean; error?: string }> => {
      try {
        for (const cat of cats) {
          const { error } = await supabase.from('categories').update({ sort_order: cat.sort_order }).eq('id', cat.id);
          if (error) throw error;
        }
        setCategories(cats);
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao reordenar categorias';
        return { success: false, error: msg };
      }
    },
    [],
  );

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        loading,
        refresh,
        saveProduct,
        deleteProduct,
        togglePublish,
        saveCategory,
        deleteCategory,
        reorderCategories,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
