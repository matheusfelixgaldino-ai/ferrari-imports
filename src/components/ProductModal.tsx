import { useEffect, useState } from 'react';
import { X, Heart, ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store';
import SmartImage from './SmartImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const fav = isFavorite(product.id);
  const formatPrice = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-neutral-100 overflow-hidden rounded-l-2xl">
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
              {product.category}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-ferrari-black leading-tight mb-3">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              {product.oldPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="text-2xl font-bold text-ferrari-red">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.oldPrice && (
              <span className="text-xs text-ferrari-red font-semibold mb-4">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% de desconto
              </span>
            )}

            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Tamanho
                </span>
                {selectedSize && (
                  <span className="text-xs text-neutral-500">
                    Selecionado: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] px-3 py-2.5 text-sm font-medium border rounded-lg transition-all ${
                      selectedSize === size
                        ? 'border-ferrari-black bg-ferrari-black text-white'
                        : 'border-neutral-300 hover:border-neutral-900 text-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-neutral-400 mt-2">
                  Selecione um tamanho para continuar
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="text-sm font-semibold uppercase tracking-wide mb-3 block">
                Quantidade
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-l-lg transition-colors"
                    aria-label="Diminuir"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-r-lg transition-colors"
                    aria-label="Aumentar"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => toggleFavorite(product.id)}
                className="w-12 h-12 flex items-center justify-center border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
                aria-label="Favoritar"
              >
                <Heart
                  size={20}
                  className={fav ? 'fill-ferrari-red text-ferrari-red' : 'text-neutral-700'}
                />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || added}
                className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-sm uppercase tracking-wide rounded-lg transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : selectedSize
                      ? 'bg-ferrari-red text-white hover:bg-ferrari-red-dark'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Adicionar à Sacola
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
