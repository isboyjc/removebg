"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/Logo"

interface ModelLoadingScreenProps {
  progress: number
  isCached: boolean
  modelName: string
}

export function ModelLoadingScreen({ progress, isCached, modelName }: ModelLoadingScreenProps) {
  const t = useTranslations("editor.modelLoading")
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const percentage = Math.round(progress * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 p-8">
        {/* Logo */}
        <div
          className="animate-pulse"
          style={{ animationDuration: "2s" }}
        >
          <Logo size={96} />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            {isCached ? t("loading") : t("downloading")} {t("model")}{dots}
          </h2>
          <p className="text-muted-foreground">
            {isCached
              ? t("loadingFromCache", { modelName })
              : t("downloadingFirstTime", { modelName })}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-full">
          <div className="h-4 rounded-lg border-3 border-foreground bg-muted overflow-hidden shadow-[4px_4px_0_var(--foreground)]">
            <div
              className={cn(
                "h-full bg-primary transition-all duration-300 ease-out",
                percentage >= 100 && "animate-pulse"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 text-center text-sm font-bold text-foreground">
            {percentage}%
          </div>
        </div>

        {/* Info Text */}
        {!isCached && (
          <p className="text-xs text-muted-foreground text-center max-w-md">
            {t("cachedInfo")}
          </p>
        )}
      </div>
    </div>
  )
}
