import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store';
import SmartImage from './SmartImage';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const badgeStyles: Record<string, string> = {
  novo: 'bg-emerald-500 text-white',
  oferta: 'bg-ferrari-red text-white',
  bestseller: 'bg-ferrari-black text-white',
};

const badgeLabels: Record<string, string> = {
  novo: 'NOVO',
  oferta: 'OFERTA',
  bestseller: 'MAIS VENDIDO',
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { toggleFavorite, isFavorite, addToCart } = useStore();
  const fav = isFavorite(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length === 1 && product.sizes[0] === 'Único') {
      addToCart(product, 'Único', 1);
    } else {
      onQuickView(product);
    }
  };

  const formatPrice = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div
      className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300"
      onClick={() => onQuickView(product)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <SmartImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${badgeStyles[product.badge]}`}
          >
            {badgeLabels[product.badge]}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
          aria-label="Favoritar"
        >
          <Heart
            size={18}
            className={fav ? 'fill-ferrari-red text-ferrari-red' : 'text-neutral-700'}
          />
        </button>

        {/* Quick actions overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/90 backdrop-blur-sm text-black py-2 text-xs font-semibold uppercase tracking-wide rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> Ver
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-ferrari-red text-white py-2 text-xs font-semibold uppercase tracking-wide rounded-lg hover:bg-ferrari-red-dark transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} /> Comprar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] uppercase tracking-wide text-neutral-500 mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-medium leading-snug text-neutral-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-bold text-ferrari-black">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.oldPrice && (
          <span className="text-[11px] text-ferrari-red font-semibold mt-1 block">
            {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
          </span>
        )}
        <div className="flex gap-1 mt-2 flex-wrap">
          {product.sizes.slice(0, 5).map((size) => (
            <span
              key={size}
              className="text-[10px] px-1.5 py-0.5 border border-neutral-300 rounded text-neutral-600 font-medium"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 5 && (
            <span className="text-[10px] px-1.5 py-0.5 text-neutral-500">
              +{product.sizes.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
