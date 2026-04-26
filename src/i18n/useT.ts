import { useStore } from '../store/useStore';
import translations from './translations';

export function useT() {
  const lang = useStore((s) => s.language);
  return translations[lang];
}
