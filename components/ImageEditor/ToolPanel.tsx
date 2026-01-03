"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  SplitSquareHorizontal,
} from "lucide-react"
import { BackgroundColorPicker } from "./BackgroundColorPicker"
import { ModelSwitcher } from "./ModelSwitcher"
import type { ModelType } from "@/lib/rmbg-worker"

interface ToolPanelProps {
  zoom: number
  fitZoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  isProcessing: boolean
  hasProcessedImage: boolean
  showComparison: boolean
  onToggleComparison: () => void
  backgroundColor: string
  onBackgroundColorChange: (color: string) => void
  currentModel: ModelType
  onModelChange: (model: ModelType) => void
  u2netReady: boolean
  rmbgReady: boolean
  onMouseEnter?: () => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export function ToolPanel({
  zoom,
  fitZoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  isProcessing,
  hasProcessedImage,
  showComparison,
  onToggleComparison,
  backgroundColor,
  onBackgroundColorChange,
  currentModel,
  onModelChange,
  u2netReady,
  rmbgReady,
  onMouseEnter,
  onMouseLeave,
}: ToolPanelProps) {
  const t = useTranslations("editor.toolPanel")

  // Prevent all pointer events from bubbling to canvas
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.div
      className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-default"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
      onMouseMove={stopPropagation}
      onPointerDown={stopPropagation}
      onPointerUp={stopPropagation}
      onPointerMove={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchEnd={stopPropagation}
      onTouchMove={stopPropagation}
    >
      <div className="flex items-center gap-1.5 md:gap-2 h-11 md:h-12 bg-card border-2 border-border/20 rounded-xl px-2 md:px-3 shadow-xl" role="toolbar" aria-label={t("tools")}>
        {/* Show comparison mode: only exit button */}
        {showComparison ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleComparison}
            className="gap-1.5"
            aria-label={t("exitComparison")}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
            <span className="text-xs md:text-sm">{t("exitCompare")}</span>
          </Button>
        ) : (
          <>
            {/* Model switcher (only show if has processed image) */}
            {hasProcessedImage && (
              <>
                <ModelSwitcher
                  currentModel={currentModel}
                  onModelChange={onModelChange}
                  isProcessing={isProcessing}
                  u2netReady={u2netReady}
                  rmbgReady={rmbgReady}
                />
                <div className="w-px h-6 bg-foreground/20" aria-hidden="true" />
              </>
            )}

            {/* Background color picker (only show if has processed image) */}
            {hasProcessedImage && (
              <>
                <BackgroundColorPicker
                  backgroundColor={backgroundColor}
                  onColorChange={onBackgroundColorChange}
                  disabled={isProcessing}
                />
                <div className="w-px h-6 bg-foreground/20" aria-hidden="true" />
              </>
            )}

            {/* Zoom controls */}
            <div className="flex items-center gap-0.5" role="group" aria-label={t("zoomControls")}>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onZoomOut}
                disabled={zoom <= fitZoom * 0.25}
                className="hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 disabled:opacity-30 text-foreground [&_svg]:text-foreground"
                title={t("zoomOut")}
                aria-label={t("zoomOut")}
              >
                <ZoomOut className="w-3 h-3" aria-hidden="true" />
              </Button>

              <button
                onClick={onZoomReset}
                className="text-foreground font-medium text-xs w-9 md:w-10 text-center hover:bg-foreground/10 rounded py-0.5 transition-colors"
                title={t("zoomReset")}
                aria-label={t("resetZoomAria", { percentage: Math.round((zoom / fitZoom) * 100) })}
              >
                {Math.round((zoom / fitZoom) * 100)}%
              </button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onZoomIn}
                disabled={zoom >= fitZoom * 4}
                className="hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 disabled:opacity-30 text-foreground [&_svg]:text-foreground"
                title={t("zoomIn")}
                aria-label={t("zoomIn")}
              >
                <ZoomIn className="w-3 h-3" aria-hidden="true" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onZoomReset}
                className="hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 hidden md:flex text-foreground [&_svg]:text-foreground"
                title={t("fitToScreen")}
                aria-label={t("fitToScreen")}
              >
                <Maximize2 className="w-3 h-3" aria-hidden="true" />
              </Button>
            </div>

            {/* Compare button (only show if has processed image) */}
            {hasProcessedImage && (
              <>
                <div className="w-px h-6 bg-foreground/20" aria-hidden="true" />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleComparison}
                  className="w-7 h-7 md:w-8 md:h-8 hover:bg-foreground/10 border-0 text-foreground [&_svg]:text-foreground"
                  title={t("compare")}
                  aria-label={t("compare")}
                >
                  <SplitSquareHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
