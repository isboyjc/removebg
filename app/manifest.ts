import type { MetadataRoute } from "next"
import { headers, cookies } from "next/headers"
import { locales, type Locale } from "@/i18n/config"

// 各语言的描述
const descriptionsByLocale: Record<Locale, string> = {
  zh: "AI智能抠图 · 一键去除背景 · 本地浏览器处理",
  en: "AI Background Remover · One-click Remove · Local Browser Processing",
  ja: "AI背景除去 · ワンクリック削除 · ローカルブラウザ処理",
  ko: "AI 배경 제거 · 원클릭 제거 · 로컬 브라우저 처리",
  ru: "AI удаление фона · Удаление одним кликом · Локальная обработка в браузере",
}

// 语言代码映射
const localeToLangCode: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // 尝试从多个来源获取语言偏好
  const headersList = await headers()
  const cookieStore = await cookies()

  // 1. 从 cookie 获取（next-intl 设置的）
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value

  // 2. 从 Accept-Language header 获取
  const acceptLanguage = headersList.get("accept-language") || ""

  // 3. 从 referer 获取（如果用户从特定语言页面请求）
  const referer = headersList.get("referer") || ""

  // 确定语言
  let detectedLocale: Locale = "en" // 默认英文

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    detectedLocale = localeCookie as Locale
  } else {
    // 检查 referer 中是否有语言路径
    for (const loc of locales) {
      if (referer.includes(`/${loc}`)) {
        detectedLocale = loc
        break
      }
    }

    // 如果没有从 referer 检测到，使用 Accept-Language
    if (detectedLocale === "en") {
      const langLower = acceptLanguage.toLowerCase()
      if (langLower.includes("zh")) {
        detectedLocale = "zh"
      } else if (langLower.includes("ja")) {
        detectedLocale = "ja"
      } else if (langLower.includes("ko")) {
        detectedLocale = "ko"
      } else if (langLower.includes("ru")) {
        detectedLocale = "ru"
      }
    }
  }

  return {
    name: "Remove BG",
    short_name: "Remove BG",
    description: descriptionsByLocale[detectedLocale],
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#1A1A1A",
    orientation: "portrait-primary",
    scope: "/",
    lang: localeToLangCode[detectedLocale],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
