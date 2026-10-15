export interface BannerConfig {
  enabled: boolean;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomepageSections {
  showNovidades: boolean;
  showMaisVendidos: boolean;
  showOfertas: boolean;
  novidadesTitle: string;
  maisVendidosTitle: string;
  ofertasTitle: string;
}

export interface StoreSettings {
  // Store identity
  storeName: string;
  storeLogo: string;
  primaryColor: string;
  accentColor: string;
  promoMessage: string;
  // Banner
  banner: BannerConfig;
  // Homepage sections
  sections: HomepageSections;
  // Commercial
  pixKey: string;
  pixBeneficiary: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  email: string;
  shippingInfo: string;
  returnInfo: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'FERRARI IMPORTS',
  storeLogo: '',
  primaryColor: '#0A0A0A',
  accentColor: '#E10600',
  promoMessage: 'FRETE GRÁTIS acima de R$ 299 • PARCELE EM ATÉ 12X SEM JUROS • NOVOS DROPS TODA SEMANA',
  banner: {
    enabled: true,
    image: 'https://images.pexels.com/photos/39371076/pexels-photo-39371076.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'STREETWEAR QUE DEFINE A RUA',
    subtitle: 'Peças exclusivas importadas com design urbano premium. Camisetas, moletons, calças e mais — para quem vive a cultura street.',
    buttonText: 'Comprar Agora',
    buttonLink: '#produtos',
  },
  sections: {
    showNovidades: true,
    showMaisVendidos: true,
    showOfertas: true,
    novidadesTitle: 'Novidades',
    maisVendidosTitle: 'Mais Vendidos',
    ofertasTitle: 'Ofertas',
  },
  pixKey: '',
  pixBeneficiary: '',
  whatsappNumber: '',
  whatsappMessage: 'Olá! Vim pelo site e gostaria de mais informações.',
  instagramHandle: '',
  email: 'contato@ferrariimports.com.br',
  shippingInfo: 'Frete calculado no checkout. Entrega em todo o Brasil.',
  returnInfo: 'Trocas e devoluções em até 7 dias após o recebimento.',
};

export const SETTINGS_KEY = 'ferrari_settings';
