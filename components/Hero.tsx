"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, ImageIcon, Sparkles, Images } from "lucide-react"
import { useTranslations } from "next-intl"
import { CleanupLogo } from "./CleanupLogo"
import { getSelectedModel, setSelectedModel } from "@/lib/model-storage"
import { isModelCached } from "@/lib/rmbg-processor"
import type { ModelType } from "@/lib/rmbg-worker"

interface HeroProps {
  onImagesSelect: (files: File[], modelType: ModelType) => void
}

export function Hero({ onImagesSelect }: HeroProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedModel, setLocalSelectedModel] = useState<ModelType>("u2net")
  const [u2netCached, setU2netCached] = useState(false)
  const [rmbgCached, setRmbgCached] = useState(false)
  const t = useTranslations("hero")

  // 加载保存的模型选择
  useEffect(() => {
    setLocalSelectedModel(getSelectedModel())
  }, [])

  // 检查模型缓存状态
  useEffect(() => {
    isModelCached("u2net").then(setU2netCached)
    isModelCached("rmbg").then(setRmbgCached)
  }, [])

  // 监听 localStorage 变化（当 Settings 组件修改时同步）
  useEffect(() => {
    const handleStorageChange = () => {
      setLocalSelectedModel(getSelectedModel())
    }

    window.addEventListener("storage", handleStorageChange)

    // 自定义事件监听（用于同一页面内的同步）
    window.addEventListener("modelSelectionChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("modelSelectionChange", handleStorageChange)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"))
    if (files.length > 0) {
      onImagesSelect(files, selectedModel)
    }
  }, [onImagesSelect, selectedModel])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"))
      if (imageFiles.length > 0) {
        onImagesSelect(imageFiles, selectedModel)
      }
    }
    // Reset input value to allow selecting the same files again
    e.target.value = ""
  }, [onImagesSelect, selectedModel])

  const handleModelChange = useCallback((modelType: ModelType) => {
    setLocalSelectedModel(modelType)
    setSelectedModel(modelType)
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new Event("modelSelectionChange"))
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-12 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--foreground) 1px, transparent 1px),
              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">{t("badge")}</span>
          </motion.div>

          {/* Cleanup entrance */}
          <motion.a
            href="https://clean.picgo.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] hover:shadow-[4px_4px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <CleanupLogo size={20} className="-ml-0.5" />
            <span className="text-sm font-bold">{t("cleanup.text")}</span>
            <span className="text-sm">→</span>
          </motion.a>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="block">{t("title.line1")}</span>
          <span className="block mt-2">
            {t("title.line2")}
            <span className="relative inline-block mx-3">
              <span className="relative z-10">{t("title.highlight")}</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-4 bg-primary -z-0 -rotate-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              />
            </span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
          <br className="hidden md:block" />
          {t("descriptionSub")}
        </p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Model Selection */}
        <div className="mb-6 flex justify-center">
          <div className="relative inline-flex items-center bg-card border-2 border-foreground rounded-full p-1 shadow-[2px_2px_0_var(--foreground)]">
            <button
              onClick={() => handleModelChange("u2net")}
              className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-1.5"
            >
              {selectedModel === "u2net" && (
                <motion.div
                  layoutId="model-selector-bg"
                  className="absolute inset-0 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  u2netCached
                    ? selectedModel === "u2net" ? "bg-green-400" : "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span className={`relative z-10 transition-colors duration-200 ${selectedModel === "u2net" ? "text-background" : "text-foreground"}`}>
                {t("models.u2net")}
              </span>
              <span className={`relative z-10 text-xs transition-colors duration-200 ${selectedModel === "u2net" ? "text-background/60" : "text-foreground/60"}`}>
                ({t("models.recommended")})
              </span>
            </button>
            <button
              onClick={() => handleModelChange("rmbg")}
              className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-1.5"
            >
              {selectedModel === "rmbg" && (
                <motion.div
                  layoutId="model-selector-bg"
                  className="absolute inset-0 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  rmbgCached
                    ? selectedModel === "rmbg" ? "bg-green-400" : "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span className={`relative z-10 transition-colors duration-200 ${selectedModel === "rmbg" ? "text-background" : "text-foreground"}`}>
                {t("models.rmbg")}
              </span>
            </button>
          </div>
        </div>

        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            w-full h-72 md:h-80
            bg-card border-3 border-dashed rounded-2xl
            cursor-pointer transition-all duration-200
            ${isDragging
              ? "border-primary bg-primary/10 shadow-[8px_8px_0_var(--foreground)] -translate-x-1 -translate-y-1"
              : "border-foreground hover:border-primary hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            }
            shadow-[4px_4px_0_var(--foreground)]
          `}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-label={t("upload.default")}
            aria-describedby="upload-formats"
          />

          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className={`
              w-20 h-20 mb-6 rounded-xl border-3 border-foreground
              flex items-center justify-center
              transition-colors duration-200
              ${isDragging ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
              shadow-[3px_3px_0_var(--foreground)]
            `}>
              {isDragging ? (
                <Upload className="w-10 h-10" />
              ) : (
                <Images className="w-10 h-10" />
              )}
            </div>

            <p className="text-xl font-bold mb-2">
              {isDragging ? t("upload.dragging") : t("upload.default")}
            </p>
            <p className="text-muted-foreground">
              {t("upload.or")} <span className="text-primary font-bold underline">{t("upload.click")}</span>
            </p>
            <p id="upload-formats" className="text-sm text-muted-foreground mt-4">
              {t("upload.formats")}
            </p>
          </motion.div>

          {/* Batch badge */}
          <div className="absolute -top-3 -left-3 px-3 py-1 bg-secondary text-secondary-foreground border-3 border-foreground rounded-full shadow-[2px_2px_0_var(--foreground)] flex items-center gap-1.5 -rotate-6" aria-hidden="true">
            <Images className="w-4 h-4" />
            <span className="text-xs font-bold">{t("upload.batch")}</span>
          </div>

          {/* Decorative corner */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-accent text-accent-foreground border-3 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center rotate-12" aria-hidden="true">
            <Sparkles className="w-6 h-6" />
          </div>
        </label>
      </motion.div>

      {/* Feature tags */}
      <motion.div
        className="flex flex-wrap justify-center items-center gap-3 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {[t("tags.batch"), t("tags.fast"), t("tags.local"), t("tags.free"), t("tags.quality")].map((tag, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-card border-2 border-foreground rounded-lg text-sm font-medium shadow-[2px_2px_0_var(--foreground)]"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
