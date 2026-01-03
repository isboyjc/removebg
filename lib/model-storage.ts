"use client"

import type { ModelType } from "./rmbg-worker"

const STORAGE_KEY = "removebg-selected-model"

/**
 * 获取用户选择的模型类型
 */
export function getSelectedModel(): ModelType {
  if (typeof window === "undefined") return "u2net"

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "rmbg" || stored === "u2net") {
      return stored
    }
  } catch (e) {
    console.warn("Failed to read model selection from localStorage:", e)
  }

  return "u2net" // 默认值
}

/**
 * 保存用户选择的模型类型
 */
export function setSelectedModel(modelType: ModelType): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, modelType)
  } catch (e) {
    console.warn("Failed to save model selection to localStorage:", e)
  }
}
