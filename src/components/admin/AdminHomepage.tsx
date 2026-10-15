import { useState, type FormEvent } from 'react';
import { Save, Check, AlertCircle, Palette, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../../settingsStore';
import type { StoreSettings, BannerConfig, HomepageSections } from '../../settingsTypes';

export default function AdminHomepage() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof StoreSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBanner = (key: keyof BannerConfig, value: string | boolean) => {
    setForm((prev) => ({ ...prev, banner: { ...prev.banner, [key]: value } }));
  };

  const updateSections = (key: keyof HomepageSections, value: string | boolean) => {
    setForm((prev) => ({ ...prev, sections: { ...prev.sections, [key]: value } }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!form.storeName.trim()) {
      setError('O nome da loja é obrigatório.');
      return;
    }

    setSaving(true);
    const result = await saveSettings(form);
    setSaving(false);

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || 'Erro ao salvar.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ferrari-black">Personalizar Loja</h1>
        <p className="text-sm text-neutral-500 mt-1">Edite a identidade visual, o banner e as seções da página inicial</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700 animate-fade-in">
          <Check size={16} /> Alterações salvas! Visualize a loja para ver o resultado.
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Identity */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">Identidade Visual</h2>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome da Loja *</label>
              <input type="text" value={form.storeName} onChange={(e) => update('storeName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL do Logotipo</label>
              <input type="url" value={form.storeLogo} onChange={(e) => update('storeLogo', e.target.value)} placeholder="Deixe vazio para texto" className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cor Principal</label>
              <div className="flex gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="w-12 h-10 border border-neutral-300 rounded-lg cursor-pointer" />
                <input type="text" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Cor de Destaque</label>
              <div className="flex gap-2">
                <input type="color" value={form.accentColor} onChange={(e) => update('accentColor', e.target.value)} className="w-12 h-10 border border-neutral-300 rounded-lg cursor-pointer" />
                <input type="text" value={form.accentColor} onChange={(e) => update('accentColor', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Mensagem Promocional (barra do topo)</label>
            <textarea value={form.promoMessage} onChange={(e) => update('promoMessage', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-ferrari-red" />
            <h2 className="text-lg font-bold">Banner Principal</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              onClick={() => updateBanner('enabled', !form.banner.enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.banner.enabled ? 'bg-emerald-500' : 'bg-neutral-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.banner.enabled ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm font-medium text-neutral-700">{form.banner.enabled ? 'Ativo' : 'Inativo'}</span>
          </label>
        </div>
        <div className="space-y-4">
          {/* Banner preview */}
          {form.banner.enabled && form.banner.image && (
            <div className="relative h-40 rounded-xl overflow-hidden border border-neutral-200">
              <img src={form.banner.image} alt="Prévia do banner" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-display text-xl text-white leading-tight">{form.banner.title}</h3>
                <p className="text-white/70 text-xs mt-1 max-w-xs line-clamp-2">{form.banner.subtitle}</p>
                <span className="inline-block mt-2 bg-ferrari-red text-white px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase">
                  {form.banner.buttonText}
                </span>
              </div>
            </div>
          )}
          <div>
            <label className={labelClass}>Imagem do Banner</label>
            <input type="url" value={form.banner.image} onChange={(e) => updateBanner('image', e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Título</label>
            <input type="text" value={form.banner.title} onChange={(e) => updateBanner('title', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtítulo</label>
            <textarea value={form.banner.subtitle} onChange={(e) => updateBanner('subtitle', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Texto do Botão</label>
              <input type="text" value={form.banner.buttonText} onChange={(e) => updateBanner('buttonText', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Link de Destino</label>
              <input type="text" value={form.banner.buttonLink} onChange={(e) => updateBanner('buttonLink', e.target.value)} placeholder="#produtos" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-bold mb-5">Seções da Página Inicial</h2>
        <div className="space-y-4">
          {[
            { key: 'showNovidades' as const, titleKey: 'novidadesTitle' as const, label: 'Novidades' },
            { key: 'showMaisVendidos' as const, titleKey: 'maisVendidosTitle' as const, label: 'Mais Vendidos' },
            { key: 'showOfertas' as const, titleKey: 'ofertasTitle' as const, label: 'Ofertas' },
          ].map((sec) => (
            <div key={sec.key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-neutral-200 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateSections(sec.key, !form.sections[sec.key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.sections[sec.key] ? 'bg-emerald-500' : 'bg-neutral-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.sections[sec.key] ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  {form.sections[sec.key] ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-neutral-400" />}
                  {sec.label}
                </span>
              </label>
              <input
                type="text"
                value={form.sections[sec.titleKey]}
                onChange={(e) => updateSections(sec.titleKey, e.target.value)}
                placeholder={`Título da seção (${sec.label})`}
                disabled={!form.sections[sec.key]}
                className={`${inputClass} ${!form.sections[sec.key] ? 'opacity-40' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-4 bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 shadow-lg">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-ferrari-red text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : saved ? <><Check size={16} /> Salvo!</> : <><Save size={16} /> Salvar Alterações</>}
        </button>
        <p className="text-xs text-neutral-400">As mudanças aparecem imediatamente na loja pública.</p>
      </div>
    </form>
  );
}
