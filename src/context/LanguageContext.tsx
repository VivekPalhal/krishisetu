import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, TranslationKey } from '../utils/translations';
import { speakText, stopSpeech } from '../utils/speech';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  l: (hi: string, en: string) => string;
  speak: (hiText: string, enText: string, onEnd?: () => void) => boolean;
  stopVoice: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kisansetu_lang');
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kisansetu_lang', lang);
        document.documentElement.lang = lang;
      } catch {
        // Safe fallback in restricted iframes
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = (key: TranslationKey): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.hi;
    return dict[key] || TRANSLATIONS.hi[key] || key;
  };

  const l = (hi: string, en: string): string => {
    return language === 'en' ? en : hi;
  };

  const speak = (hiText: string, enText: string, onEnd?: () => void): boolean => {
    const textToSpeak = language === 'en' ? enText : hiText;
    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    return speakText(textToSpeak, voiceLang, onEnd);
  };

  const stopVoice = () => {
    stopSpeech();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        document.documentElement.lang = language;
      } catch {
        // Ignore
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        l,
        speak,
        stopVoice
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const defaultContextValue: LanguageContextType = {
  language: 'hi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => TRANSLATIONS.hi[key] || key,
  l: (hi, en) => hi,
  speak: (hiText, enText, onEnd) => speakText(hiText, 'hi-IN', onEnd),
  stopVoice: () => stopSpeech()
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
};

