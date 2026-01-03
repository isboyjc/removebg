/**
 * SVG to PNG conversion script
 * 将 SVG logo 转换为各种尺寸的 PNG 图片
 *
 * 使用方法:
 * 1. 安装依赖: pnpm add -D sharp
 * 2. 运行脚本: node scripts/generate-icons.mjs
 */

import sharp from 'sharp'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 需要生成的图标尺寸
const ICON_SIZES = [
  16,   // favicon
  32,   // favicon
  48,   // favicon
  72,   // PWA
  96,   // favicon / PWA
  128,  // PWA
  144,  // PWA
  152,  // Apple Touch Icon
  180,  // Apple Touch Icon
  192,  // PWA
  512,  // PWA
]

// 路径配置
const PUBLIC_DIR = join(__dirname, '..', 'public')
const ICONS_DIR = join(PUBLIC_DIR, 'icons')
const SVG_SOURCE = join(PUBLIC_DIR, 'icon.svg')

async function generateIcons() {
  console.log('🎨 开始生成图标...\n')

  // 检查源文件是否存在
  if (!existsSync(SVG_SOURCE)) {
    console.error('❌ 源文件不存在:', SVG_SOURCE)
    process.exit(1)
  }

  // 确保输出目录存在
  if (!existsSync(ICONS_DIR)) {
    mkdirSync(ICONS_DIR, { recursive: true })
    console.log('📁 创建目录:', ICONS_DIR)
  }

  // 读取 SVG 文件
  const svgBuffer = readFileSync(SVG_SOURCE)

  // 生成各尺寸的 PNG
  for (const size of ICON_SIZES) {
    const outputPath = join(ICONS_DIR, `icon-${size}x${size}.png`)

    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath)

      console.log(`✅ 生成: icon-${size}x${size}.png`)
    } catch (error) {
      console.error(`❌ 生成失败: icon-${size}x${size}.png`, error.message)
    }
  }

  console.log('\n🎉 图标生成完成!')
  console.log(`📍 输出目录: ${ICONS_DIR}`)
  console.log('\n💡 提示: 请手动将 icon.svg 转换为 favicon.ico 放在 app 目录下')
}

generateIcons().catch(console.error)
