import { useState, useMemo, type FormEvent } from 'react';
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff, X, Check, AlertCircle,
  Package, Filter,
} from 'lucide-react';
import { useCatalog } from '../../catalogStore';
import { useSettings } from '../../settingsStore';
import type { Product } from '../../types';

const BADGES = [
  { value: '', label: 'Nenhum' },
  { value: 'novo', label: 'Novo' },
  { value: 'oferta', label: 'Oferta' },
  { value: 'bestseller', label: 'Mais Vendido' },
];

const SIZES_PRESET = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'Único', '36', '38', '40', '42', '44', '46'];

const emptyProduct: Partial<Product> = {
  name: '',
  description: '',
  category: 'camisetas',
  price: 0,
  oldPrice: undefined,
  image: '',
  sizes: [],
  badge: undefined,
  stock: 0,
  published: true,
};

export default function AdminProducts() {
  const { products, categories, saveProduct, deleteProduct, togglePublish } = useCatalog();
  const { settings } = useSettings();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sizeInput, setSizeInput] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && p.published !== false) ||
        (filterStatus === 'draft' && p.published === false);
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, filterCategory, filterStatus]);

  const openNew = () => {
    setEditing({ ...emptyProduct });
    setFormError(null);
    setSaved(false);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setFormError(null);
    setSaved(false);
    setShowForm(true);
  };

  const handleAddSize = () => {
    const trimmed = sizeInput.trim();
    if (trimmed && editing && !editing.sizes?.includes(trimmed)) {
      setEditing({ ...editing, sizes: [...(editing.sizes || []), trimmed] });
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setEditing({ ...editing, sizes: editing?.sizes?.filter((s) => s !== size) || [] });
  };

  const handleTogglePreset = (size: string) => {
    if (editing?.sizes?.includes(size)) {
      handleRemoveSize(size);
    } else {
      setEditing({ ...editing, sizes: [...(editing.sizes || []), size] });
    }
  };

  const validate = (): string | null => {
    if (!editing?.name?.trim()) return 'O nome do produto é obrigatório.';
    if (!editing?.price || editing.price <= 0) return 'O preço deve ser maior que zero.';
    if (editing.oldPrice !== undefined && editing.oldPrice !== null && editing.oldPrice > 0 && editing.oldPrice <= (editing.price || 0))
      return 'O preço promocional deve ser menor que o preço original.';
    if (!editing?.image?.trim()) return 'A URL da imagem é obrigatória.';
    if (!editing?.category) return 'Selecione uma categoria.';
    if (!editing?.sizes || editing.sizes.length === 0) return 'Selecione pelo menos um tamanho.';
    return null;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    const result = await saveProduct(editing as Partial<Product> & { name: string; price: number });
    setSaving(false);

    if (result.success) {
      setSaved(true);
      setTimeout(() => {
        setShowForm(false);
        setEditing(null);
      }, 800);
    } else {
      setFormError(result.error || 'Erro ao salvar produto.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const result = await deleteProduct(deleteConfirm.id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      setFormError(result.error);
    }
  };

  const formatPrice = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ferrari-black">Produtos</h1>
          <p className="text-sm text-neutral-500 mt-1">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors"
        >
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 bg-white"
          >
            <option value="all">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 bg-white"
          >
            <option value="all">Todos status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600 mb-1">Nenhum produto encontrado</p>
            <p className="text-xs text-neutral-400 mb-4">
              {products.length === 0 ? 'Cadastre seu primeiro produto.' : 'Tente ajustar os filtros.'}
            </p>
            {products.length === 0 && (
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors"
              >
                <Plus size={16} /> Cadastrar Produto
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden md:table w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Produto</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Categoria</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Preço</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Estoque</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ferrari-black truncate max-w-[200px]">{p.name}</p>
                          {p.badge && (
                            <span className="text-[10px] uppercase font-bold text-ferrari-red">{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold">{formatPrice(p.price)}</p>
                      {p.oldPrice && <p className="text-xs text-neutral-400 line-through">{formatPrice(p.oldPrice)}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{p.stock ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        p.published === false
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.published === false ? <><EyeOff size={12} /> Rascunho</> : <><Eye size={12} /> Publicado</>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish(p.id, !(p.published !== false))}
                          className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ferrari-black transition-colors"
                          title={p.published === false ? 'Publicar' : 'Despublicar'}
                        >
                          {p.published === false ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ferrari-black transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p)}
                          className="p-2 hover:bg-red-50 rounded-lg text-neutral-500 hover:text-ferrari-red transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-neutral-100">
              {filtered.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ferrari-black">{p.name}</p>
                      <p className="text-xs text-neutral-500">{p.category} • Estoque: {p.stock ?? 0}</p>
                      <p className="text-sm font-bold mt-1">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.published === false ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.published === false ? 'Rascunho' : 'Publicado'}
                    </span>
                    <div className="flex-1 flex justify-end gap-1">
                      <button onClick={() => togglePublish(p.id, !(p.published !== false))} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500">
                        {p.published === false ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p)} className="p-2 hover:bg-red-50 rounded-lg text-neutral-500 hover:text-ferrari-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product form modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)} />
          <form
            onSubmit={handleSave}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in scrollbar-hide"
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">{editing.id ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
              {saved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
                  <Check size={16} /> Produto salvo com sucesso!
                </div>
              )}

              {/* Image preview */}
              {editing.image && (
                <div className="flex justify-center">
                  <div className="w-32 h-40 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img
                      src={editing.image}
                      alt="Prévia"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Nome do produto"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Descrição</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  placeholder="Descrição do produto"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">URL da Imagem *</label>
                <input
                  type="url"
                  value={editing.image || ''}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Preço *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editing.price || ''}
                    onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Preço Promocional</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editing.oldPrice || ''}
                    onChange={(e) => setEditing({ ...editing, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Opcional"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Categoria *</label>
                  <select
                    value={editing.category || 'camisetas'}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Etiqueta</label>
                  <select
                    value={editing.badge || ''}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value || undefined })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 bg-white"
                  >
                    {BADGES.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Estoque</label>
                <input
                  type="number"
                  min="0"
                  value={editing.stock ?? 0}
                  onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-2">Tamanhos Disponíveis *</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SIZES_PRESET.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleTogglePreset(s)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                        editing.sizes?.includes(s)
                          ? 'bg-ferrari-black text-white border-ferrari-black'
                          : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                    placeholder="Tamanho personalizado"
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30"
                  />
                  <button type="button" onClick={handleAddSize} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors">
                    Adicionar
                  </button>
                </div>
                {editing.sizes && editing.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editing.sizes.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-medium">
                        {s}
                        <button type="button" onClick={() => handleRemoveSize(s)} className="text-neutral-400 hover:text-ferrari-red">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Published toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, published: !(editing.published !== false) })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.published !== false ? 'bg-emerald-500' : 'bg-neutral-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${editing.published !== false ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm font-medium text-neutral-700">
                  {editing.published !== false ? 'Publicado (visível na loja)' : 'Rascunho (oculto)'}
                </span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-ferrari-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : saved ? <><Check size={16} /> Salvo!</> : <><Check size={16} /> Salvar</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-scale-in p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-ferrari-red" />
            </div>
            <h3 className="text-lg font-bold mb-2">Excluir produto?</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Tem certeza que deseja excluir <strong>{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors"
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
