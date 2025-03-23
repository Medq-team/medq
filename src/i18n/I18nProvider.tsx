
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './index';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<string>("preferred-language", "en");

  useEffect(() => {
    // Initialize with the stored language preference
    if (storedLanguage && i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }

    // Set up a listener to save language preference when it changes
    const handleLanguageChanged = (lng: string) => {
      setStoredLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [storedLanguage, setStoredLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
