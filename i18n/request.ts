import { getRequestConfig } from 'next-intl/server'
import { locales, type Locale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate locale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'zh'
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
