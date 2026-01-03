/// <reference lib="webworker" />

import * as ort from "onnxruntime-web"

// Worker 内部配置
ort.env.wasm.numThreads = 1
ort.env.wasm.simd = true
ort.env.logLevel = "error"
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/"

// 模型配置
export type ModelType = "rmbg" | "u2net"

const MODEL_CONFIGS = {
  rmbg: {
    url: "https://cdn.isboyjc.com/models/rmbg/rmbg1.4.onnx",
    inputSize: 1024,
    inputName: "input",
    outputName: "output"
  },
  u2net: {
    url: "https://cdn.isboyjc.com/models/u2net/u2net.onnx",
    inputSize: 320,
    inputName: "input.1",
    outputName: "1959"
  }
}

const CACHE_NAME = "removebg-model-cache-v1"

let session: ort.InferenceSession | null = null
let currentModelType: ModelType = "rmbg"

// 消息类型定义
type WorkerMessage =
  | { type: "loadModel"; modelType: ModelType }
  | { type: "process"; imageData: ImageData }

type WorkerResponse =
  | { type: "modelLoaded"; modelType: ModelType }
  | { type: "modelProgress"; progress: number }
  | { type: "modelError"; error: string }
  | { type: "processResult"; imageData: ImageData }
  | { type: "processError"; error: string }

// 发送消息给主线程
function postResponse(response: WorkerResponse) {
  self.postMessage(response)
}

// 从缓存或网络加载模型
async function getModelBuffer(
  modelUrl: string,
  onProgress: (progress: number) => void
): Promise<ArrayBuffer> {
  // 检查缓存
  if ("caches" in self) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(modelUrl)
      if (cachedResponse) {
        console.log("[Worker] 从缓存加载模型")
        onProgress(0.3)
        const buffer = await cachedResponse.arrayBuffer()
        onProgress(0.8)
        return buffer
      }
    } catch (e) {
      console.warn("[Worker] 缓存读取失败:", e)
    }
  }

  // 从网络下载
  console.log("[Worker] 从网络下载模型")
  onProgress(0.1)

  const response = await fetch(modelUrl)
  if (!response.ok) {
    throw new Error(`模型下载失败: ${response.status}`)
  }

  const contentLength = response.headers.get("content-length")
  const total = contentLength ? parseInt(contentLength, 10) : 0
  const reader = response.body?.getReader()
  if (!reader) throw new Error("无法读取响应流")

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    if (total > 0) {
      onProgress(0.1 + (received / total) * 0.6)
    }
  }

  const buffer = new Uint8Array(received)
  let position = 0
  for (const chunk of chunks) {
    buffer.set(chunk, position)
    position += chunk.length
  }

  onProgress(0.75)

  // 缓存模型
  if ("caches" in self) {
    try {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(modelUrl, new Response(buffer.buffer))
      console.log("[Worker] 模型已缓存")
    } catch (e) {
      console.warn("[Worker] 缓存写入失败:", e)
    }
  }

  onProgress(0.8)
  return buffer.buffer
}

// 加载模型
async function loadModel(modelType: ModelType) {
  // 如果当前模型类型相同且已加载，直接返回
  if (session && currentModelType === modelType) {
    postResponse({ type: "modelLoaded", modelType })
    return
  }

  // 切换模型时只清理会话，不清除缓存
  // 这样可以保留其他模型的缓存，下次切换时可以快速加载
  if (session && currentModelType !== modelType) {
    session = null
  }

  currentModelType = modelType

  try {
    const config = MODEL_CONFIGS[modelType]
    const modelBuffer = await getModelBuffer(config.url, (progress) => {
      postResponse({ type: "modelProgress", progress })
    })

    postResponse({ type: "modelProgress", progress: 0.85 })

    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    })

    console.log(`[Worker] ${modelType} 模型加载完成`)
    postResponse({ type: "modelProgress", progress: 1 })
    postResponse({ type: "modelLoaded", modelType })
  } catch (error) {
    const message = error instanceof Error ? error.message : "模型加载失败"
    postResponse({ type: "modelError", error: message })
  }
}

// 预处理图像
function preprocessImage(imageData: ImageData, targetSize: number) {
  const originalSize = { width: imageData.width, height: imageData.height }

  // 计算缩放比例（保持宽高比）
  const scale = Math.min(targetSize / imageData.width, targetSize / imageData.height)
  const scaledWidth = Math.round(imageData.width * scale)
  const scaledHeight = Math.round(imageData.height * scale)

  // 创建目标尺寸的 canvas（居中放置）
  const canvas = new OffscreenCanvas(targetSize, targetSize)
  const ctx = canvas.getContext("2d")!

  // 填充黑色背景
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, targetSize, targetSize)

  // 计算居中位置
  const offsetX = Math.floor((targetSize - scaledWidth) / 2)
  const offsetY = Math.floor((targetSize - scaledHeight) / 2)

  // 绘制缩放后的图像
  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height)
  const tempCtx = tempCanvas.getContext("2d")!
  tempCtx.putImageData(imageData, 0, 0)
  ctx.drawImage(tempCanvas, offsetX, offsetY, scaledWidth, scaledHeight)

  const scaledImageData = ctx.getImageData(0, 0, targetSize, targetSize)

  // 转换为张量 [1, 3, H, W]，归一化到 [0, 1]
  const imageArray = new Float32Array(3 * targetSize * targetSize)

  for (let i = 0; i < targetSize * targetSize; i++) {
    const pixelIdx = i * 4
    imageArray[i] = scaledImageData.data[pixelIdx] / 255
    imageArray[targetSize * targetSize + i] = scaledImageData.data[pixelIdx + 1] / 255
    imageArray[2 * targetSize * targetSize + i] = scaledImageData.data[pixelIdx + 2] / 255
  }

  return {
    imageTensor: new ort.Tensor("float32", imageArray, [1, 3, targetSize, targetSize]),
    scale,
    originalSize,
    scaledWidth,
    scaledHeight,
    offsetX,
    offsetY,
  }
}

// 后处理输出
function postprocessOutput(
  output: ort.Tensor,
  originalSize: { width: number; height: number },
  scaledWidth: number,
  scaledHeight: number,
  offsetX: number,
  offsetY: number,
  targetSize: number
): ImageData {
  const maskData = output.data as Float32Array
  const [, , height, width] = output.dims

  // 创建 alpha 蒙版
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.createImageData(width, height)

  // 转换蒙版值到 alpha 通道
  for (let i = 0; i < width * height; i++) {
    const pixelIdx = i * 4
    const alpha = Math.max(0, Math.min(255, Math.round(maskData[i] * 255)))

    imageData.data[pixelIdx] = 255
    imageData.data[pixelIdx + 1] = 255
    imageData.data[pixelIdx + 2] = 255
    imageData.data[pixelIdx + 3] = alpha
  }

  ctx.putImageData(imageData, 0, 0)

  // 裁剪出有效区域（去除 padding）
  const croppedCanvas = new OffscreenCanvas(scaledWidth, scaledHeight)
  const croppedCtx = croppedCanvas.getContext("2d")!
  croppedCtx.drawImage(
    canvas,
    offsetX,
    offsetY,
    scaledWidth,
    scaledHeight,
    0,
    0,
    scaledWidth,
    scaledHeight
  )

  // 缩放回原始尺寸
  const finalCanvas = new OffscreenCanvas(originalSize.width, originalSize.height)
  const finalCtx = finalCanvas.getContext("2d")!
  finalCtx.drawImage(croppedCanvas, 0, 0, originalSize.width, originalSize.height)

  return finalCtx.getImageData(0, 0, originalSize.width, originalSize.height)
}

// 处理图像
async function processImage(imageData: ImageData) {
  if (!session) {
    postResponse({ type: "processError", error: "模型未加载" })
    return
  }

  try {
    const config = MODEL_CONFIGS[currentModelType]
    const {
      imageTensor,
      originalSize,
      scaledWidth,
      scaledHeight,
      offsetX,
      offsetY,
    } = preprocessImage(imageData, config.inputSize)

    const results = await session.run({
      [config.inputName]: imageTensor,
    })

    const output = results[config.outputName]
    const maskImageData = postprocessOutput(
      output,
      originalSize,
      scaledWidth,
      scaledHeight,
      offsetX,
      offsetY,
      config.inputSize
    )

    postResponse({ type: "processResult", imageData: maskImageData })
  } catch (error) {
    const message = error instanceof Error ? error.message : "处理失败"
    postResponse({ type: "processError", error: message })
  }
}

// 监听消息
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data

  switch (type) {
    case "loadModel":
      await loadModel(event.data.modelType)
      break
    case "process":
      await processImage(event.data.imageData)
      break
  }
}

export {}
