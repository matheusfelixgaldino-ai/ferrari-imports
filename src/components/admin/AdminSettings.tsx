import { useState, type FormEvent } from 'react';
import {
  Save, Check, AlertCircle, QrCode, MessageCircle, Instagram,
  Mail, Truck, RotateCcw, ExternalLink, Copy,
} from 'lucide-react';
import { useSettings } from '../../settingsStore';
import type { StoreSettings } from '../../settingsTypes';

export default function AdminSettings() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const update = (key: keyof StoreSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (form.whatsappNumber) {
      const cleaned = form.whatsappNumber.replace(/\D/g, '');
      if (cleaned.length < 10 || cleaned.length > 15) {
        setError('O número do WhatsApp deve ter entre 10 e 15 dígitos.');
        return;
      }
    }
    if (form.instagramHandle && form.instagramHandle.includes(' ')) {
      setError('O nome de usuário do Instagram não pode conter espaços.');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('O e-mail de atendimento não é válido.');
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

  const handleCopyPix = () => {
    if (form.pixKey) {
      navigator.clipboard.writeText(form.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappTestUrl = form.whatsappNumber
    ? `https://wa.me/${form.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(form.whatsappMessage)}`
    : '';
  const instagramUrl = form.instagramHandle
    ? form.instagramHandle.startsWith('http')
      ? form.instagramHandle
      : `https://instagram.com/${form.instagramHandle.replace('@', '')}`
    : '';

  const inputClass = 'w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ferrari-black">Configurações</h1>
        <p className="text-sm text-neutral-500 mt-1">Dados comerciais, pagamento e atendimento</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700 animate-fade-in">
          <Check size={16} /> Configurações salvas com sucesso!
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* PIX */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <QrCode size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">PIX</h2>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed mb-4">
          <strong>Modo demonstrativo:</strong> A chave PIX é exibida no checkout para o cliente copiar e pagar manualmente.
          Nenhuma confirmação automática de pagamento é processada.
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Chave PIX</label>
            <input type="text" value={form.pixKey} onChange={(e) => update('pixKey', e.target.value)} placeholder="E-mail, telefone, CPF/CNPJ ou chave aleatória" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nome do Beneficiário</label>
            <input type="text" value={form.pixBeneficiary} onChange={(e) => update('pixBeneficiary', e.target.value)} placeholder="Ferrari Imports LTDA" className={inputClass} />
          </div>
          {form.pixKey && (
            <div className="p-4 bg-neutral-50 rounded-lg flex items-center justify-between gap-3">
              <p className="text-sm font-mono font-bold text-ferrari-black break-all">{form.pixKey}</p>
              <button type="button" onClick={handleCopyPix} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-100 flex-shrink-0">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">WhatsApp</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Número Comercial</label>
            <input type="text" value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} placeholder="5511999999999" className={inputClass} />
            <p className="text-xs text-neutral-400 mt-1">Código do país + DDD + número</p>
          </div>
          <div>
            <label className={labelClass}>Mensagem de Atendimento</label>
            <textarea value={form.whatsappMessage} onChange={(e) => update('whatsappMessage', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          {whatsappTestUrl && (
            <a href={whatsappTestUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
              <MessageCircle size={16} /> Testar Link <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Instagram */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Instagram size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">Instagram</h2>
        </div>
        <div>
          <label className={labelClass}>Nome de Usuário ou URL</label>
          <input type="text" value={form.instagramHandle} onChange={(e) => update('instagramHandle', e.target.value)} placeholder="@ferrariimports" className={inputClass} />
        </div>
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-ferrari-red hover:underline mt-3">
            <Instagram size={16} /> {instagramUrl.replace('https://', '')} <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Mail size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">E-mail de Atendimento</h2>
        </div>
        <div>
          <label className={labelClass}>E-mail</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="contato@ferrariimports.com.br" className={inputClass} />
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Truck size={20} className="text-ferrari-red" />
          <h2 className="text-lg font-bold">Entrega e Trocas</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}><Truck size={14} className="inline mr-1" /> Informações de Entrega</label>
            <textarea value={form.shippingInfo} onChange={(e) => update('shippingInfo', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}><RotateCcw size={14} className="inline mr-1" /> Informações de Troca e Devolução</label>
            <textarea value={form.returnInfo} onChange={(e) => update('returnInfo', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-4 bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 shadow-lg">
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-ferrari-red text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors disabled:opacity-50">
          {saving ? 'Salvando...' : saved ? <><Check size={16} /> Salvo!</> : <><Save size={16} /> Salvar Configurações</>}
        </button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 leading-relaxed">
        <strong>Segurança:</strong> As configurações são salvas no banco de dados com autenticação real (Supabase Auth).
        Apenas usuários logados podem alterar. Os dados públicos (PIX, WhatsApp, Instagram) são visíveis aos visitantes
        mas não contêm credenciais. Para produção, restrinja quem pode criar conta de administrador.
      </div>
    </form>
  );
}
