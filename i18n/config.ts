export const locales = ['zh', 'en', 'ja', 'ko', 'ru'] as const
export const defaultLocale = 'zh' as const

export type Locale = (typeof locales)[number]

// Language display names
export const localeNames: Record<Locale, string> = {
  'zh': '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
}

// Language corresponding country/region codes
export const localeCountries: Record<Locale, string> = {
  'zh': 'CN',
  en: 'US',
  ja: 'JP',
  ko: 'KR',
  ru: 'RU',
}
