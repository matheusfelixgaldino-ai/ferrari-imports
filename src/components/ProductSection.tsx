import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}

export default function ProductSection({ id, title, subtitle, products, onQuickView }: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id={id} className="py-10 sm:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ferrari-black leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start flex-shrink-0 w-[220px] sm:w-[260px] lg:w-[280px]"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
