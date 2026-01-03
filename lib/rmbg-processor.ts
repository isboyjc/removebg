"use client"

import type { ModelType } from "./rmbg-worker"

// Worker 实例
let worker: Worker | null = null
let isWorkerLoading = false
let isModelLoadedInWorker = false
let currentLoadedModel: ModelType = "rmbg"

// 回调队列
type ProgressCallback = (progress: number) => void

let loadingCallbacks: ProgressCallback[] = []
let loadResolvers: Array<{ resolve: () => void; reject: (error: Error) => void }> = []
let processResolver: { resolve: (result: ImageData) => void; reject: (error: Error) => void } | null = null

// 初始化 Worker
function initWorker(): Worker {
  if (worker) return worker

  worker = new Worker(new URL("./rmbg-worker.ts", import.meta.url), { type: "module" })

  worker.onmessage = (event) => {
    const { type } = event.data

    switch (type) {
      case "modelProgress":
        const progress = event.data.progress as number
        loadingCallbacks.forEach((cb) => cb(progress))
        break

      case "modelLoaded":
        isModelLoadedInWorker = true
        isWorkerLoading = false
        currentLoadedModel = event.data.modelType
        loadingCallbacks = []
        loadResolvers.forEach(({ resolve }) => resolve())
        loadResolvers = []
        break

      case "modelError":
        isWorkerLoading = false
        const loadError = new Error(event.data.error)
        loadResolvers.forEach(({ reject }) => reject(loadError))
        loadResolvers = []
        break

      case "processResult":
        if (processResolver) {
          processResolver.resolve(event.data.imageData)
          processResolver = null
        }
        break

      case "processError":
        if (processResolver) {
          processResolver.reject(new Error(event.data.error))
          processResolver = null
        }
        break
    }
  }

  worker.onerror = (error) => {
    console.error("[RemoveBG] Worker 错误:", error)
    if (processResolver) {
      processResolver.reject(new Error("Worker 执行错误"))
      processResolver = null
    }
  }

  return worker
}

// 加载模型
export async function loadModel(
  modelType: ModelType = "rmbg",
  onProgress?: (progress: number) => void
): Promise<void> {
  // 如果模型已加载且是同一个模型
  if (isModelLoadedInWorker && currentLoadedModel === modelType) {
    onProgress?.(1)
    return
  }

  // 如果正在加载，等待
  if (isWorkerLoading) {
    return new Promise((resolve, reject) => {
      if (onProgress) loadingCallbacks.push(onProgress)
      loadResolvers.push({ resolve, reject })
    })
  }

  isWorkerLoading = true
  if (onProgress) loadingCallbacks.push(onProgress)

  const w = initWorker()

  return new Promise((resolve, reject) => {
    loadResolvers.push({ resolve, reject })
    w.postMessage({ type: "loadModel", modelType })
  })
}

// 处理图片
export async function processImage(
  image: HTMLImageElement,
  modelType: ModelType = "rmbg",
  onProgress?: (progress: number) => void
): Promise<ImageData> {
  // 确保模型已加载
  if (!isModelLoadedInWorker || currentLoadedModel !== modelType) {
    await loadModel(modelType, onProgress)
  }

  const w = initWorker()

  // 将 HTMLImageElement 转换为 ImageData
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)

  return new Promise((resolve, reject) => {
    processResolver = { resolve, reject }
    w.postMessage({
      type: "process",
      imageData,
    })
  })
}

// 应用蒙版到图像（去除背景）
export function applyMaskToImage(
  originalImage: ImageData,
  maskImage: ImageData
): ImageData {
  const result = new ImageData(originalImage.width, originalImage.height)

  for (let i = 0; i < originalImage.width * originalImage.height; i++) {
    const idx = i * 4
    result.data[idx] = originalImage.data[idx]
    result.data[idx + 1] = originalImage.data[idx + 1]
    result.data[idx + 2] = originalImage.data[idx + 2]
    result.data[idx + 3] = maskImage.data[idx + 3] // 使用蒙版的 alpha
  }

  return result
}

// 检查模型是否已加载
export function isModelLoaded(): boolean {
  return isModelLoadedInWorker
}

// 获取当前加载的模型
export function getCurrentModel(): ModelType {
  return currentLoadedModel
}

// 检查模型缓存是否存在
export async function isModelCached(modelType: ModelType): Promise<boolean> {
  const MODEL_URLS = {
    rmbg: "https://cdn.isboyjc.com/models/rmbg/rmbg1.4.onnx",
    u2net: "https://cdn.isboyjc.com/models/u2net/u2net.onnx",
  }
  const CACHE_NAME = "removebg-model-cache-v1"

  if (typeof window === "undefined" || !("caches" in window)) {
    return false
  }

  try {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(MODEL_URLS[modelType])
    return cachedResponse !== undefined
  } catch (e) {
    console.warn("检查缓存失败:", e)
    return false
  }
}
