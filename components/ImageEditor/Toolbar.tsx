"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface ToolbarProps {
  fileName: string
  onDownload: () => void
  onClose: () => void
  hasProcessedImage: boolean
}

export function Toolbar({
  fileName,
  onDownload,
  onClose,
  hasProcessedImage,
}: ToolbarProps) {
  const t = useTranslations("editor.toolbar")

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 bg-card border-b-2 border-border/20" role="toolbar" aria-label="Editor toolbar">
      {/* Left side: Close button + File name */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-foreground hover:bg-foreground/10 border-0"
          aria-label={t("close")}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </Button>

        <div className="hidden md:flex items-center gap-2" aria-hidden="true">
          <span className="text-sm font-medium text-foreground truncate max-w-md">
            {fileName}
          </span>
        </div>
      </div>

      {/* Right side: Download button */}
      <div className="flex items-center gap-2 md:gap-3" role="group" aria-label="Editor actions">
        {hasProcessedImage && (
          <Button
            variant="accent"
            size="sm"
            onClick={onDownload}
            aria-label={t("downloadAria")}
          >
            <Download className="w-4 h-4 md:mr-2" aria-hidden="true" />
            <span className="hidden md:inline">{t("download")}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
