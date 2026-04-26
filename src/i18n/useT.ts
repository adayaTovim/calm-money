import { useStore } from '../store/useStore';
import translations, { type Translations } from './translations';

export function useT(): Translations {
  const lang = useStore((s) => s.language);
  return translations[lang] as Translations;
}
