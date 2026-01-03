"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Hero } from "@/components/Hero"
import { Capabilities } from "@/components/Capabilities"
import { Examples } from "@/components/Examples"
import { HowItWorks } from "@/components/HowItWorks"
import { FAQ } from "@/components/FAQ"
import { ImageEditor } from "@/components/ImageEditor"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import type { ModelType } from "@/lib/rmbg-worker"

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelType>("u2net")
  const t = useTranslations("accessibility")

  const handleImagesSelect = (files: File[], modelType: ModelType) => {
    setSelectedImages(files)
    setSelectedModel(modelType)
    setIsEditorOpen(true)
  }

  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setSelectedImages([])
  }

  return (
    <main className="min-h-screen bg-background relative">
      {/* Skip navigation link - accessibility optimization */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:border-2 focus:border-foreground focus:rounded-lg focus:shadow-brutal-sm"
      >
        {t("skipToContent")}
      </a>

      <Navbar />
      <div id="main-content">
        <Hero onImagesSelect={handleImagesSelect} />
        <Capabilities />
        <Examples />
        <HowItWorks />
        <FAQ />
      </div>
      <Footer />

      {selectedImages.length > 0 && (
        <ImageEditor
          key={selectedImages.map(f => f.name + f.lastModified).join("-")}
          images={selectedImages}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          modelType={selectedModel}
        />
      )}
    </main>
  )
}
