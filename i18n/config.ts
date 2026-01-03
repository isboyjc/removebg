export const locales = ['zh', 'en'] as const
export const defaultLocale = 'zh' as const

export type Locale = (typeof locales)[number]

// Language display names
export const localeNames: Record<Locale, string> = {
  'zh': '中文',
  en: 'English',
}

// Language corresponding country/region codes
export const localeCountries: Record<Locale, string> = {
  'zh': 'CN',
  en: 'US',
}
