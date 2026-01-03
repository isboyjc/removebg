import { ImageResponse } from "next/og"
import type { Locale } from "@/i18n/config"

export const runtime = "edge"

export const alt = "Remove BG - AI Background Remover | RMBG-1.4 & U2Net"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

// 各语言的副标题
const subtitles: Record<Locale, string> = {
  zh: "AI 智能抠图 · 一键去除背景 · 隐私保护",
  en: "AI Background Remover · One-Click Remove · Privacy First",
  ja: "AI背景除去 · ワンクリック削除 · プライバシー優先",
  ko: "AI 배경 제거 · 원클릭 제거 · 개인정보 우선",
  ru: "AI удаление фона · Удаление одним кликом · Конфиденциальность прежде всего",
}

// 各语言的标签
const tags: Record<Locale, string[]> = {
  zh: ["🚀 秒级处理", "🔒 本地运行", "💯 完全免费", "📦 批量处理"],
  en: ["🚀 Fast", "🔒 Local", "💯 Free", "📦 Batch"],
  ja: ["🚀 高速", "🔒 ローカル", "💯 無料", "📦 バッチ"],
  ko: ["🚀 빠름", "🔒 로컬", "💯 무료", "📦 일괄"],
  ru: ["🚀 Быстро", "🔒 Локально", "💯 Бесплатно", "📦 Пакетно"],
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || "en"
  const subtitle = subtitles[locale] || subtitles.en
  const localeTags = tags[locale] || tags.en

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFBEB",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Neo-Brutalism 背景装饰 */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            width: 180,
            height: 180,
            background: "#FFE500",
            borderRadius: 20,
            transform: "rotate(-6deg)",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0 #000000",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 50,
            width: 220,
            height: 220,
            background: "#FF6B6B",
            borderRadius: 20,
            transform: "rotate(8deg)",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0 #000000",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 200,
            width: 100,
            height: 100,
            background: "#7FFFD4",
            borderRadius: 16,
            transform: "rotate(-12deg)",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0 #000000",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 64 64">
            {/* 阴影 */}
            <rect x="15" y="15" width="40" height="40" rx="4" fill="#000000" transform="translate(3, 3)"/>
            {/* 主图像框 */}
            <rect x="12" y="12" width="40" height="40" rx="4" fill="#FFFBEB" stroke="#000000" strokeWidth="3"/>
            {/* 左侧实色区域 - 珊瑚红 */}
            <path d="M12 16 Q12 12 16 12 L32 12 L32 52 L16 52 Q12 52 12 48 Z" fill="#FF6B6B" stroke="#000000" strokeWidth="3"/>
            {/* 右侧透明格子效果 */}
            <clipPath id="rightClip">
              <path d="M32 12 L48 12 Q52 12 52 16 L52 48 Q52 52 48 52 L32 52 Z"/>
            </clipPath>
            <g clipPath="url(#rightClip)">
              <rect x="32" y="12" width="8" height="8" fill="#E5E5E5"/>
              <rect x="40" y="12" width="12" height="8" fill="#FFFFFF"/>
              <rect x="32" y="20" width="8" height="8" fill="#FFFFFF"/>
              <rect x="40" y="20" width="12" height="8" fill="#E5E5E5"/>
              <rect x="32" y="28" width="8" height="8" fill="#E5E5E5"/>
              <rect x="40" y="28" width="12" height="8" fill="#FFFFFF"/>
              <rect x="32" y="36" width="8" height="8" fill="#FFFFFF"/>
              <rect x="40" y="36" width="12" height="8" fill="#E5E5E5"/>
              <rect x="32" y="44" width="8" height="8" fill="#E5E5E5"/>
              <rect x="40" y="44" width="12" height="8" fill="#FFFFFF"/>
            </g>
            {/* 右侧边框 */}
            <path d="M32 12 L48 12 Q52 12 52 16 L52 48 Q52 52 48 52 L32 52" fill="none" stroke="#000000" strokeWidth="3"/>
            {/* 分割线 - 薄荷绿 */}
            <line x1="32" y1="12" x2="32" y2="52" stroke="#7FFFD4" strokeWidth="4"/>
            <line x1="32" y1="12" x2="32" y2="52" stroke="#000000" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* 标题 - Neo-Brutalism 风格 */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "#000000",
            marginBottom: 20,
            padding: "10px 40px",
            background: "#FFE500",
            border: "4px solid #000000",
            borderRadius: 16,
            boxShadow: "6px 6px 0 #000000",
          }}
        >
          Remove BG
        </div>

        {/* 副标题 */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#525252",
            marginBottom: 40,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </div>

        {/* 特性标签 - Neo-Brutalism 风格 */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {localeTags.map((tag, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "12px 24px",
                background: i % 2 === 0 ? "#FF6B6B" : "#7FFFD4",
                borderRadius: 12,
                fontSize: 22,
                color: "#000000",
                fontWeight: 700,
                border: "3px solid #000000",
                boxShadow: "3px 3px 0 #000000",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 网址 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: "#525252",
            fontWeight: 600,
            padding: "8px 24px",
            background: "#FFFFFF",
            border: "2px solid #000000",
            borderRadius: 8,
          }}
        >
          rmbg.picgo.studio
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
