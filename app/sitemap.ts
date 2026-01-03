import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rmbg.picgo.studio"
  const locales = ["zh", "en", "ja", "ko", "ru"]
  const lastModified = new Date()

  // 生成所有语言版本的页面
  const pages: MetadataRoute.Sitemap = []

  // 首页
  locales.forEach((locale) => {
    pages.push({
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    })
  })

  // 更新日志页面
  locales.forEach((locale) => {
    pages.push({
      url: `${baseUrl}/${locale}/changelog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  return pages
}
