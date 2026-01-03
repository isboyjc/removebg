"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, MousePointer2 } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import Script from "next/script"
import type { Locale } from "@/i18n/config"

const examples = [
  {
    original: "https://cdn.isboyjc.com/picgo/removebg/a0.jpg",
    result: "https://cdn.isboyjc.com/picgo/removebg/a1.png",
    gif: "https://cdn.isboyjc.com/picgo/removebg/a1.gif",
    altKey: "portrait",
  },
  {
    original: "https://cdn.isboyjc.com/picgo/removebg/b0.jpg",
    result: "https://cdn.isboyjc.com/picgo/removebg/b1.png",
    gif: "https://cdn.isboyjc.com/picgo/removebg/b1.gif",
    altKey: "product",
  },
  {
    original: "https://cdn.isboyjc.com/picgo/removebg/c0.jpg",
    result: "https://cdn.isboyjc.com/picgo/removebg/c1.png",
    gif: "https://cdn.isboyjc.com/picgo/removebg/c1.gif",
    altKey: "animal",
  },
  {
    original: "https://cdn.isboyjc.com/picgo/removebg/d0.jpg",
    result: "https://cdn.isboyjc.com/picgo/removebg/d1.png",
    gif: "https://cdn.isboyjc.com/picgo/removebg/d1.gif",
    altKey: "object",
  },
]

// 各语言的 alt 文本模板
const altTextTemplates: Record<Locale, { original: string; comparison: string }> = {
  zh: {
    original: "AI抠图示例{index} - {altKey}图片处理前",
    comparison: "AI抠图示例{index} - {altKey}图片处理效果对比动画"
  },
  en: {
    original: "AI background removal example {index} - {altKey} image before processing",
    comparison: "AI background removal example {index} - {altKey} image comparison animation"
  },
}

// 各语言的图库名称
const galleryNames: Record<Locale, string> = {
  zh: "AI抠图效果展示",
  en: "AI Background Removal Examples",
}

// 各语言的图片示例名称
const exampleNames: Record<Locale, string> = {
  zh: "AI抠图示例",
  en: "AI Background Removal Example",
}

// 各语言的图片描述模板
const descriptionTemplates: Record<Locale, string> = {
  zh: "使用Remove BG AI抠图工具处理的{altKey}图片效果展示",
  en: "{altKey} image processed with Remove BG AI background remover",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

function ExampleCard({ example, index }: { example: typeof examples[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations("examples")
  const locale = useLocale() as Locale

  // 生成更具描述性的 alt 文本
  const templates = altTextTemplates[locale] || altTextTemplates.en
  const altOriginal = templates.original
    .replace("{index}", String(index + 1))
    .replace("{altKey}", example.altKey)
  const altComparison = templates.comparison
    .replace("{index}", String(index + 1))
    .replace("{altKey}", example.altKey)

  return (
    <motion.div
      variants={itemVariants}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="
        relative overflow-hidden
        bg-card border-3 border-foreground rounded-2xl
        shadow-[4px_4px_0_var(--foreground)]
        transition-all duration-300
        hover:shadow-[8px_8px_0_var(--foreground)]
        hover:-translate-x-1 hover:-translate-y-1
      ">
        {/* 图片容器 */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* 原图 - 默认显示 */}
          <img
            src={example.original}
            alt={altOriginal}
            loading="lazy"
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-300
              ${isHovered ? "opacity-0" : "opacity-100"}
            `}
          />

          {/* GIF 动画 - 悬停时显示 */}
          <img
            src={example.gif}
            alt={altComparison}
            loading="lazy"
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* 悬停提示遮罩 */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
            flex items-end justify-center pb-4
            transition-opacity duration-300
            ${isHovered ? "opacity-0" : "opacity-100"}
          `}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card/90 backdrop-blur-sm border-2 border-foreground rounded-full text-sm font-medium">
              <MousePointer2 className="w-4 h-4" />
              <span>{t("hoverHint")}</span>
            </div>
          </div>

          {/* 播放中标识 */}
          <div className={`
            absolute top-3 right-3
            flex items-center gap-1.5 px-3 py-1.5
            bg-primary text-primary-foreground
            border-2 border-foreground rounded-full
            text-xs font-bold
            shadow-[2px_2px_0_var(--foreground)]
            transition-all duration-300
            ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </span>
            {t("playing")}
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="p-4 border-t-3 border-foreground bg-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground">
              {t("example")} {index + 1}
            </span>
            <div className={`
              flex items-center gap-1.5 px-2 py-1
              text-xs font-bold rounded-md
              transition-colors duration-300
              ${isHovered
                ? "bg-accent text-accent-foreground"
                : "bg-secondary/20 text-muted-foreground"
              }
            `}>
              <Sparkles className="w-3 h-3" />
              {isHovered ? t("showingResult") : t("beforeAfter")}
            </div>
          </div>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className={`
        absolute -top-2 -right-2 w-8 h-8
        bg-accent text-accent-foreground
        border-2 border-foreground rounded-lg
        shadow-[2px_2px_0_var(--foreground)]
        flex items-center justify-center
        font-bold text-sm
        transition-all duration-300
        ${isHovered ? "rotate-12 scale-110" : "rotate-6"}
      `}>
        {index + 1}
      </div>
    </motion.div>
  )
}

export function Examples() {
  const t = useTranslations("examples")
  const locale = useLocale() as Locale

  // ImageGallery 结构化数据
  const imageGalleryJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": galleryNames[locale] || galleryNames.en,
    "description": t("description"),
    "url": "https://rmbg.picgo.studio#examples",
    "image": examples.map((example, index) => ({
      "@type": "ImageObject",
      "name": `${exampleNames[locale] || exampleNames.en} ${index + 1}`,
      "contentUrl": example.result,
      "thumbnailUrl": example.original,
      "description": (descriptionTemplates[locale] || descriptionTemplates.en)
        .replace("{altKey}", example.altKey)
    }))
  }), [t, locale])

  return (
    <>
      {/* ImageGallery JSON-LD */}
      <Script
        id="image-gallery-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }}
      />
      <section id="examples" className="py-20 px-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 标题区域 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">{t("badge")}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
              <span className="relative inline-block mx-2">
                <span className="relative z-10">{t("highlight")}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary -z-0 rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </motion.div>

          {/* 示例网格 - 4列 */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {examples.map((example, index) => (
              <ExampleCard key={index} example={example} index={index} />
            ))}
          </motion.div>

          {/* 底部提示 */}
          <motion.p
            className="text-center text-muted-foreground mt-10 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {t("footerHint")}
          </motion.p>
        </div>
      </section>
    </>
  )
}
