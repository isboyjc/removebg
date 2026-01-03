"use client"

import { useState, useEffect, useCallback } from "react"
import { loadModel, isModelLoaded, getCurrentModel, isModelCached } from "@/lib/rmbg-processor"
import type { ModelType } from "@/lib/rmbg-worker"

export function useRemoveBgModel(modelType: ModelType = "rmbg") {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isCached, setIsCached] = useState(false)

  // 检查缓存
  useEffect(() => {
    isModelCached(modelType).then(setIsCached)
  }, [modelType])

  // 检查模型是否已加载
  useEffect(() => {
    setIsLoaded(isModelLoaded() && getCurrentModel() === modelType)
  }, [modelType])

  // 加载模型
  const load = useCallback(async () => {
    if (isLoaded) return

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      await loadModel(modelType, (p) => {
        setProgress(p)
      })
      setIsLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "模型加载失败")
    } finally {
      setIsLoading(false)
    }
  }, [modelType, isLoaded])

  return {
    isLoading,
    isLoaded,
    progress,
    error,
    isCached,
    load,
  }
}
