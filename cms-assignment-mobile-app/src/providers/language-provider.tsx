import { createContext, PropsWithChildren, useContext, useState } from 'react';

type Language = 'en' | 'ar';
type LanguageState = { language: Language; isArabic: boolean; toggleLanguage: () => void };
const LanguageContext = createContext<LanguageState | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>('en');
  return <LanguageContext.Provider value={{ language, isArabic: language === 'ar', toggleLanguage: () => setLanguage((current) => current === 'en' ? 'ar' : 'en') }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error('useLanguage must be used inside LanguageProvider'); return context; }
