import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Tags, ArrowUp, ArrowDown } from 'lucide-react';
import { useCatalog } from '../../catalogStore';
import type { CategoryDef } from '../../types';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminCategories() {
  const { categories, saveCategory, deleteCategory, reorderCategories } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<CategoryDef> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<CategoryDef | null>(null);

  const openNew = () => {
    setEditing({ slug: '', label: '', sort_order: categories.length + 1 });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (c: CategoryDef) => {
    setEditing({ ...c });
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editing?.label?.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    let slug = editing.slug?.trim() || slugify(editing.label);
    if (!slug) {
      setError('Não foi possível gerar um identificador válido.');
      return;
    }

    setSaving(true);
    const result = await saveCategory({
      ...editing,
      slug,
      label: editing.label.trim(),
    });
    setSaving(false);

    if (result.success) {
      setShowForm(false);
      setEditing(null);
    } else {
      setError(result.error || 'Erro ao salvar categoria.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const result = await deleteCategory(deleteConfirm.id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      setError(result.error);
    }
  };

  const move = async (index: number, dir: 'up' | 'down') => {
    const newIndex = dir === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const reordered = [...categories];
    const tmp = reordered[index].sort_order;
    reordered[index] = { ...reordered[index], sort_order: reordered[newIndex].sort_order };
    reordered[newIndex] = { ...reordered[newIndex], sort_order: tmp };
    await reorderCategories(reordered.sort((a, b) => a.sort_order - b.sort_order));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ferrari-black">Categorias</h1>
          <p className="text-sm text-neutral-500 mt-1">{categories.length} categorias cadastradas</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors"
        >
          <Plus size={18} /> Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tags size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600 mb-1">Nenhuma categoria cadastrada</p>
            <p className="text-xs text-neutral-400 mb-4">Crie sua primeira categoria para organizar os produtos.</p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors"
            >
              <Plus size={16} /> Nova Categoria
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {[...categories].sort((a, b) => a.sort_order - b.sort_order).map((cat, index, arr) => (
              <div key={cat.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-neutral-400 hover:text-ferrari-black disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => move(index, 'down')}
                    disabled={index === arr.length - 1}
                    className="p-1 text-neutral-400 hover:text-ferrari-black disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Tags size={18} className="text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ferrari-black">{cat.label}</p>
                  <p className="text-xs text-neutral-400 font-mono">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ferrari-black transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(cat)} className="p-2 hover:bg-red-50 rounded-lg text-neutral-500 hover:text-ferrari-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSave} className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing.id ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={editing.label || ''}
                  onChange={(e) => {
                    const label = e.target.value;
                    setEditing({ ...editing, label, slug: editing.id ? editing.slug : slugify(label) });
                  }}
                  placeholder="Ex: Camisetas, Calças, Acessórios..."
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Identificador (slug)</label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  placeholder="auto-gerado a partir do nome"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
                <p className="text-xs text-neutral-400 mt-1">Usado internamente para identificar a categoria.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">Ordem</label>
                <input
                  type="number"
                  min="0"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-ferrari-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors disabled:opacity-50">
                {saving ? 'Salvando...' : <><Check size={16} /> Salvar</>}
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
            <h3 className="text-lg font-bold mb-2">Excluir categoria?</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Tem certeza que deseja excluir <strong>{deleteConfirm.label}</strong>? Produtos vinculados ficarão sem categoria.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 bg-ferrari-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-ferrari-red-dark transition-colors">
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
