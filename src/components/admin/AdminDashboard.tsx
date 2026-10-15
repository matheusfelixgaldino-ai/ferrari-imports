import {
  Package, Eye, EyeOff, Tags, Clock, Plus, Palette, Settings as SettingsIcon,
  TrendingUp, AlertCircle,
} from 'lucide-react';
import { useCatalog } from '../../catalogStore';
import type { AdminPage } from './AdminLayout';

interface AdminDashboardProps {
  onNavigate: (page: AdminPage) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { products, categories, loading } = useCatalog();

  const published = products.filter((p) => p.published !== false);
  const drafts = products.filter((p) => p.published === false);
  const lowStock = products.filter((p) => (p.stock ?? 0) < 10);
  const recentProducts = [...products]
    .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
    .slice(0, 5);

  const cards = [
    {
      label: 'Total de Produtos',
      value: products.length,
      icon: Package,
      color: 'bg-neutral-900',
    },
    {
      label: 'Publicados',
      value: published.length,
      icon: Eye,
      color: 'bg-emerald-500',
    },
    {
      label: 'Rascunhos',
      value: drafts.length,
      icon: EyeOff,
      color: 'bg-amber-500',
    },
    {
      label: 'Categorias',
      value: categories.length,
      icon: Tags,
      color: 'bg-ferrari-red',
    },
  ];

  const shortcuts = [
    { label: 'Cadastrar Produto', icon: Plus, page: 'products' as AdminPage, desc: 'Adicione um novo item ao catálogo' },
    { label: 'Personalizar Loja', icon: Palette, page: 'homepage' as AdminPage, desc: 'Edite banner, cores e seções' },
    { label: 'Gerenciar Categorias', icon: Tags, page: 'categories' as AdminPage, desc: 'Organize seu catálogo' },
    { label: 'Configurações', icon: SettingsIcon, page: 'settings' as AdminPage, desc: 'PIX, WhatsApp e atendimento' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-400 text-sm">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ferrari-black">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Visão geral da sua loja</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${card.color} text-white flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-ferrari-black">{card.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Estoque baixo</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {lowStock.length} {lowStock.length === 1 ? 'produto está' : 'produtos estão'} com estoque abaixo de 10 unidades.
            </p>
          </div>
        </div>
      )}

      {/* Shortcuts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-600 mb-3">Atalhos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              onClick={() => onNavigate(s.page)}
              className="bg-white rounded-xl border border-neutral-200 p-5 text-left hover:border-ferrari-red hover:shadow-md transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-100 group-hover:bg-ferrari-red group-hover:text-white text-neutral-600 flex items-center justify-center mb-3 transition-colors">
                <s.icon size={18} />
              </div>
              <p className="text-sm font-semibold text-ferrari-black">{s.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent changes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-neutral-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-600">Últimas Alterações</h2>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-400">
              Nenhuma alteração registrada ainda.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ferrari-black truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {p.category} • {p.published === false ? 'Rascunho' : 'Publicado'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-neutral-400">Estoque: {p.stock ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Demo notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <TrendingUp size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Dados demonstrativos</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
            Métricas de vendas, pedidos e faturamento não são exibidos nesta demonstração.
            Os dados de produtos e categorias são reais e persistidos no banco de dados.
          </p>
        </div>
      </div>
    </div>
  );
}
