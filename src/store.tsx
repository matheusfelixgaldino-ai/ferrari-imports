import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from './types';

interface StoreContextValue {
  cart: CartItem[];
  favorites: number[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = 'ferrari_cart';
const FAV_KEY = 'ferrari_favorites';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      const savedFavs = localStorage.getItem(FAV_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {
      // ignore corrupted state
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = useCallback((product: Product, size: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites],
  );

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
