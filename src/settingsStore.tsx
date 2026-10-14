import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS, SETTINGS_KEY, type StoreSettings } from './settingsTypes';

interface SettingsContextValue {
  settings: StoreSettings;
  loading: boolean;
  saveSettings: (s: StoreSettings) => Promise<{ success: boolean; error?: string }>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('settings')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;

      if (data?.settings && typeof data.settings === 'object') {
        const merged = { ...DEFAULT_SETTINGS, ...data.settings };
        setSettings(merged);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      } else {
        const cached = localStorage.getItem(SETTINGS_KEY);
        if (cached) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
        }
      }
    } catch {
      const cached = localStorage.getItem(SETTINGS_KEY);
      if (cached) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = useCallback(
    async (newSettings: StoreSettings): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase
          .from('store_settings')
          .upsert({ id: 1, settings: newSettings });

        if (error) {
          if (error.code === '42501') {
            return {
              success: false,
              error: 'Você precisa estar logado como administrador para salvar as configurações.',
            };
          }
          throw error;
        }

        setSettings(newSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar configurações';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        setSettings(newSettings);
        return { success: false, error: `${msg} — salvo apenas localmente neste navegador.` };
      }
    },
    [],
  );

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
