"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeftRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ModelType } from "@/lib/rmbg-worker"

interface ModelSwitcherProps {
  currentModel: ModelType
  onModelChange: (model: ModelType) => void
  isProcessing: boolean
  u2netReady: boolean
  rmbgReady: boolean
}

export function ModelSwitcher({
  currentModel,
  onModelChange,
  isProcessing,
  u2netReady,
  rmbgReady,
}: ModelSwitcherProps) {
  const t = useTranslations("editor.modelSwitcher")
  const tPanel = useTranslations("editor.toolPanel")
  const [isOpen, setIsOpen] = useState(false)

  const models = [
    {
      value: "u2net" as const,
      label: t("u2net"),
      description: t("u2netDesc"),
      ready: u2netReady,
    },
    {
      value: "rmbg" as const,
      label: t("rmbg"),
      description: t("rmbgDesc"),
      ready: rmbgReady,
    },
  ]

  const handleModelSelect = (model: ModelType) => {
    if (model !== currentModel) {
      onModelChange(model)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isProcessing}
          className="w-7 h-7 md:w-8 md:h-8 hover:bg-foreground/10 border-0 disabled:opacity-30 text-foreground [&_svg]:text-foreground"
          title={tPanel("switchModel")}
          aria-label={tPanel("switchModel")}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center" sideOffset={20}>
        <div className="space-y-3">
          <h4 className="font-bold text-sm">{tPanel("selectModel")}</h4>

          <div className="space-y-2">
            {models.map((model) => (
              <button
                key={model.value}
                onClick={() => handleModelSelect(model.value)}
                className={`
                  w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer
                  ${currentModel === model.value
                    ? "border-primary bg-primary/10"
                    : "border-foreground/20 hover:border-foreground/50"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm flex items-center gap-2">
                      {model.label}
                      {currentModel === model.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {model.description}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        model.ready
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {model.ready ? t("ready") : t("notReady")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
