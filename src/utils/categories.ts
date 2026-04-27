import type { Translations } from '../i18n/translations';

export const CATEGORY_KEYS = [
  'Rent', 'Salaries', 'Marketing', 'Software',
  'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other',
] as const;

export type CategoryKey = typeof CATEGORY_KEYS[number];

export function getCategoryLabel(key: string, t: Translations): string {
  const map: Record<string, string> = {
    Rent: t.cat_rent,
    Salaries: t.cat_salaries,
    Marketing: t.cat_marketing,
    Software: t.cat_software,
    Equipment: t.cat_equipment,
    Travel: t.cat_travel,
    Utilities: t.cat_utilities,
    Taxes: t.cat_taxes,
    Other: t.cat_other,
  };
  return map[key] ?? key;
}
