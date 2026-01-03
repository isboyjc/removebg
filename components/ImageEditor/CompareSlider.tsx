"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"

interface CompareSliderProps {
  originalImage: HTMLImageElement | null
  currentImage: HTMLImageElement | null
  position: number
  onPositionChange: (position: number) => void
  zoom: number
  pan: { x: number; y: number }
  backgroundColor: string
}

export function CompareSlider({
  originalImage,
  currentImage,
  position,
  onPositionChange,
  zoom,
  pan,
  backgroundColor,
}: CompareSliderProps) {
  const t = useTranslations("editor.compare")
  const containerRef = useRef<HTMLDivElement>(null)
  const originalCanvasRef = useRef<HTMLCanvasElement>(null)
  const currentCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Initialize canvases
  useEffect(() => {
    if (!originalImage || !currentImage) return

    const originalCanvas = originalCanvasRef.current
    const currentCanvas = currentCanvasRef.current
    if (!originalCanvas || !currentCanvas) return

    // Set canvas sizes
    originalCanvas.width = originalImage.width
    originalCanvas.height = originalImage.height
    currentCanvas.width = currentImage.width
    currentCanvas.height = currentImage.height

    // Draw original image
    const originalCtx = originalCanvas.getContext("2d")
    if (originalCtx) {
      originalCtx.drawImage(originalImage, 0, 0)
    }

    // Draw current image with background color
    const currentCtx = currentCanvas.getContext("2d")
    if (currentCtx) {
      // Clear canvas
      currentCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height)

      // Draw background color or checkerboard pattern
      if (backgroundColor === "transparent") {
        // Create checkerboard pattern for transparent background
        const patternSize = 16
        const patternCanvas = document.createElement("canvas")
        patternCanvas.width = patternSize * 2
        patternCanvas.height = patternSize * 2
        const patternCtx = patternCanvas.getContext("2d")!

        // Draw checkerboard
        patternCtx.fillStyle = "#FFFFFF"
        patternCtx.fillRect(0, 0, patternSize * 2, patternSize * 2)
        patternCtx.fillStyle = "#E0E0E0"
        patternCtx.fillRect(0, 0, patternSize, patternSize)
        patternCtx.fillRect(patternSize, patternSize, patternSize, patternSize)

        const pattern = currentCtx.createPattern(patternCanvas, "repeat")
        if (pattern) {
          currentCtx.fillStyle = pattern
          currentCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height)
        }
      } else {
        currentCtx.fillStyle = backgroundColor
        currentCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height)
      }

      // Draw current image on top
      currentCtx.drawImage(currentImage, 0, 0)
    }
  }, [originalImage, currentImage, backgroundColor])

  // Calculate position from clientX
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    onPositionChange(Math.max(0, Math.min(100, percentage)))
  }, [onPositionChange])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation() // Prevent canvas panning
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation() // Prevent canvas panning
      calculatePosition(e.clientX)
    }
  }, [isDragging, calculatePosition])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation() // Prevent canvas panning
    setIsDragging(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return
    e.preventDefault()
    e.stopPropagation() // Prevent canvas panning
    calculatePosition(e.touches[0].clientX)
  }, [isDragging, calculatePosition])

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false)
      const handleGlobalTouchEnd = () => setIsDragging(false)

      window.addEventListener("mouseup", handleGlobalMouseUp)
      window.addEventListener("touchend", handleGlobalTouchEnd)

      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp)
        window.removeEventListener("touchend", handleGlobalTouchEnd)
      }
    }
  }, [isDragging])

  if (!originalImage || !currentImage) return null

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-2xl cursor-col-resize touch-none"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: "center center",
        width: originalImage.width,
        height: originalImage.height,
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Current image (bottom layer, processed result) */}
      <canvas
        ref={currentCanvasRef}
        className="absolute top-0 left-0"
      />

      {/* Original image (with clip) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <canvas
          ref={originalCanvasRef}
          className="max-w-none"
          style={{ width: originalImage.width, height: originalImage.height }}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 bg-white cursor-col-resize z-10"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: Math.max(2, 4 / zoom), // Line width adjusts based on zoom
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle - apply inverse scale to maintain fixed visual size */}
        <div
          className="absolute top-1/2 left-1/2 bg-white rounded-full border-3 border-foreground shadow-[3px_3px_0_var(--foreground)] flex items-center justify-center"
          style={{
            transform: `translate(-50%, -50%) scale(${1 / zoom})`,
            width: 44,
            height: 44,
          }}
        >
          <GripVertical className="w-5 h-5 text-foreground" />
        </div>
      </div>

      {/* Labels - apply inverse scale to maintain fixed visual size */}
      <div
        className="absolute bg-foreground text-background text-sm font-bold rounded-lg px-3 py-1 whitespace-nowrap"
        style={{
          top: 16 / zoom,
          left: 16 / zoom,
          transform: `scale(${1 / zoom})`,
          transformOrigin: "top left",
        }}
      >
        {t("original")}
      </div>
      <div
        className="absolute bg-primary text-foreground text-sm font-bold rounded-lg px-3 py-1 border-2 border-foreground whitespace-nowrap"
        style={{
          top: 16 / zoom,
          right: 16 / zoom,
          transform: `scale(${1 / zoom})`,
          transformOrigin: "top right",
        }}
      >
        {t("noBackground")}
      </div>
    </motion.div>
  )
}
