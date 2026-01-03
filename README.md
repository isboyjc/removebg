<div align="center">

<img src="public/icon.svg" alt="Remove BG Logo" width="120" />

# Remove BG

**AI 驱动的智能抠图工具 | AI-Powered Background Remover**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-rmbg.picgo.studio-blue?style=for-the-badge)](https://rmbg.picgo.studio)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)](https://github.com/isboyjc/removebg/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<p align="center">
  <strong>🚀 秒级处理 · 🔒 本地运行 · 💯 完全免费 · ✨ 高质量输出</strong>
</p>

[![GitHub](https://img.shields.io/badge/GitHub-isboyjc-181717?style=flat&logo=github)](https://github.com/isboyjc/removebg)
[![X](https://img.shields.io/badge/X-@isboyjc-000000?style=flat&logo=x)](https://x.com/isboyjc)

[English](#english) | [简体中文](#简体中文)

</div>

## 简体中文

### ✨ 简介

**Remove BG** 是一款基于 AI 技术的在线智能抠图工具。使用先进的 [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) 和 [U2Net](https://github.com/xuebinqin/U-2-Net) 深度学习模型，可以精准识别图片主体并智能去除背景。

🌟 **核心亮点：所有处理完全在浏览器本地进行，图片不会上传到任何服务器，充分保护您的隐私！**

### 🎯 在线体验

访问 **[rmbg.picgo.studio](https://rmbg.picgo.studio)** 立即体验！

### 🚀 功能特性

| 功能 | 描述 |
|------|------|
| 🎯 **精准抠图** | 使用先进的 AI 模型，精准识别主体并去除背景 |
| 🔄 **模型切换** | 支持 RMBG-1.4 和 U2Net 两种模型，可根据场景选择最佳效果 |
| 🧵 **Web Worker 后台处理** | 模型推理在独立线程运行，主线程完全不阻塞，处理期间可自由操作 |
| 🔒 **隐私安全** | 所有处理完全在本地进行，图片不会上传到任何服务器 |
| 👁️ **实时对比** | 处理完成后可以左右对比查看处理前后的效果差异 |
| 🎨 **Neo-Brutalism 设计** | 采用现代 Neo-Brutalism 设计风格，提供独特的视觉体验 |
| 📥 **高清导出** | 支持导出原始分辨率的透明背景图片，保持图片质量 |
| 🌍 **多语言支持** | 支持简体中文、English、日本語、한국어、Русский |
| 🎭 **主题切换** | 支持浅色和深色模式，可跟随系统设置自动切换 |
| 📱 **PWA 支持** | 可安装为桌面应用，支持离线使用 |

### 🤖 AI 模型说明

#### U2Net (推荐)
- **特点**: 通用场景效果更好，适合大多数图片，推荐优先使用
- **适用场景**: 人像、产品、动物等各类主体抠图

#### RMBG-1.4
- **特点**: 某些特定场景下可能效果更佳，可作为备选方案
- **适用场景**: 复杂背景、细节丰富的图片

### 📖 使用方法

1. **上传图片** - 拖拽或点击上传需要处理的图片（支持 JPG、PNG、WebP）
2. **自动处理** - AI 模型自动识别主体并去除背景
3. **对比查看** - 使用对比滑块查看处理前后效果
4. **调整视图** - 使用缩放和平移功能查看细节
5. **切换模型** - 如果效果不理想，可在设置中切换其他模型重新处理
6. **下载结果** - 预览效果满意后下载透明背景图片

### 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| **语言** | [TypeScript 5](https://www.typescriptlang.org/) |
| **样式** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **AI 推理** | [ONNX Runtime Web](https://onnxruntime.ai/) + Web Worker |
| **AI 模型** | [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) + [U2Net](https://github.com/xuebinqin/U-2-Net) |
| **动画** | [Framer Motion](https://www.framer.com/motion/) |
| **国际化** | [next-intl](https://next-intl-docs.vercel.app/) |
| **UI 组件** | [Radix UI](https://www.radix-ui.com/) |

### 📦 本地开发

```bash
# 克隆项目
git clone https://github.com/isboyjc/removebg.git
cd removebg

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 🌍 国际化

Remove BG 支持以下语言：

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇷🇺 Русский

### 🎨 主题

支持浅色模式和深色模式，可跟随系统设置自动切换。

### 🌐 浏览器兼容性

- Chrome/Edge: >= 90
- Firefox: >= 88
- Safari: >= 14
- 需要支持 WebAssembly 和 Cache API

---

## English

### ✨ Introduction

**Remove BG** is an AI-powered online background removal tool. Using advanced [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) and [U2Net](https://github.com/xuebinqin/U-2-Net) deep learning models, it can accurately identify subjects and intelligently remove backgrounds.

🌟 **Key Highlight: All processing is done entirely in your browser locally. Images are never uploaded to any server, fully protecting your privacy!**

### 🎯 Live Demo

Visit **[rmbg.picgo.studio](https://rmbg.picgo.studio)** to try it now!

### 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎯 **Precise Removal** | Uses advanced AI models to accurately identify subjects and remove backgrounds |
| 🔄 **Model Switching** | Supports RMBG-1.4 and U2Net models, choose the best for your scenario |
| 🧵 **Web Worker Processing** | Model inference runs in a separate thread, keeping the main thread responsive during processing |
| 🔒 **Privacy Safe** | All processing is done locally, images are never uploaded to any server |
| 👁️ **Real-time Comparison** | Compare before and after effects with a side-by-side slider |
| 🎨 **Neo-Brutalism Design** | Modern Neo-Brutalism design style for a unique visual experience |
| 📥 **HD Export** | Export results at original resolution with transparent background, maintaining image quality |
| 🌍 **Multi-language** | Supports Simplified Chinese, English, Japanese, Korean, Russian |
| 🎭 **Theme Switching** | Supports light and dark mode, can automatically switch based on system settings |
| 📱 **PWA Support** | Install as a desktop app with offline support |

### 🤖 AI Models

#### U2Net (Recommended)
- **Features**: Better performance for general scenarios, suitable for most images, recommended first choice
- **Use Cases**: Portraits, products, animals, and various subject removal

#### RMBG-1.4
- **Features**: May perform better in certain specific scenarios, can be used as an alternative
- **Use Cases**: Complex backgrounds, detail-rich images

### 📖 How to Use

1. **Upload Image** - Drag and drop or click to upload an image (supports JPG, PNG, WebP)
2. **Auto Processing** - AI model automatically identifies subject and removes background
3. **Compare View** - Use the comparison slider to view before and after effects
4. **Adjust View** - Use zoom and pan features to view details
5. **Switch Model** - If the result is not ideal, switch to another model in settings and reprocess
6. **Download Result** - Preview the result and download the transparent background image

### 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **AI Inference** | [ONNX Runtime Web](https://onnxruntime.ai/) + Web Worker |
| **AI Models** | [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) + [U2Net](https://github.com/xuebinqin/U-2-Net) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |

### 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/isboyjc/removebg.git
cd removebg

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 🌍 Internationalization

Remove BG supports the following languages:

- 🇨🇳 Simplified Chinese
- 🇺🇸 English
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇷🇺 Russian

### 🎨 Theme

Supports light and dark mode, can automatically switch based on system settings.

### 🌐 Browser Compatibility

- Chrome/Edge: >= 90
- Firefox: >= 88
- Safari: >= 14
- Requires WebAssembly and Cache API support

---

<div align="center">

## 📄 License

[MIT](./LICENSE) © [isboyjc](https://github.com/isboyjc)

[![Follow on X](https://img.shields.io/badge/Follow_@isboyjc-000000?style=flat&logo=x)](https://x.com/isboyjc)
[![GitHub](https://img.shields.io/github/stars/isboyjc/removebg?style=social)](https://github.com/isboyjc/removebg)

---

**⭐ 如果这个项目对你有帮助，请给它一个 Star！**

**⭐ If this project helps you, please give it a Star!**

<br />

Made with ❤️ and AI

</div>
