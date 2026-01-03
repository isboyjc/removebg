"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Pipette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BackgroundColorPickerProps {
  backgroundColor: string
  onColorChange: (color: string) => void
  disabled?: boolean
}

export function BackgroundColorPicker({
  backgroundColor,
  onColorChange,
  disabled = false,
}: BackgroundColorPickerProps) {
  const t = useTranslations("editor.backgroundColorPicker")

  const PRESET_COLORS = [
    { label: t("colors.transparent"), value: "transparent" },
    { label: t("colors.white"), value: "#FFFFFF" },
    { label: t("colors.black"), value: "#000000" },
    { label: t("colors.lightGray"), value: "#F5F5F5" },
    { label: t("colors.gray"), value: "#808080" },
    { label: t("colors.darkGray"), value: "#333333" },
    { label: t("colors.red"), value: "#FF0000" },
    { label: t("colors.pink"), value: "#FF69B4" },
    { label: t("colors.orange"), value: "#FF8C00" },
    { label: t("colors.gold"), value: "#FFD700" },
    { label: t("colors.yellow"), value: "#FFFF00" },
    { label: t("colors.lightGreen"), value: "#90EE90" },
    { label: t("colors.green"), value: "#00FF00" },
    { label: t("colors.darkGreen"), value: "#006400" },
    { label: t("colors.cyan"), value: "#00FFFF" },
    { label: t("colors.skyBlue"), value: "#87CEEB" },
    { label: t("colors.blue"), value: "#0000FF" },
    { label: t("colors.darkBlue"), value: "#00008B" },
    { label: t("colors.purple"), value: "#800080" },
    { label: t("colors.magenta"), value: "#FF00FF" },
    { label: t("colors.brown"), value: "#8B4513" },
    { label: t("colors.beige"), value: "#F5F5DC" },
    { label: t("colors.olive"), value: "#808000" },
    { label: t("colors.navy"), value: "#000080" },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [hexInput, setHexInput] = useState("")
  const [hexError, setHexError] = useState(false)

  // Sync hexInput with backgroundColor when it changes
  useEffect(() => {
    if (backgroundColor !== "transparent" && backgroundColor.startsWith("#")) {
      setHexInput(backgroundColor)
    } else if (backgroundColor === "transparent") {
      setHexInput("")
    }
  }, [backgroundColor])

  const handlePresetClick = (color: string) => {
    onColorChange(color)
  }

  const validateAndApplyHex = (hex: string) => {
    // Remove # if present
    const cleanHex = hex.replace("#", "")

    // Validate hex format (3 or 6 characters)
    const hexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/

    if (hexRegex.test(cleanHex)) {
      setHexError(false)
      // Convert 3-char hex to 6-char
      let fullHex = cleanHex
      if (cleanHex.length === 3) {
        fullHex = cleanHex.split("").map(c => c + c).join("")
      }
      onColorChange(`#${fullHex.toUpperCase()}`)
      setHexInput("")
    } else {
      setHexError(true)
    }
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHexInput(value)
    setHexError(false)
  }

  const handleHexInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hexInput) {
      validateAndApplyHex(hexInput)
    }
  }

  const handleApplyClick = () => {
    if (hexInput) {
      validateAndApplyHex(hexInput)
    }
  }

  const isTransparent = backgroundColor === "transparent"

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="relative w-5 h-5 md:w-6 md:h-6 text-foreground hover:bg-foreground/10 border-0 disabled:opacity-30"
          title={t("title")}
          aria-label={t("title")}
        >
          <div className="absolute inset-0.5 rounded-sm overflow-hidden border border-foreground">
            {isTransparent ? (
              // Checkerboard pattern for transparent
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: "3px 3px",
                  backgroundPosition: "0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px",
                }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center" sideOffset={20}>
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-sm mb-2">{t("title")}</h4>

            {/* Preset colors */}
            <div className="grid grid-cols-8 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handlePresetClick(color.value)}
                  className={`
                    w-full aspect-square rounded-lg border-2 transition-all relative overflow-hidden
                    ${backgroundColor === color.value
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-foreground/20 hover:border-foreground/50"
                    }
                  `}
                  title={color.label}
                  aria-label={color.label}
                >
                  {color.value === "transparent" ? (
                    // Checkerboard pattern for transparent
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #ccc 25%, transparent 25%),
                          linear-gradient(-45deg, #ccc 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #ccc 75%),
                          linear-gradient(-45deg, transparent 75%, #ccc 75%)
                        `,
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: color.value }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom hex color input */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t("customColor")}</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                onKeyDown={handleHexInputKeyDown}
                placeholder="#FFF"
                className={`h-8 flex-1 min-w-0 rounded-lg border-2 px-2 text-xs ${
                  hexError ? 'border-red-500' : 'border-foreground'
                }`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyClick}
                className="shrink-0 h-8 px-2.5 text-xs"
              >
                {t("apply")}
              </Button>
            </div>
            {hexError && (
              <p className="text-xs text-red-500 mt-1">{t("invalidHex")}</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
