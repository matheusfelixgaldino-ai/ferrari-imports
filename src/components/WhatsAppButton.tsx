import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../settingsStore';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!settings.whatsappNumber) return null;

  const url = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-white rounded-xl shadow-xl border border-neutral-200 p-4 max-w-[240px] animate-scale-in relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
          <p className="text-sm font-semibold text-ferrari-black mb-1">Atendimento WhatsApp</p>
          <p className="text-xs text-neutral-500 mb-3">{settings.whatsappMessage}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide hover:bg-emerald-600 transition-colors"
          >
            Iniciar Conversa
          </a>
        </div>
      )}

      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Falar no WhatsApp"
      >
        {showTooltip ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
