import { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { useSettings } from '../settingsStore';
import { CATEGORY_LABELS, type Category } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  navigate: (r: string) => void;
}

export default function Header({
  onOpenCart,
  onOpenFavorites,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  navigate,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, favorites } = useStore();
  const { settings } = useSettings();

  const categories: (Category | 'all')[] = ['all', 'camisetas', 'moletons', 'calcas', 'jaquetas', 'acessorios'];

  const handleCategoryClick = (cat: Category | 'all') => {
    onCategoryChange(cat);
    setMobileOpen(false);
  };

  const goHome = () => {
    handleCategoryClick('all');
    navigate('/');
  };

  const storeName = settings.storeName || 'FERRARI IMPORTS';
  const nameParts = storeName.split(' ');
  const nameFirst = nameParts[0] || 'FERRARI';
  const nameRest = nameParts.slice(1).join(' ') || 'IMPORTS';

  const promoParts = settings.promoMessage
    ? settings.promoMessage.split(/•|;/).map((s) => s.trim()).filter(Boolean)
    : ['FRETE GRÁTIS acima de R$ 299', 'PARCELE EM ATÉ 12X SEM JUROS', 'NOVOS DROPS TODA SEMANA'];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ferrari-black text-white text-xs py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {promoParts.map((p, i) => (
            <span key={i} className="mx-8">{p}</span>
          ))}
          <span className="mx-4">•</span>
          {promoParts.map((p, i) => (
            <span key={`r-${i}`} className="mx-8">{p}</span>
          ))}
          <span className="mx-4">•</span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex-shrink-0 p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <button
              onClick={goHome}
              className="flex-shrink-0 flex items-center gap-1"
            >
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={storeName}
                  className="h-7 lg:h-9 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <>
                  <span className="font-display text-xl lg:text-2xl tracking-tight">
                    {nameFirst}
                  </span>
                  <span className="font-display text-xl lg:text-2xl tracking-tight text-ferrari-red">
                    {nameRest}
                  </span>
                </>
              )}
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-sm font-medium uppercase tracking-wide transition-colors relative py-1 ${
                    activeCategory === cat
                      ? 'text-ferrari-red'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
                  {activeCategory === cat && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-ferrari-red" />
                  )}
                </button>
              ))}
            </nav>

            {/* Search (desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-xs relative">
              <Search size={18} className="absolute left-3 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:bg-white transition-all"
              />
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                className="hidden sm:flex p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Minha conta"
              >
                <User size={20} />
              </button>
              <button
                onClick={onOpenFavorites}
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Favoritos"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-ferrari-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={onOpenCart}
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Sacola"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-ferrari-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <span className="font-display text-lg">
                {nameFirst}<span className="text-ferrari-red"> {nameRest}</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full flex items-center justify-between py-3 px-2 text-left rounded-lg transition-colors ${
                    activeCategory === cat
                      ? 'bg-ferrari-red/5 text-ferrari-red font-semibold'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-sm uppercase tracking-wide font-medium">
                    {cat === 'all' ? 'Todos os produtos' : CATEGORY_LABELS[cat]}
                  </span>
                  <ChevronRight size={16} className="text-neutral-400" />
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-neutral-200">
              <button className="flex items-center gap-3 py-2 text-sm font-medium text-neutral-700">
                <User size={18} /> Minha conta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
