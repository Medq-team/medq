
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Update the component state if language changes from elsewhere
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setCurrentLanguage(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="language-select">{t('settings.language')}</Label>
      <Select 
        value={currentLanguage} 
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger id="language-select" className="w-full">
          <SelectValue placeholder={t('settings.language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
