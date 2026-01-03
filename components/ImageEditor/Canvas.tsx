"use client"

import { useEffect, useRef } from "react"

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  image: HTMLImageElement | null
  backgroundRemovedData: ImageData | null
  zoom: number
  pan: { x: number; y: number }
  isProcessing: boolean
  backgroundColor: string
  revealProgress: number // 0 = fully processed, 1 = original image
}

export function Canvas({
  canvasRef,
  image,
  backgroundRemovedData,
  zoom,
  pan,
  isProcessing,
  backgroundColor,
  revealProgress,
}: CanvasProps) {
  // Initialize canvas and draw image
  useEffect(() => {
    if (!image) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (this will also clear canvas content)
    canvas.width = image.width
    canvas.height = image.height

    // Clear canvas to ensure it's clean
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

      const pattern = ctx.createPattern(patternCanvas, "repeat")
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw image with reveal animation
    if (backgroundRemovedData) {
      // Create a temporary canvas to apply the mask
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")!

      // Draw the original image
      tempCtx.drawImage(image, 0, 0)

      // Get the original image data
      const originalImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

      // Apply the mask (alpha channel) from backgroundRemovedData to the original image
      for (let i = 0; i < originalImageData.data.length; i += 4) {
        // Keep the original RGB values
        // Only update the alpha channel from the mask
        originalImageData.data[i + 3] = backgroundRemovedData.data[i + 3]
      }

      // Put the masked image data on the temp canvas
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempCtx.putImageData(originalImageData, 0, 0)

      // Calculate the reveal boundary (from right to left)
      // revealProgress: 1 = show original, 0 = show processed
      // revealX represents the boundary position (moves from right to left)
      const revealX = canvas.width * revealProgress

      if (revealProgress < 1) {
        // Draw original image (left side - not yet revealed)
        if (revealX > 0) {
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, revealX, canvas.height)
          ctx.clip()
          ctx.drawImage(image, 0, 0)
          ctx.restore()
        }

        // Draw processed image (right side - already revealed)
        if (revealX < canvas.width) {
          ctx.save()
          ctx.beginPath()
          ctx.rect(revealX, 0, canvas.width - revealX, canvas.height)
          ctx.clip()
          ctx.drawImage(tempCanvas, 0, 0)
          ctx.restore()
        }
      } else {
        // Fully original (animation hasn't started)
        ctx.drawImage(image, 0, 0)
      }
    } else {
      ctx.drawImage(image, 0, 0)
    }
  }, [image, backgroundRemovedData, backgroundColor, canvasRef, revealProgress])

  if (!image) {
    return (
      <div className="flex items-center justify-center text-muted-foreground p-8 text-center">
        Loading image...
      </div>
    )
  }

  return (
    <>
      {/* Canvas container */}
      <div
        className="relative touch-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Main canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-none shadow-2xl rounded-lg"
          style={{
            touchAction: "none",
          }}
        />

        {/* Processing breathing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 rounded-lg pointer-events-none bg-background/25 animate-pulse" />
        )}
      </div>
    </>
  )
}
