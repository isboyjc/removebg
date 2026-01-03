import { ImageResponse } from "next/og"
import type { Locale } from "@/i18n/config"

export const runtime = "edge"

export const alt = "RemoveBG PicGo - AI Background Remover | RMBG-1.4 & U2Net"
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
          padding: "80px",
        }}
      >
        {/* 简约背景装饰 - 只在角落，不遮挡内容 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 200,
            height: 200,
            background: "#FFE500",
            borderRadius: "0 0 100px 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 180,
            height: 180,
            background: "#FF6B6B",
            borderRadius: "100px 0 0 0",
          }}
        />

        {/* 主内容区域 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            background: "#FFFBEB",
            padding: "50px 60px 100px 60px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="110" height="110" viewBox="0 0 64 64">
              {/* 阴影 */}
              <rect x="15" y="15" width="40" height="40" rx="6" fill="#000000" transform="translate(3, 3)"/>
              {/* 主图像框 */}
              <rect x="12" y="12" width="40" height="40" rx="6" fill="#FFFBEB" stroke="#000000" strokeWidth="4"/>
              {/* 左侧实色区域 */}
              <path d="M12 18 Q12 12 18 12 L32 12 L32 52 L18 52 Q12 52 12 46 Z" fill="#FF6B6B" stroke="#000000" strokeWidth="4"/>
              {/* 右侧透明格子 */}
              <clipPath id="rightClip">
                <path d="M32 12 L46 12 Q52 12 52 18 L52 46 Q52 52 46 52 L32 52 Z"/>
              </clipPath>
              <g clipPath="url(#rightClip)">
                <rect x="32" y="12" width="10" height="10" fill="#E5E5E5"/>
                <rect x="42" y="12" width="10" height="10" fill="#FFFFFF"/>
                <rect x="32" y="22" width="10" height="10" fill="#FFFFFF"/>
                <rect x="42" y="22" width="10" height="10" fill="#E5E5E5"/>
                <rect x="32" y="32" width="10" height="10" fill="#E5E5E5"/>
                <rect x="42" y="32" width="10" height="10" fill="#FFFFFF"/>
                <rect x="32" y="42" width="10" height="10" fill="#FFFFFF"/>
                <rect x="42" y="42" width="10" height="10" fill="#E5E5E5"/>
              </g>
              <path d="M32 12 L46 12 Q52 12 52 18 L52 46 Q52 52 46 52 L32 52" fill="none" stroke="#000000" strokeWidth="4"/>
              <line x1="32" y1="12" x2="32" y2="52" stroke="#7FFFD4" strokeWidth="5"/>
              <line x1="32" y1="12" x2="32" y2="52" stroke="#000000" strokeWidth="2"/>
            </svg>
          </div>

          {/* 标题 */}
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 900,
              color: "#000000",
              marginBottom: 20,
              padding: "14px 46px",
              background: "#FFE500",
              border: "5px solid #000000",
              borderRadius: 18,
              boxShadow: "7px 7px 0 #000000",
              letterSpacing: "-2px",
            }}
          >
            RemoveBG PicGo
          </div>

          {/* 副标题 */}
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#262626",
              marginBottom: 32,
              fontWeight: 600,
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>

          {/* 特性标签 - 2行布局 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            {localeTags.map((tag, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  background: i === 0 ? "#FF6B6B" : i === 1 ? "#7FFFD4" : i === 2 ? "#FFE500" : "#A78BFA",
                  borderRadius: 10,
                  fontSize: 20,
                  color: "#000000",
                  fontWeight: 800,
                  border: "3px solid #000000",
                  boxShadow: "3px 3px 0 #000000",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 网址 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: "#000000",
            fontWeight: 700,
            padding: "10px 28px",
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: 10,
            boxShadow: "3px 3px 0 #000000",
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
