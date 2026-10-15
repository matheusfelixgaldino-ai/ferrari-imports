import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Package, Tags, Palette, Settings, LogOut,
  Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../settingsStore';

export type AdminPage = 'dashboard' | 'products' | 'categories' | 'homepage' | 'settings';

interface AdminLayoutProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onViewStore: () => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'categories', label: 'Categorias', icon: Tags },
  { id: 'homepage', label: 'Personalizar Loja', icon: Palette },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({ currentPage, onNavigate, onViewStore, children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storeName = settings.storeName || 'FERRARI IMPORTS';
  const nameParts = storeName.split(' ');
  const nameFirst = nameParts[0] || 'FERRARI';
  const nameRest = nameParts.slice(1).join(' ') || 'IMPORTS';

  const handleNav = (page: AdminPage) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-ferrari-black text-white flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-white/10">
          <h1 className="font-display text-lg">
            {nameFirst}<span className="text-ferrari-red"> {nameRest}</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-ferrari-red text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={onViewStore}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink size={18} /> Ver Loja
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-ferrari-black text-white flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h1 className="font-display text-lg">
                {nameFirst}<span className="text-ferrari-red"> {nameRest}</span>
              </h1>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-ferrari-red text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-white/10 space-y-1">
              <button onClick={onViewStore} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                <ExternalLink size={18} /> Ver Loja
              </button>
              <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                <LogOut size={18} /> Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-ferrari-black text-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-display text-sm">
            {nameFirst}<span className="text-ferrari-red"> {nameRest}</span>
          </span>
          <button onClick={onViewStore} className="p-2 hover:bg-white/10 rounded-lg">
            <ExternalLink size={18} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
