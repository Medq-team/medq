
import { useTranslation as useReactI18next } from 'react-i18next';
import i18n from './index';

/**
 * Checks if a string appears to be plain text content mixed with a translation key result
 * and extracts just the appropriate language content
 */
export function sanitizeTranslatedText(text: string): string {
  if (!text) return '';
  
  // Check if the text contains both French and English versions
  // This is a simple heuristic that looks for patterns like "French text. English text"
  const duplicatedTextPattern = /^(.+?)\. (.+)$/;
  const match = text.match(duplicatedTextPattern);
  
  if (match && match.length === 3) {
    // If pattern detected, return the appropriate language version
    return i18n.language === 'fr' ? match[1] : match[2];
  }
  
  // If no duplication detected, return the original text
  return text;
}

/**
 * Enhanced translation function that sanitizes the result
 * to prevent duplicated language text
 */
export function useEnhancedTranslation() {
  const { t, i18n } = useReactI18next();
  
  const enhancedT = (key: string, options?: object) => {
    const translated = t(key, options);
    return sanitizeTranslatedText(translated);
  };
  
  return { t: enhancedT, i18n };
}
