import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../settingsStore';

export default function Footer() {
  const { settings } = useSettings();

  const storeName = settings.storeName || 'FERRARI IMPORTS';
  const nameParts = storeName.split(' ');
  const nameFirst = nameParts[0] || 'FERRARI';
  const nameRest = nameParts.slice(1).join(' ') || 'IMPORTS';

  const instagramUrl = settings.instagramHandle
    ? settings.instagramHandle.startsWith('http')
      ? settings.instagramHandle
      : `https://instagram.com/${settings.instagramHandle.replace('@', '')}`
    : null;

  return (
    <footer className="bg-ferrari-black text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl mb-2">ENTRE PARA A TRIBE</h3>
              <p className="text-white/60 text-sm">
                Receba drops exclusivos, ofertas e novidades antes de todo mundo.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 bg-white/10 rounded-lg text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-ferrari-red"
              />
              <button className="bg-ferrari-red hover:bg-ferrari-red-dark text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-display text-lg mb-4">
              {nameFirst}<span className="text-ferrari-red"> {nameRest}</span>
            </h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Streetwear premium importado. Vestindo a cultura urbana desde 2019.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4">Loja</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#novidades" className="hover:text-white transition-colors">Novidades</a></li>
              <li><a href="#mais-vendidos" className="hover:text-white transition-colors">Mais Vendidos</a></li>
              <li><a href="#ofertas" className="hover:text-white transition-colors">Ofertas</a></li>
              <li><a href="#produtos" className="hover:text-white transition-colors">Todos os Produtos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Frete e Entrega</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-ferrari-red" /> contato@ferrariimports.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-ferrari-red" /> (11) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-ferrari-red" /> São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        {/* Social + payment */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-4">
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-ferrari-red flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            ) : (
              <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40" aria-hidden>
                <Instagram size={18} />
              </span>
            )}
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-ferrari-red flex items-center justify-center transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-ferrari-red flex items-center justify-center transition-colors" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>Pagamento seguro</span>
            <div className="flex gap-1.5">
              {['VISA', 'MASTER', 'ELO', 'PIX', 'BOLETO'].map((m) => (
                <span key={m} className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold tracking-wide">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-8">
          © 2026 {storeName}. Demonstração — nenhum dado comercial real. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
