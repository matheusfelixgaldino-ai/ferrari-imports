import { Minus, Plus, X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import SmartImage from './SmartImage';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useStore();

  const formatPrice = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (!open) return null;

  const freeShippingThreshold = 299;
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - cartTotal, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="text-lg font-bold uppercase tracking-tight">
              Sacola ({cartCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-neutral-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sua sacola está vazia</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Adicione produtos para continuar suas compras.
            </p>
            <button
              onClick={onClose}
              className="bg-ferrari-black text-white px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-neutral-800 transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex-shrink-0">
              {remaining > 0 ? (
                <p className="text-xs text-neutral-600 mb-2">
                  Faltam <strong className="text-ferrari-red">{formatPrice(remaining)}</strong> para frete grátis
                </p>
              ) : (
                <p className="text-xs text-emerald-600 font-semibold mb-2">
                  Você ganhou frete grátis!
                </p>
              )}
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3 group"
                >
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-neutral-400 hover:text-ferrari-red transition-colors flex-shrink-0"
                        aria-label="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Tamanho: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 rounded-l-md transition-colors"
                          aria-label="Diminuir"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 rounded-r-md transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full text-xs text-neutral-500 hover:text-ferrari-red transition-colors py-2"
              >
                Limpar sacola
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-5 flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Frete</span>
                <span className="font-medium text-emerald-600">
                  {cartTotal >= freeShippingThreshold ? 'Grátis' : 'Calculado no checkout'}
                </span>
              </div>
              <div className="flex items-center justify-between text-base pt-2 border-t border-neutral-200">
                <span className="font-bold">Total</span>
                <span className="font-bold text-ferrari-red">{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-ferrari-red text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Finalizar Compra <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-center text-neutral-400">
                Demonstração — nenhum pagamento real será processado
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
