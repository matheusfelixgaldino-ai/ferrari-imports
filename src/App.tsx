import { useMemo, useState, useEffect } from 'react';
import { StoreProvider } from './store';
import { SettingsProvider, useSettings } from './settingsStore';
import { PRODUCTS, HERO_IMAGES } from './data';
import { CATEGORY_LABELS, type Category, type Product } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductSection from './components/ProductSection';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import Footer from './components/Footer';
import SmartImage from './components/SmartImage';
import CheckoutModal from './components/CheckoutModal';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './hooks/useAuth';
import { SlidersHorizontal, X } from 'lucide-react';

function useRoute(): [string, (r: string) => void] {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (r: string) => {
    window.history.pushState({}, '', r);
    setRoute(r);
    window.scrollTo(0, 0);
  };

  return [route, navigate];
}

function StoreFront({ navigate }: { navigate: (r: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        CATEGORY_LABELS[p.category].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const novidades = PRODUCTS.filter((p) => p.badge === 'novo');
  const maisVendidos = PRODUCTS.filter((p) => p.badge === 'bestseller');
  const ofertas = PRODUCTS.filter((p) => p.badge === 'oferta');

  const categories: (Category | 'all')[] = ['all', 'camisetas', 'moletons', 'calcas', 'jaquetas', 'acessorios'];

  const showCatalog = activeCategory !== 'all' || searchQuery.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        navigate={navigate}
      />

      <main className="flex-1">
        {!showCatalog && <Hero />}

        {!showCatalog && (
          <ProductSection
            id="novidades"
            title="Novidades"
            subtitle="Os últimos drops que acabaram de chegar"
            products={novidades}
            onQuickView={setQuickViewProduct}
          />
        )}

        {!showCatalog && (
          <section className="py-8">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden">
                <SmartImage
                  src={HERO_IMAGES[7]}
                  alt="Editorial Ferrari Imports"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 sm:p-12 max-w-lg">
                  <span className="text-ferrari-red text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                    Drop Exclusivo
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-4">
                    COLEÇÃO URBAN LEGEND
                  </h2>
                  <p className="text-white/70 text-sm mb-6 max-w-sm">
                    Peças limitadas com design autoral. Quando acabam, acabam.
                  </p>
                  <a
                    href="#produtos"
                    className="inline-block bg-white text-black px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-ferrari-red hover:text-white transition-colors"
                  >
                    Ver Coleção
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {!showCatalog && (
          <ProductSection
            id="mais-vendidos"
            title="Mais Vendidos"
            subtitle="Os queridinhos da nossa comunidade"
            products={maisVendidos}
            onQuickView={setQuickViewProduct}
          />
        )}

        {!showCatalog && (
          <ProductSection
            id="ofertas"
            title="Ofertas"
            subtitle="Promoções por tempo limitado"
            products={ofertas}
            onQuickView={setQuickViewProduct}
          />
        )}

        <section id="produtos" className="py-10 sm:py-14">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-ferrari-black leading-tight">
                  {showCatalog
                    ? activeCategory !== 'all'
                      ? CATEGORY_LABELS[activeCategory]
                      : `Resultados para "${searchQuery}"`
                    : 'Todos os Produtos'}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors"
              >
                <SlidersHorizontal size={16} /> Filtros
              </button>
            </div>

            <div className="flex gap-6">
              <aside className="hidden lg:block w-52 flex-shrink-0">
                <div className="sticky top-28">
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Categorias</h3>
                  <ul className="space-y-1">
                    {categories.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => setActiveCategory(cat)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeCategory === cat
                              ? 'bg-ferrari-black text-white font-medium'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-30">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
                  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Filtros</h3>
                      <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <X size={20} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wide mb-3">Categorias</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setShowFilters(false);
                          }}
                          className={`px-4 py-2 text-sm rounded-full border transition-all ${
                            activeCategory === cat
                              ? 'bg-ferrari-black text-white border-ferrari-black'
                              : 'border-neutral-300 text-neutral-600'
                          }`}
                        >
                          {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg font-semibold text-neutral-700 mb-2">
                      Nenhum produto encontrado
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      Tente buscar por outro termo ou categoria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="text-sm font-semibold text-ferrari-red hover:underline"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppButton />

      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        onQuickView={setQuickViewProduct}
      />
    </div>
  );
}

function AdminRoute({ navigate }: { navigate: (r: string) => void }) {
  const { session, loading } = useAuth();
  const back = () => navigate('/');

  if (loading) {
    return (
      <div className="min-h-screen bg-ferrari-black flex items-center justify-center">
        <p className="text-white/50 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onBack={back} />;
  }

  return <AdminPanel onBack={back} />;
}

function AppContent() {
  const [route, navigate] = useRoute();
  const isAdmin = route === '/admin';

  if (isAdmin) {
    return <AdminRoute navigate={navigate} />;
  }

  return <StoreFront navigate={navigate} />;
}

export default function App() {
  return (
    <SettingsProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </SettingsProvider>
  );
}
