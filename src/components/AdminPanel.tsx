import { useState, useEffect, type FormEvent } from 'react';
import {
  Store, QrCode, MessageCircle, Instagram, Save, Check, AlertCircle,
  LogOut, ArrowLeft, ExternalLink, Copy, ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../settingsStore';
import { DEFAULT_SETTINGS, type StoreSettings } from '../settingsTypes';

interface AdminPanelProps {
  onBack: () => void;
}

type Tab = 'store' | 'pix' | 'whatsapp' | 'instagram';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { signOut } = useAuth();
  const { settings, saveSettings, loading } = useSettings();
  const [tab, setTab] = useState<Tab>('store');
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const update = (key: keyof StoreSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.storeName.trim()) return 'O nome da loja é obrigatório.';
    if (form.pixKey && form.pixKey.length < 5) return 'A chave PIX parece muito curta.';
    if (form.whatsappNumber) {
      const cleaned = form.whatsappNumber.replace(/\D/g, '');
      if (cleaned.length < 10 || cleaned.length > 15)
        return 'O número do WhatsApp deve ter entre 10 e 15 dígitos (incluindo código do país).';
    }
    if (form.instagramHandle && form.instagramHandle.includes(' '))
      return 'O nome de usuário do Instagram não pode conter espaços.';
    return null;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
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

  const tabs: { id: Tab; label: string; icon: typeof Store }[] = [
    { id: 'store', label: 'Loja', icon: Store },
    { id: 'pix', label: 'PIX', icon: QrCode },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Admin top bar */}
      <div className="bg-ferrari-black text-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar para loja"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-display text-lg">
              FERRARI<span className="text-ferrari-red"> IMPORTS</span>
              <span className="text-white/40 text-xs font-sans font-normal ml-2">Admin</span>
            </h1>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ferrari-black">Configurações da Loja</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Gerencie pagamentos, atendimento e identidade da loja.
          </p>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-6">
          {/* Tabs sidebar */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide lg:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-ferrari-black text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
            {saved && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700 animate-fade-in">
                <Check size={16} /> Configurações salvas com sucesso!
              </div>
            )}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Store tab */}
            {tab === 'store' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Store size={20} className="text-ferrari-red" />
                  <h3 className="text-lg font-bold">Dados da Loja</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Nome da Loja *
                  </label>
                  <input
                    type="text"
                    value={form.storeName}
                    onChange={(e) => update('storeName', e.target.value)}
                    placeholder="FERRARI IMPORTS"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    URL do Logotipo (opcional)
                  </label>
                  <input
                    type="url"
                    value={form.storeLogo}
                    onChange={(e) => update('storeLogo', e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Deixe em branco para usar o nome da loja como logo textual.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Mensagem Promocional
                  </label>
                  <textarea
                    value={form.promoMessage}
                    onChange={(e) => update('promoMessage', e.target.value)}
                    placeholder="FRETE GRÁTIS acima de R$ 299 • PARCELE EM ATÉ 12X SEM JUROS"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all resize-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Exibida na barra animada no topo do site.
                  </p>
                </div>
              </div>
            )}

            {/* PIX tab */}
            {tab === 'pix' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode size={20} className="text-ferrari-red" />
                  <h3 className="text-lg font-bold">Configurações de PIX</h3>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                  <strong>Modo demonstrativo:</strong> A chave PIX será exibida no checkout para o cliente
                  copiar e pagar manualmente. Nenhuma confirmação automática de pagamento é processada.
                  O pedido só deve ser marcado como pago após confirmação real.
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Chave PIX da Loja
                  </label>
                  <input
                    type="text"
                    value={form.pixKey}
                    onChange={(e) => update('pixKey', e.target.value)}
                    placeholder="ex: contato@ferrariimports.com.br ou +5511999999999"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Pode ser e-mail, telefone, CPF/CNPJ ou chave aleatória.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Nome do Beneficiário
                  </label>
                  <input
                    type="text"
                    value={form.pixBeneficiary}
                    onChange={(e) => update('pixBeneficiary', e.target.value)}
                    placeholder="Ferrari Imports LTDA"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                </div>

                {form.pixKey && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Prévia — como aparecerá no checkout
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-mono font-semibold text-ferrari-black break-all">
                          {form.pixKey}
                        </p>
                        {form.pixBeneficiary && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Beneficiário: {form.pixBeneficiary}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors flex-shrink-0"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp tab */}
            {tab === 'whatsapp' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={20} className="text-ferrari-red" />
                  <h3 className="text-lg font-bold">Configurações de WhatsApp</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Número Comercial (com código do país e DDD)
                  </label>
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(e) => update('whatsappNumber', e.target.value)}
                    placeholder="5511999999999"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Formato: código do país + DDD + número. Ex: 5511999999999 (Brasil, São Paulo)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Mensagem Inicial do Atendimento
                  </label>
                  <textarea
                    value={form.whatsappMessage}
                    onChange={(e) => update('whatsappMessage', e.target.value)}
                    placeholder="Olá! Vim pelo site e gostaria de mais informações."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all resize-none"
                  />
                </div>

                {whatsappTestUrl && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Testar Link de Atendimento
                    </p>
                    <a
                      href={whatsappTestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle size={16} /> Abrir conversa no WhatsApp
                      <ExternalLink size={14} />
                    </a>
                    <p className="text-xs text-neutral-400 mt-2 break-all">
                      {whatsappTestUrl}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instagram tab */}
            {tab === 'instagram' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Instagram size={20} className="text-ferrari-red" />
                  <h3 className="text-lg font-bold">Configurações de Instagram</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                    Nome de Usuário ou URL do Perfil
                  </label>
                  <input
                    type="text"
                    value={form.instagramHandle}
                    onChange={(e) => update('instagramHandle', e.target.value)}
                    placeholder="@ferrariimports ou https://instagram.com/ferrariimports"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Use @usuario, apenas o nome, ou a URL completa.
                  </p>
                </div>

                {instagramUrl && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Prévia do link
                    </p>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-ferrari-red hover:underline"
                    >
                      <Instagram size={16} /> {instagramUrl.replace('https://', '')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Save button — always visible */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-ferrari-red text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : saved ? (
                  <><Check size={16} /> Salvo!</>
                ) : (
                  <><Save size={16} /> Salvar Configurações</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setForm(DEFAULT_SETTINGS)}
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Restaurar padrões
              </button>
            </div>
          </form>
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 leading-relaxed">
          <strong>Segurança:</strong> As configurações são salvas no banco de dados com autenticação real
          (Supabase Auth). Apenas usuários logados podem alterar configurações. Os dados públicos (PIX,
          WhatsApp, Instagram, nome da loja) são visíveis a todos os visitantes, mas não contêm
          credenciais ou chaves secretas. Para produção, restrinja quem pode criar conta de administrador.
        </div>
      </div>
    </div>
  );
}
