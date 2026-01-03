import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Space_Grotesk } from "next/font/google"
import { notFound } from "next/navigation"
import { locales, type Locale } from "@/i18n/config"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import "../globals.css"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// 各语言的关键词
const keywordsByLocale: Record<Locale, string[]> = {
  zh: [
    "去背景",
    "AI抠图",
    "一键抠图",
    "图片去背景",
    "在线抠图",
    "免费抠图",
    "背景去除",
    "AI去背景",
    "智能抠图",
    "透明背景",
    "PNG抠图",
    "人像抠图",
    "产品抠图",
    "证件照抠图",
    "本地处理",
    "隐私保护",
    "RMBG",
    "U2Net",
  ],
  en: [
    "remove background",
    "AI background remover",
    "one-click background removal",
    "image background remover",
    "online background remover",
    "free background remover",
    "background removal tool",
    "AI background removal",
    "smart background remover",
    "transparent background",
    "PNG background remover",
    "portrait background remover",
    "product background remover",
    "local processing",
    "privacy protection",
    "RMBG",
    "U2Net",
  ],
}

// Language codes mapping
const localeToLanguageCode: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
}

// OpenGraph locale mapping
const localeToOGLocale: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const t = messages.metadata as Record<string, string>

  const siteUrl = "https://removebg.picgo.studio"
  const currentLocale = locale as Locale

  // Generate alternates languages
  const alternateLanguages = Object.fromEntries(
    locales.map((l) => [localeToLanguageCode[l], `${siteUrl}/${l}`])
  )
  alternateLanguages["x-default"] = `${siteUrl}/en`

  // Generate alternateLocales for OpenGraph
  const alternateOGLocales = locales
    .filter((l) => l !== currentLocale)
    .map((l) => localeToOGLocale[l])

  return {
    title: {
      default: t.title,
      template: `%s | Remove BG`
    },
    description: t.description,
    keywords: keywordsByLocale[currentLocale],
    authors: [{ name: "isboyjc", url: "https://github.com/isboyjc" }],
    creator: "isboyjc",
    publisher: "Remove BG",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
        { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      ],
      shortcut: [
        { url: "/icons/icon-32x32.png", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Remove BG",
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "application-name": "Remove BG",
      "apple-mobile-web-app-title": "Remove BG",
      "msapplication-TileColor": "#1A1A1A",
      "msapplication-tap-highlight": "no",
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeToOGLocale[currentLocale],
      alternateLocale: alternateOGLocales,
      url: siteUrl,
      siteName: "Remove BG",
      title: t.title,
      description: t.description,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      site: "@isboyjc",
      creator: "@isboyjc",
    },
    category: "technology",
  }
}

// 获取语言对应的特性列表
function getFeatureList(locale: Locale): string[] {
  const featureLists: Record<Locale, string[]> = {
    zh: ["AI智能抠图", "一键去除背景", "本地浏览器处理", "完全免费", "隐私保护", "多格式支持"],
    en: ["AI Smart Background Removal", "One-click Remove", "Local Browser Processing", "Completely Free", "Privacy Protection", "Multi-format Support"],
  }
  return featureLists[locale]
}

// 获取语言对应的关键词字符串
function getKeywordsString(locale: Locale): string {
  const keywordsStrings: Record<Locale, string> = {
    zh: "去背景,AI抠图,一键抠图,图片去背景,在线抠图,免费抠图,智能抠图,透明背景",
    en: "remove background,AI background remover,one-click background removal,image background remover,online background remover,free background remover",
  }
  return keywordsStrings[locale]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const currentLocale = locale as Locale

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages
  const messages = await getMessages()

  // JSON-LD 结构化数据
  const t = messages.metadata as Record<string, string>
  const siteUrl = "https://removebg.picgo.studio"

  // WebApplication Schema
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Remove BG",
    "description": t.description,
    "url": siteUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript, WebGL",
    "softwareVersion": "1.0.0",
    "featureList": getFeatureList(currentLocale),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "isboyjc",
      "url": "https://github.com/isboyjc"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Remove BG",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icons/icon-512x512.png`
      }
    },
    "inLanguage": localeToLanguageCode[currentLocale],
    "keywords": getKeywordsString(currentLocale)
  }

  // Organization Schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Remove BG",
    "url": siteUrl,
    "logo": `${siteUrl}/icons/icon-512x512.png`,
    "sameAs": [
      "https://github.com/isboyjc/removebg",
      "https://twitter.com/isboyjc"
    ]
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD 结构化数据 - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        {/* JSON-LD 结构化数据 - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />

        {/* PWA Theme Color - supports light/dark mode */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fffbeb" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1A1A1A" />

        {/* Prevent theme flashing script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme === 'dark' || (theme !== 'light' && systemDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
