import { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, AlertCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';
import { useSettings } from '../settingsStore';
import SmartImage from './SmartImage';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { cart, cartTotal, clearCart } = useStore();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      setOrderPlaced(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const formatPrice = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {orderPlaced ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-ferrari-black mb-2">Pedido Registrado!</h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Seu pedido foi registrado como <strong>aguardando pagamento</strong>.
              Realize o pagamento via PIX usando a chave abaixo e entre em contato
              para confirmação. O pedido será confirmado manualmente após verificação.
            </p>
            <div className="p-4 bg-neutral-50 rounded-lg mb-6 text-left">
              <p className="text-xs text-neutral-500 mb-1">Chave PIX para pagamento:</p>
              <p className="text-sm font-mono font-bold text-ferrari-black break-all">
                {settings.pixKey || 'Não configurada'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-ferrari-black text-white px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-neutral-800 transition-colors"
            >
              Concluir
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag size={20} className="text-ferrari-red" />
              <h2 className="text-xl font-bold text-ferrari-black">Checkout</h2>
            </div>

            {/* Order summary */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                Resumo do Pedido
              </h3>
              <div className="space-y-2 mb-3">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1 text-xs">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.size} • Qtd: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                <span className="font-bold">Total</span>
                <span className="font-bold text-ferrari-red text-lg">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* PIX payment section */}
            <div className="border border-neutral-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <QrCode size={20} className="text-ferrari-red" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Pagamento via PIX</h3>
              </div>

              {settings.pixKey ? (
                <>
                  <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                    <p className="text-xs text-neutral-500 mb-1">Chave PIX</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-mono font-bold text-ferrari-black break-all">
                        {settings.pixKey}
                      </p>
                      <button
                        onClick={handleCopyPix}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors flex-shrink-0"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {settings.pixBeneficiary && (
                    <p className="text-xs text-neutral-600 mb-3">
                      Beneficiário: <strong>{settings.pixBeneficiary}</strong>
                    </p>
                  )}

                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      Após realizar o pagamento via PIX, clique em "Confirmar Pedido".
                      O status será <strong>"Aguardando Confirmação"</strong> até que
                      o pagamento seja verificado manualmente. Nenhuma confirmação
                      automática é processada.
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    A chave PIX ainda não foi configurada. O administrador deve acessar
                    o painel em <strong>/admin</strong> para cadastrar a chave PIX.
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={handlePlaceOrder}
              disabled={!settings.pixKey}
              className={`w-full py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all ${
                settings.pixKey
                  ? 'bg-ferrari-red text-white hover:bg-ferrari-red-dark'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Confirmar Pedido
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-3">
              Demonstração — nenhum pagamento real é processado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
