"use client"

import { useState, useCallback, useRef } from "react"

export interface EditorState {
  image: HTMLImageElement | null
  originalImage: HTMLImageElement | null
  backgroundRemovedData: ImageData | null
  zoom: number
  pan: { x: number; y: number }
  isProcessing: boolean
  showComparison: boolean
  comparisonPosition: number
  backgroundColor: string
  revealProgress: number // 0 = fully processed, 1 = original image
}

export function useImageEditor() {
  const [state, setState] = useState<EditorState>({
    image: null,
    originalImage: null,
    backgroundRemovedData: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    isProcessing: false,
    showComparison: false,
    comparisonPosition: 50,
    backgroundColor: "transparent",
    revealProgress: 0,
  })

  const fitZoomRef = useRef<number>(1)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // 计算适合视口的缩放值
  const calculateFitZoom = useCallback((img: HTMLImageElement): number => {
    if (!canvasContainerRef.current) return 1

    const container = canvasContainerRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const padding = 40
    const availableWidth = containerWidth - padding * 2
    const availableHeight = containerHeight - padding * 2

    const scaleX = availableWidth / img.width
    const scaleY = availableHeight / img.height

    return Math.min(scaleX, scaleY, 1)
  }, [])

  // 初始化适应缩放
  const initializeFitZoom = useCallback((img: HTMLImageElement) => {
    const fitZoom = calculateFitZoom(img)
    fitZoomRef.current = fitZoom
    setState((prev) => ({ ...prev, zoom: fitZoom, pan: { x: 0, y: 0 } }))
  }, [calculateFitZoom])

  // 重置到适应缩放
  const resetToFitZoom = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: fitZoomRef.current,
      pan: { x: 0, y: 0 },
    }))
  }, [])

  // 设置图像
  const setImage = useCallback(
    (img: HTMLImageElement | null) => {
      if (img) {
        initializeFitZoom(img)
        setState((prev) => ({
          ...prev,
          image: img,
          originalImage: img,
          backgroundRemovedData: null,
          showComparison: false,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          image: null,
          originalImage: null,
          backgroundRemovedData: null,
        }))
      }
    },
    [initializeFitZoom]
  )

  // 设置缩放
  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({
      ...prev,
      zoom: Math.max(fitZoomRef.current * 0.25, Math.min(fitZoomRef.current * 4, zoom)),
    }))
  }, [])

  // 设置平移
  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState((prev) => ({ ...prev, pan }))
  }, [])

  // 设置处理后的背景去除数据
  const setBackgroundRemovedData = useCallback((data: ImageData | null) => {
    setState((prev) => ({ ...prev, backgroundRemovedData: data }))
  }, [])

  // 应用背景去除结果
  const applyBackgroundRemoved = useCallback((maskData: ImageData) => {
    if (!state.originalImage) return

    const canvas = document.createElement("canvas")
    canvas.width = maskData.width
    canvas.height = maskData.height
    const ctx = canvas.getContext("2d")!

    // First, draw the original image
    ctx.drawImage(state.originalImage, 0, 0)

    // Get the original image data
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Apply the mask (alpha channel) from maskData to the original image
    for (let i = 0; i < originalImageData.data.length; i += 4) {
      // Keep the original RGB values
      // Only update the alpha channel from the mask
      originalImageData.data[i + 3] = maskData.data[i + 3]
    }

    // Clear canvas and draw the result
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(originalImageData, 0, 0)

    const newImage = new Image()
    newImage.onload = () => {
      setState((prev) => ({
        ...prev,
        image: newImage,
        backgroundRemovedData: maskData,
      }))
    }
    newImage.src = canvas.toDataURL("image/png")
  }, [state.originalImage])

  // 设置是否正在处理
  const setIsProcessing = useCallback((isProcessing: boolean) => {
    setState((prev) => ({ ...prev, isProcessing }))
  }, [])

  // 切换对比模式
  const toggleComparison = useCallback(() => {
    setState((prev) => ({ ...prev, showComparison: !prev.showComparison }))
  }, [])

  // 设置对比位置
  const setComparisonPosition = useCallback((position: number) => {
    setState((prev) => ({ ...prev, comparisonPosition: position }))
  }, [])

  // 设置背景颜色
  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, backgroundColor: color }))
  }, [])

  // 设置揭示进度
  const setRevealProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, revealProgress: Math.max(0, Math.min(1, progress)) }))
  }, [])

  // 恢复到原图
  const resetToOriginal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      image: prev.originalImage,
      backgroundRemovedData: null,
    }))
  }, [])

  // 单独设置原图（用于批量处理时切换图片）
  const setOriginalImage = useCallback((img: HTMLImageElement | null) => {
    setState((prev) => ({ ...prev, originalImage: img }))
  }, [])

  return {
    state,
    canvasContainerRef,
    fitZoom: fitZoomRef.current,
    setImage,
    setZoom,
    setPan,
    setBackgroundRemovedData,
    applyBackgroundRemoved,
    setIsProcessing,
    resetToFitZoom,
    toggleComparison,
    setComparisonPosition,
    setBackgroundColor,
    setRevealProgress,
    resetToOriginal,
    setOriginalImage,
  }
}
