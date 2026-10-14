export interface StoreSettings {
  pixKey: string;
  pixBeneficiary: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  storeName: string;
  storeLogo: string;
  promoMessage: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  pixKey: '',
  pixBeneficiary: '',
  whatsappNumber: '',
  whatsappMessage: 'Olá! Vim pelo site e gostaria de mais informações.',
  instagramHandle: '',
  storeName: 'FERRARI IMPORTS',
  storeLogo: '',
  promoMessage: 'FRETE GRÁTIS acima de R$ 299 • PARCELE EM ATÉ 12X SEM JUROS • NOVOS DROPS TODA SEMANA',
};

export const SETTINGS_KEY = 'ferrari_settings';
