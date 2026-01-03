"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { X, Download, Check, Loader2, Images } from "lucide-react"
import { Dialog, DialogContentFullscreen, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { useImageEditor } from "@/hooks/useImageEditor"
import { Canvas } from "./Canvas"
import { ToolPanel } from "./ToolPanel"
import { CompareSlider } from "./CompareSlider"
import { useRemoveBgModel } from "@/hooks/useRemoveBgModel"
import { ModelLoadingScreen } from "./ModelLoadingScreen"
import { processImage, isModelCached } from "@/lib/rmbg-processor"
import { setSelectedModel } from "@/lib/model-storage"
import { motion, AnimatePresence } from "framer-motion"
import JSZip from "jszip"

import type { ModelType } from "@/lib/rmbg-worker"

interface ImageItem {
  file: File
  originalImage: HTMLImageElement | null
  processedImage: HTMLImageElement | null
  processedCanvas: HTMLCanvasElement | null
  status: "pending" | "processing" | "done" | "error"
  usedModel: ModelType | null
}

interface ImageEditorProps {
  images: File[]
  isOpen: boolean
  onClose: () => void
  modelType?: ModelType
}

export function ImageEditor({ images, isOpen, onClose, modelType = "u2net" }: ImageEditorProps) {
  const t = useTranslations("editor.toolbar")
  const tBatch = useTranslations("editor.batch")
  const tModelLabel = useTranslations("editor.modelLabel")
  const {
    state,
    canvasContainerRef,
    fitZoom,
    setImage,
    setZoom,
    setPan,
    setBackgroundRemovedData,
    setIsProcessing,
    resetToFitZoom,
    toggleComparison,
    setComparisonPosition,
    setBackgroundColor,
    setRevealProgress,
    resetToOriginal,
    setOriginalImage,
  } = useImageEditor()

  // Batch state
  const [imageItems, setImageItems] = useState<ImageItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Track current model being used
  const [currentModelType, setCurrentModelType] = useState<ModelType>(modelType)
  const [u2netReady, setU2netReady] = useState(false)
  const [rmbgReady, setRmbgReady] = useState(false)

  const { isLoading: isModelLoading, isLoaded, isCached, progress, load } = useRemoveBgModel(currentModelType)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)
  const [isFitZoomReady, setIsFitZoomReady] = useState(false)
  const processingQueueRef = useRef<boolean>(false)
  const isDownloadingRef = useRef<boolean>(false)
  const isAnimatingRef = useRef<boolean>(false)

  // Initialize image items when images change
  useEffect(() => {
    if (!isOpen) return

    const items: ImageItem[] = images.map(file => ({
      file,
      originalImage: null,
      processedImage: null,
      processedCanvas: null,
      status: "pending",
      usedModel: null,
    }))
    setImageItems(items)
    setCurrentIndex(0)
  }, [images, isOpen])

  // Load ALL images when editor opens
  useEffect(() => {
    if (!isOpen || imageItems.length === 0) return

    imageItems.forEach((item, index) => {
      if (item.originalImage) return // Already loaded

      const img = new Image()
      img.onload = () => {
        setImageItems(prev => {
          const newItems = [...prev]
          if (!newItems[index].originalImage) {
            newItems[index] = { ...newItems[index], originalImage: img }
          }
          return newItems
        })
      }
      img.src = URL.createObjectURL(item.file)
    })
  }, [isOpen, imageItems.length])

  // Load model when dialog opens
  useEffect(() => {
    if (isOpen && !isLoaded && !isModelLoading) {
      load()
    }
  }, [isOpen, isLoaded, isModelLoading, load])

  // Check cache status for both models
  useEffect(() => {
    if (isOpen) {
      isModelCached("u2net").then(setU2netReady)
      isModelCached("rmbg").then(setRmbgReady)
    }
  }, [isOpen])

  // Update cache status when model is loaded
  useEffect(() => {
    if (isLoaded) {
      if (currentModelType === "u2net") {
        setU2netReady(true)
      } else {
        setRmbgReady(true)
      }
    }
  }, [isLoaded, currentModelType])

  // Sync current image to editor state
  useEffect(() => {
    if (!isOpen || imageItems.length === 0) return
    // Don't sync during animation - let the animation control the state
    if (isAnimatingRef.current) return

    const currentItem = imageItems[currentIndex]
    if (!currentItem) return

    // If processed, show processed image
    if (currentItem.processedImage && currentItem.originalImage) {
      setImage(currentItem.processedImage)
      setOriginalImage(currentItem.originalImage)
      setBackgroundRemovedData(null) // Clear to prevent re-masking
      setRevealProgress(0)
      setIsFitZoomReady(false)
      return
    }

    // If original is loaded, show it
    if (currentItem.originalImage) {
      setImage(currentItem.originalImage)
      setOriginalImage(currentItem.originalImage)
      setBackgroundRemovedData(null)
      setRevealProgress(0)
      setIsFitZoomReady(false)
    }
  }, [currentIndex, imageItems, isOpen, setImage, setOriginalImage, setBackgroundRemovedData, setRevealProgress])

  // Initialize fit zoom after image loads and model is ready
  useEffect(() => {
    if (state.image && isOpen && !isModelLoading && !isFitZoomReady) {
      const timer = setTimeout(() => {
        if (canvasContainerRef.current) {
          const rect = canvasContainerRef.current.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            setIsFitZoomReady(true)
          }
        }
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [state.image, isOpen, isModelLoading, isFitZoomReady, canvasContainerRef])

  // Process all images in batch
  const processAllImages = useCallback(async () => {
    if (!isLoaded || processingQueueRef.current) return

    processingQueueRef.current = true

    for (let i = 0; i < imageItems.length; i++) {
      const item = imageItems[i]
      if (item.status !== "pending" || !item.originalImage) continue

      // Update status to processing
      setImageItems(prev => {
        const newItems = [...prev]
        newItems[i] = { ...newItems[i], status: "processing" }
        return newItems
      })

      // If this is current image, show processing state
      if (i === currentIndex) {
        setIsProcessing(true)
      }

      try {
        const result = await processImage(item.originalImage, currentModelType)
        if (result) {
          // Create canvas and apply mask to original image
          const canvas = document.createElement("canvas")
          canvas.width = result.width
          canvas.height = result.height
          const ctx = canvas.getContext("2d")!

          // Draw original image first
          ctx.drawImage(item.originalImage, 0, 0)

          // Get original image data
          const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          // Apply alpha channel from mask result to original image
          for (let p = 0; p < originalImageData.data.length; p += 4) {
            originalImageData.data[p + 3] = result.data[p + 3]
          }

          // Put the masked image data back
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.putImageData(originalImageData, 0, 0)

          // Create image from canvas
          const processedImg = new Image()
          await new Promise<void>((resolve) => {
            processedImg.onload = () => resolve()
            processedImg.src = canvas.toDataURL("image/png")
          })

          // If this is current image, mark animation BEFORE updating imageItems
          // to prevent sync effect from running
          if (i === currentIndex) {
            isAnimatingRef.current = true
          }

          setImageItems(prev => {
            const newItems = [...prev]
            newItems[i] = {
              ...newItems[i],
              processedImage: processedImg,
              processedCanvas: canvas,
              status: "done",
              usedModel: currentModelType,
            }
            return newItems
          })

          // If this is current image, update the display with animation
          if (i === currentIndex) {
            // Set reveal progress to 1 FIRST (show original)
            setRevealProgress(1)
            // Then set the background removed data for the mask
            setBackgroundRemovedData(result)

            // Wait a frame for the state to update
            await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))

            const duration = 800
            const startTime = performance.now()

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)
              const easeOut = 1 - Math.pow(1 - progress, 3)
              setRevealProgress(1 - easeOut)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                // Animation complete - switch to processed image directly
                setImage(processedImg)
                setOriginalImage(item.originalImage)
                setBackgroundRemovedData(null) // Clear mask data
                setRevealProgress(0)
                // Animation done, allow sync effect to run again
                isAnimatingRef.current = false
              }
            }

            requestAnimationFrame(animate)
          }
        }
      } catch (error) {
        console.error(`Failed to process image ${i}:`, error)
        setImageItems(prev => {
          const newItems = [...prev]
          newItems[i] = { ...newItems[i], status: "error" }
          return newItems
        })
      }

      if (i === currentIndex) {
        setIsProcessing(false)
      }
    }

    processingQueueRef.current = false
  }, [isLoaded, imageItems, currentIndex, currentModelType, setIsProcessing, setBackgroundRemovedData, setRevealProgress, setImage])

  // Start batch processing when model is loaded and images are ready
  useEffect(() => {
    if (!isLoaded || imageItems.length === 0) return

    const hasPending = imageItems.some(item => item.status === "pending" && item.originalImage)
    if (hasPending && !processingQueueRef.current) {
      processAllImages()
    }
  }, [isLoaded, imageItems, processAllImages])

  // Get client point from mouse/touch event
  const getClientPoint = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if ('touches' in e) {
      if (e.touches.length === 0) return null
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }, [])

  // Mouse/touch down handler (for panning)
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      e.preventDefault()
    }

    const clientPoint = getClientPoint(e)
    if (!clientPoint) return
    setIsPanning(true)
    lastPanPointRef.current = clientPoint
  }, [getClientPoint])

  // Mouse/touch move handler (for panning)
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      e.preventDefault()
    }

    if (isPanning) {
      const clientPoint = getClientPoint(e)
      if (!clientPoint || !lastPanPointRef.current) return

      const dx = clientPoint.x - lastPanPointRef.current.x
      const dy = clientPoint.y - lastPanPointRef.current.y

      setPan({
        x: state.pan.x + dx,
        y: state.pan.y + dy,
      })

      lastPanPointRef.current = clientPoint
    }
  }, [isPanning, state.pan, getClientPoint, setPan])

  // Mouse/touch up handler
  const handlePointerUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false)
      lastPanPointRef.current = null
    }
  }, [isPanning])

  // Download single image
  const handleDownloadSingle = useCallback(() => {
    const currentItem = imageItems[currentIndex]
    if (!currentItem?.processedCanvas) return

    const link = document.createElement("a")
    link.download = `${currentItem.file.name.replace(/\.[^/.]+$/, "")}-nobg.png`
    link.href = currentItem.processedCanvas.toDataURL("image/png")
    link.click()
  }, [imageItems, currentIndex])

  // Download all images as ZIP
  const handleDownloadAll = useCallback(async () => {
    if (isDownloadingRef.current) return
    isDownloadingRef.current = true

    const doneItems = imageItems.filter(item => item.status === "done" && item.processedCanvas)
    if (doneItems.length === 0) {
      isDownloadingRef.current = false
      return
    }

    try {
      const zip = new JSZip()

      for (const item of doneItems) {
        if (!item.processedCanvas) continue
        const dataUrl = item.processedCanvas.toDataURL("image/png")
        const base64 = dataUrl.split(",")[1]
        const fileName = `${item.file.name.replace(/\.[^/.]+$/, "")}-nobg.png`
        zip.file(fileName, base64, { base64: true })
      }

      const blob = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.download = "removebg-batch.zip"
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Failed to create ZIP:", error)
    } finally {
      isDownloadingRef.current = false
    }
  }, [imageItems])

  // Handle model change
  const handleModelChange = useCallback(async (newModel: ModelType) => {
    if (newModel === currentModelType || state.isProcessing) return

    resetToOriginal()
    setCurrentModelType(newModel)
    setSelectedModel(newModel)
    window.dispatchEvent(new Event("modelSelectionChange"))

    // Reset all items to pending for re-processing
    setImageItems(prev => prev.map(item => ({
      ...item,
      processedImage: null,
      processedCanvas: null,
      status: "pending",
      usedModel: null,
    })))
  }, [currentModelType, state.isProcessing, resetToOriginal])

  // Navigate to previous/next image
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFitZoomReady(false)
      resetToFitZoom()
    }
  }, [currentIndex, resetToFitZoom])

  const handleNext = useCallback(() => {
    if (currentIndex < imageItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFitZoomReady(false)
      resetToFitZoom()
    }
  }, [currentIndex, imageItems.length, resetToFitZoom])

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -fitZoom * 0.1 : fitZoom * 0.1
    setZoom(state.zoom + delta)
  }, [state.zoom, setZoom, fitZoom])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "+":
        case "=":
          setZoom(state.zoom + fitZoom * 0.1)
          break
        case "-":
          setZoom(state.zoom - fitZoom * 0.1)
          break
        case "0":
          resetToFitZoom()
          break
        case "ArrowLeft":
          handlePrev()
          break
        case "ArrowRight":
          handleNext()
          break
        case "c":
          if (state.originalImage && state.image !== state.originalImage) {
            toggleComparison()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, state.zoom, state.originalImage, state.image, setZoom, resetToFitZoom, fitZoom, toggleComparison, handlePrev, handleNext])

  // Prevent mobile body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  // Get cursor class for canvas area
  const getCanvasCursorClass = () => {
    if (state.isProcessing) return "!cursor-wait"
    if (state.showComparison) return ""
    if (!isMouseInCanvas) return ""
    return isPanning ? "!cursor-grabbing" : "!cursor-grab"
  }

  // Stats
  const doneCount = imageItems.filter(item => item.status === "done").length
  const totalCount = imageItems.length
  const currentItem = imageItems[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContentFullscreen showCloseButton={false}>
        <VisuallyHidden.Root>
          <DialogTitle>Image Editor</DialogTitle>
        </VisuallyHidden.Root>

        {/* Show loading screen while model is loading */}
        {isModelLoading ? (
          <ModelLoadingScreen
            progress={progress}
            isCached={isCached}
            modelName={currentModelType === "rmbg" ? "RMBG-1.4" : "U2Net"}
          />
        ) : (
          <div className="relative h-full">
              {/* Canvas area */}
              <div
                ref={canvasContainerRef}
                className={`h-full relative overflow-hidden flex items-center justify-center touch-none ${getCanvasCursorClass()}`}
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  backgroundImage: 'radial-gradient(var(--canvas-dot) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseEnter={() => setIsMouseInCanvas(true)}
                onMouseLeave={() => {
                  handlePointerUp()
                  setIsMouseInCanvas(false)
                }}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onTouchCancel={handlePointerUp}
                onWheel={handleWheel}
              >
                {/* Top bar */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    className="pointer-events-auto w-10 h-10 bg-card/90 backdrop-blur-sm hover:bg-card border-2 border-border/20 shadow-lg [&_svg]:text-foreground"
                    aria-label={t("close")}
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </Button>

                  {/* Center: Model label & progress */}
                  {currentItem?.usedModel && currentItem.status === "done" && (
                    <motion.div
                      className="pointer-events-auto px-4 py-2 bg-card/90 backdrop-blur-sm border-2 border-border/20 rounded-lg shadow-lg"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">
                        {tModelLabel("generatedWith", { model: currentItem.usedModel === "rmbg" ? "RMBG-1.4" : "U2Net" })}
                      </p>
                    </motion.div>
                  )}

                  {/* Right: Batch progress (only show when multiple images) */}
                  {imageItems.length > 1 && (
                    <motion.div
                      className="pointer-events-auto px-3 py-1.5 bg-card/90 backdrop-blur-sm border-2 border-border/20 rounded-lg shadow-lg"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Images className="w-3.5 h-3.5" />
                        <span>{doneCount}/{totalCount}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Fade in canvas after fit zoom is ready to prevent flash */}
                <div style={{ opacity: isFitZoomReady ? 1 : 0, transition: 'opacity 0.15s ease-out' }}>
                  {state.showComparison && state.originalImage && state.image !== state.originalImage ? (
                    <CompareSlider
                      originalImage={state.originalImage}
                      currentImage={state.image}
                      position={state.comparisonPosition}
                      onPositionChange={setComparisonPosition}
                      zoom={state.zoom}
                      pan={state.pan}
                      backgroundColor={state.backgroundColor}
                    />
                  ) : (
                    <Canvas
                      canvasRef={canvasRef}
                      image={state.image}
                      backgroundRemovedData={state.backgroundRemovedData}
                      zoom={state.zoom}
                      pan={state.pan}
                      isProcessing={state.isProcessing}
                      backgroundColor={state.backgroundColor}
                      revealProgress={state.revealProgress}
                    />
                  )}
                </div>

                {/* Floating thumbnails on the right (only for multiple images) */}
                <AnimatePresence>
                  {imageItems.length > 1 && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-h-[60vh] overflow-y-auto overflow-x-visible scrollbar-hide py-2 px-2"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseEnter={() => setIsMouseInCanvas(false)}
                    >
                      {imageItems.map((item, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setCurrentIndex(index)
                            setIsFitZoomReady(false)
                            resetToFitZoom()
                          }}
                          className={`
                            relative w-12 h-12 rounded-lg border-3 flex-shrink-0 bg-muted
                            ${index === currentIndex
                              ? "border-primary shadow-[2px_2px_0_var(--foreground)]"
                              : "border-foreground/40 hover:border-foreground/80"
                            }
                          `}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Checkerboard background for processed images */}
                          {item.processedImage && (
                            <div
                              className="absolute inset-0 rounded-md"
                              style={{
                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                backgroundSize: '8px 8px',
                                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                              }}
                            />
                          )}

                          {/* Thumbnail image */}
                          {item.originalImage ? (
                            <img
                              src={item.processedImage?.src || item.originalImage.src}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                          )}

                          {/* Status indicator */}
                          <div className="absolute -top-1.5 -right-1.5">
                            {item.status === "processing" && (
                              <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background">
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              </div>
                            )}
                            {item.status === "done" && (
                              <div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center border-2 border-background">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom floating tool panel - center */}
                <ToolPanel
                  zoom={state.zoom}
                  fitZoom={fitZoom}
                  onZoomIn={() => setZoom(state.zoom + fitZoom * 0.25)}
                  onZoomOut={() => setZoom(state.zoom - fitZoom * 0.25)}
                  onZoomReset={resetToFitZoom}
                  isProcessing={state.isProcessing}
                  hasProcessedImage={state.image !== state.originalImage && !!state.originalImage}
                  showComparison={state.showComparison}
                  onToggleComparison={toggleComparison}
                  backgroundColor={state.backgroundColor}
                  onBackgroundColorChange={setBackgroundColor}
                  currentModel={currentModelType}
                  onModelChange={handleModelChange}
                  u2netReady={u2netReady}
                  rmbgReady={rmbgReady}
                  onMouseEnter={() => setIsMouseInCanvas(false)}
                  onMouseLeave={(e: React.MouseEvent) => {
                    const container = canvasContainerRef.current
                    if (container) {
                      const rect = container.getBoundingClientRect()
                      const { clientX, clientY } = e
                      if (
                        clientX >= rect.left &&
                        clientX <= rect.right &&
                        clientY >= rect.top &&
                        clientY <= rect.bottom
                      ) {
                        setIsMouseInCanvas(true)
                      }
                    }
                  }}
                />

                {/* Download buttons - floating on bottom right */}
                {doneCount > 0 && (
                  <motion.div
                    className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20 flex items-center gap-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    onMouseEnter={() => setIsMouseInCanvas(false)}
                  >
                    {/* Download current */}
                    {currentItem?.status === "done" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadSingle}
                        className="gap-1.5 h-11 md:h-12 bg-card border-2 border-border/20 rounded-xl px-3 md:px-4 shadow-xl text-foreground [&_svg]:text-foreground"
                        title={t("download")}
                      >
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">{t("download")}</span>
                      </Button>
                    )}

                    {/* Download all as ZIP (only show when multiple done) */}
                    {doneCount > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadAll}
                        className="gap-1.5 h-11 md:h-12 bg-primary text-primary-foreground border-2 border-foreground rounded-xl px-3 md:px-4 shadow-[3px_3px_0_var(--foreground)] hover:shadow-[4px_4px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <Images className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">{tBatch("downloadAll")} ({doneCount})</span>
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>
          </div>
        )}
      </DialogContentFullscreen>
    </Dialog>
  )
}
