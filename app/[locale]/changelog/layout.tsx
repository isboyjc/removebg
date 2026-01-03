import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { locales, type Locale } from "@/i18n/config"

// 语言代码映射
const localeToLanguageCode: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
}

// OpenGraph locale 映射
const localeToOGLocale: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
}

// 各语言的更新日志标题
const changelogTitles: Record<Locale, string> = {
  zh: "更新日志 - Remove BG",
  en: "Changelog - Remove BG",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const currentLocale = locale as Locale
  const messages = await getMessages()
  const t = messages.changelog as Record<string, string>
  const meta = messages.metadata as Record<string, string>

  const siteUrl = "https://rmbg.picgo.studio"
  const pageUrl = `${siteUrl}/${locale}/changelog`

  // 生成 alternates languages
  const alternateLanguages = Object.fromEntries(
    locales.map((l) => [localeToLanguageCode[l], `${siteUrl}/${l}/changelog`])
  )
  alternateLanguages["x-default"] = `${siteUrl}/en/changelog`

  return {
    title: changelogTitles[currentLocale],
    description: t.description || meta.description,
    alternates: {
      canonical: pageUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeToOGLocale[currentLocale],
      url: pageUrl,
      siteName: "Remove BG",
      title: changelogTitles[currentLocale],
      description: t.description || meta.description,
    },
  }
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
