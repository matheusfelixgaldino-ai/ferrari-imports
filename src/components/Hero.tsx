import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_IMAGES } from '../data';
import SmartImage from './SmartImage';

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setCurrent((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);

  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden bg-neutral-900">
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SmartImage
            src={img}
            alt="Modelo usando streetwear Ferrari Imports"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <span className="inline-block text-ferrari-red text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in">
              Nova Coleção 2026
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6 animate-fade-in text-balance">
              STREETWEAR<br />
              QUE DEFINE<br />
              A RUA
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md leading-relaxed animate-fade-in">
              Peças exclusivas importadas com design urbano premium. Camisetas, moletons, calças e mais — para quem vive a cultura street.
            </p>
            <div className="flex gap-4 animate-fade-in">
              <a
                href="#produtos"
                className="bg-ferrari-red text-white px-8 py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors rounded-full"
              >
                Comprar Agora
              </a>
              <a
                href="#novidades"
                className="border border-white/40 text-white px-8 py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-all rounded-full"
              >
                Novidades
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all"
        aria-label="Próximo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${
              current === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
