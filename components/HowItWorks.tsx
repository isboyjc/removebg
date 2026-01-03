"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Upload, SlidersHorizontal, Wand2, Eye, Download } from "lucide-react"
import { useTranslations } from "next-intl"
import Script from "next/script"

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  const steps = [
    {
      icon: Upload,
      titleKey: "steps.upload.title",
      descKey: "steps.upload.description",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: SlidersHorizontal,
      titleKey: "steps.selectModel.title",
      descKey: "steps.selectModel.description",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Wand2,
      titleKey: "steps.process.title",
      descKey: "steps.process.description",
      color: "bg-accent text-accent-foreground",
    },
    {
      icon: Eye,
      titleKey: "steps.preview.title",
      descKey: "steps.preview.description",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Download,
      titleKey: "steps.download.title",
      descKey: "steps.download.description",
      color: "bg-secondary text-secondary-foreground",
    },
  ]

  // HowTo 结构化数据
  const howToJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t("title") + " " + t("highlight"),
    "description": t("description"),
    "totalTime": "PT1M",
    "tool": [
      {
        "@type": "HowToTool",
        "name": "RemoveBG PicGo PicGo"
      }
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": t(step.titleKey),
      "text": t(step.descKey),
      "url": `https://rmbg.picgo.studio#step${index + 1}`
    }))
  }), [t])

  return (
    <>
      {/* HowTo JSON-LD */}
      <Script
        id="howto-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <section className="py-20 px-4 bg-muted/30 relative">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-foreground" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
              <span className="relative inline-block mx-2">
                <span className="relative z-10">{t("highlight")}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent z-0 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </motion.div>

          {/* 步骤流程 */}
          <div className="relative">
            {/* 连接线 - 桌面端 */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-foreground/20 -translate-y-1/2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* 步骤卡片 */}
                  <div className="bg-card border-3 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_var(--foreground)] hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 relative">
                    {/* 步骤序号 */}
                    <div className="absolute -top-4 -left-2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-lg border-3 border-foreground">
                      {index + 1}
                    </div>

                    {/* 图标 */}
                    <div className={`w-14 h-14 ${step.color} border-2 border-foreground rounded-xl flex items-center justify-center mb-4 shadow-[2px_2px_0_var(--foreground)] mx-auto`}>
                      <step.icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-center">{t(step.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground text-center">{t(step.descKey)}</p>
                  </div>

                  {/* 箭头 - 桌面端，最后一个不显示 */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 bg-accent text-accent-foreground border-2 border-foreground rounded-full items-center justify-center -translate-y-1/2 z-10 shadow-[2px_2px_0_var(--foreground)]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
