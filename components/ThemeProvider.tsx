"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // Get system theme
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }, [])

  // Apply theme to DOM
  const applyTheme = useCallback((newResolvedTheme: "light" | "dark") => {
    const root = document.documentElement
    if (newResolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    setResolvedTheme(newResolvedTheme)
  }, [])

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)

    const resolved = newTheme === "system" ? getSystemTheme() : newTheme
    applyTheme(resolved)
  }, [getSystemTheme, applyTheme])

  // Initialize - only on client side
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const initialTheme = savedTheme || "system"
    setThemeState(initialTheme)

    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme
    applyTheme(resolved)
    setMounted(true)
  }, [getSystemTheme, applyTheme])

  // Listen to system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted, getSystemTheme, applyTheme])

  // Provide consistent initial value to avoid hydration mismatch
  const value = {
    theme: mounted ? theme : "system",
    setTheme,
    resolvedTheme: mounted ? resolvedTheme : "light",
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
