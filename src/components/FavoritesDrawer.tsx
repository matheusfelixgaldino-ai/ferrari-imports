import { X, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';
import { PRODUCTS } from '../data';
import type { Product } from '../types';
import SmartImage from './SmartImage';

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
  onQuickView: (product: Product) => void;
}

export default function FavoritesDrawer({ open, onClose, onQuickView }: FavoritesDrawerProps) {
  const { favorites, toggleFavorite, addToCart } = useStore();

  if (!open) return null;

  const favProducts = PRODUCTS.filter((p) => favorites.includes(p.id));
  const formatPrice = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={20} />
            <h2 className="text-lg font-bold uppercase tracking-tight">
              Favoritos ({favProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {favProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Heart size={32} className="text-neutral-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Toque no coração dos produtos para salvá-los aqui.
            </p>
            <button
              onClick={onClose}
              className="bg-ferrari-black text-white px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-neutral-800 transition-colors"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {favProducts.map((product) => (
              <div key={product.id} className="flex gap-3 group">
                <button
                  onClick={() => {
                    onQuickView(product);
                    onClose();
                  }}
                  className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
                >
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-snug line-clamp-2">
                      {product.name}
                    </h4>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="text-neutral-400 hover:text-ferrari-red transition-colors flex-shrink-0"
                      aria-label="Remover dos favoritos"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => {
                        if (product.sizes.length === 1) {
                          addToCart(product, 'Único', 1);
                        } else {
                          onQuickView(product);
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1.5 bg-ferrari-red text-white px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors"
                    >
                      <ShoppingBag size={12} /> Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
